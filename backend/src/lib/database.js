import {PrismaClient} from '@prisma/client'
import io from './websocket.js'
import {MaxXp, MaxLevel, Condition} from '../../../shared.js'

const prisma = new PrismaClient()

// noinspection JSUnresolvedReference
class Database {
    static async #getCharacter(name, model) {
        const character = await model.findUnique({
            where: {name},
            include: {
                containers: true,
                abilities: true
            }
        })
        return character
    }

    static async getPlayer(name) {
        const player = await Database.#getCharacter(name, prisma.player)
        return player
    }

    static async getNpc(name) {
        const npc = await Database.#getCharacter(name, prisma.npc)
        return npc
    }

    static async getPlayers() {
        const players = await prisma.player.findMany({
            include: {
                containers: true,
                abilities: true
            }
        })
        return players
    }

    static async getPlayerNames() {
        const players = await prisma.player.findMany({select: {name: true}})
        const playerNames = players.map(player => player.name)
        return playerNames
    }

    static async #getTemplates(model) {
        const templates = await model.findMany()
        return templates
    }

    static async getAbilityTemplates() {
        return await this.#getTemplates(prisma.abilityTemplate)
    }

    static async getItemTemplates() {
        return await this.#getTemplates(prisma.itemTemplate)
    }

    static async getNpcTemplates() {
        return await this.#getTemplates(prisma.npcTemplate)
    }

    static async addAbilityTemplate(template) {
        await prisma.abilityTemplate.create({data: template})
        const abilityTemplates = await Database.getAbilityTemplates()
        let players = await Database.getPlayers()
        for (const player of players) {
            const abilityNames = player.abilities.map(ability => ability.name)
            if (!abilityNames.includes(template.name)) {
                await prisma.player.update({
                    where: {
                        name: player.name
                    },
                    data: {
                        abilities: {
                            create: template
                        }
                    }
                })
            }
        }
        players = await Database.getPlayers()
        io.emit('update-global-state', {
            players,
            abilityTemplates
        })
    }

    static async addItemTemplate(templateData) {
        // TODO this can be re-used by addContainerTemplate and addAbilityTemplate in a helper function. Remember to so io.emit('update-global-state', ...)
        await prisma.itemTemplate.create({
            data: templateData,
        })
    }

    static async addContainerTemplate(templateData) {
        // TODO test
        await prisma.containerTemplate.create({
            data: templateData,
        })
    }

    static async deleteTemplate(name, model, type) {
        await model.delete({where: {name}})
        const templates = await Database.#getTemplates(model)
        const players = await Database.getPlayers()
        io.emit('update-global-state', {
            players,
            [type + 'Templates']: templates
        })
    }

    static async deleteAbilityTemplate(name) {
        await prisma.npcAbilityTemplate.deleteMany({where: {name}})
        await prisma.npcAbility.deleteMany({where: {name}})
        await prisma.playerAbility.deleteMany({where: {name}})
        await Database.deleteTemplate(name, prisma.abilityTemplate, 'ability')
    }

    static async deleteItemTemplate(name) {
        await Database.deleteTemplate(name, prisma.itemTemplate, 'item')
    }

    static async deleteContainerTemplate(name) {
        await Database.deleteTemplate(name, prisma.containerTemplate, 'container')
    }

    static async deleteNpcTemplate(name) {
        await Database.deleteTemplate(name, prisma.npcTempalte, 'npc')
    }

    static async addPlayer(name) {
        const abilityTemplates = await Database.getAbilityTemplates()
        await prisma.player.create({
            data: {
                name,
                abilities: {
                    create: abilityTemplates
                },
                containers: {
                    create: [{
                        name: 'satchel',
                        weightCapacity: 50
                    }]
                }
            }
        })
        const players = await Database.getPlayers()
        io.emit('update-global-state', {players})
    }

    static async addNpc(name) {
        // TODO test
        const characterTemplate = await prisma.characterTemplate.findUnique({
            where: {name},
        })

        if (!characterTemplate) throw new Error('Character template not found')

        await prisma.nPC.create({
            data: {
                name,
                abilities: {
                    create: characterTemplate.abilities.map(abilityTemplate => ({
                        name: abilityTemplate.name,
                        level: abilityTemplate.level,
                        tmpDiff: 0,
                        effectedConditions: abilityTemplate.effectedConditions,
                    })),
                },
                inventory: {
                    create: characterTemplate.inventory.map(containerTemplate => ({
                        name: containerTemplate.name,
                        weightCapacity: containerTemplate.weightCapacity,
                        items: {
                            create: containerTemplate.items.map(itemTemplate => ({
                                name: itemTemplate.name,
                                weight: itemTemplate.weight,
                                price: itemTemplate.price,
                                effectedAbilities: itemTemplate.effectedAbilities,
                                effectedConditions: itemTemplate.effectedConditions,
                                maxCharges: itemTemplate.maxCharges,
                                charges: itemTemplate.charges,
                            })),
                        },
                    })),
                },
                health: 100,
                stamina: 100,
            },
        })
    }

    static async addNpcAbilityTemplate(name, npcName, abilityData) {
        // TODO test
        const npc = await prisma.npc.findUnique({
            where: {name: npcName},
        })

        if (!npc) throw new Error('NPC not found')

        await prisma.npcAbility.create({
            data: {
                name,
                ...abilityData,
                npcs: {
                    connect: {name: npcName},
                },
            },
        })
    }

    static async abilityCheck(success, player, ability) {
        let {
            xp,
            level
        } = ability
        if (success && level < MaxLevel) {
            xp += 1
            if (xp === MaxXp) {
                xp = 0
                level += 1
            }
            await prisma.player.update({
                where: {name: player.name},
                data: {
                    abilities: {
                        update: {
                            where: {
                                playerName_name: {
                                    playerName: player.name,
                                    name: ability.name
                                },
                            },
                            data: {
                                xp,
                                level
                            }
                        }
                    }
                }
            })
        }
        const players = await Database.updatePlayerConditions(player, ability.effectedConditions)
        io.emit('update-global-state', {players})
    }

    static #updatePlayerCondition(player, condition, effect) {
        player[condition] += effect
        player[condition] = player[condition] >= 0 ? player[condition] : 0
        const maxCondition = player[`max${condition.charAt(0).toUpperCase() + condition.slice(1)}`]
        player[condition] = player[condition] <= maxCondition ? player[condition] : maxCondition
    }

    static async updatePlayerConditions(player, effectedConditions) {
        for (const condition of Object.keys(effectedConditions)) {
            Database.#updatePlayerCondition(player, condition, effectedConditions[condition])
        }
        for (const condition of [Condition.Stamina, Condition.Hunger, Condition.Thirst, Condition.Fatigue]) {
            if (player[condition] === 0) {
                Database.#updatePlayerCondition(player, Condition.Health, -1)
            }
        }
        const {
            health,
            stamina,
            fatigue,
            hunger,
            thirst,
            happiness
        } = player
        await prisma.player.update({
            where: {name: player.name},
            data: {
                health,
                stamina,
                fatigue,
                hunger,
                thirst,
                happiness
            }
        })
        const players = await Database.getPlayers()
        return players
    }
}

export default Database
