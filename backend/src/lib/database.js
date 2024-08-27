import {PrismaClient} from '@prisma/client'
import io from './websocket.js'

const prisma = new PrismaClient()

// noinspection JSUnresolvedReference
class Database {
    static async getPlayer(name) {
        const player = await prisma.player.findUnique({
            where: {name},
            include: {
                containers: true,
                abilities: true
            }
        })
        return player
    }

    static async getNpc(name) {
        const npc = await prisma.npc.findUnique({
            where: {name}
        })
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
        io.emit('update-global-state', {players})
        return abilityTemplates
    }

    static async addNpc(name) {
        // TODO test
        const characterTemplate = await prisma.characterTemplate.findUnique({
            where: {name},
        })

        if (!characterTemplate) throw new Error('Character template not found')

        const npc = await prisma.nPC.create({
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

        io.emit('update-global-state', {npc})
        return npc
    }

    static async addNpcAbility(name, npcName, abilityData) {
        // TODO test
        const npc = await prisma.nPC.findUnique({
            where: {name: npcName},
        })

        if (!npc) throw new Error('NPC not found')

        const npcAbility = await prisma.nPCAbility.create({
            data: {
                name,
                ...abilityData,
                npcs: {
                    connect: {name: npcName},
                },
            },
        })

        io.emit('update-global-state', {npcAbility})
        return npcAbility
    }

    static async addItemTemplate(templateData) {
        // TODO this can be re-used by addContainerTemplate and addAbilityTemplate in a helper function
        const itemTemplate = await prisma.itemTemplate.create({
            data: templateData,
        })
        return itemTemplate
    }

    static async addContainerTemplate(templateData) {
        // TODO test
        const containerTemplate = await prisma.containerTemplate.create({
            data: templateData,
        })
        return containerTemplate
    }

    static async deleteTemplate(name, model) {
        await model.delete({where: {name}})
        const templates = await Database.#getTemplates(model)
        const players = await Database.getPlayers()
        io.emit('update-global-state', {players})
        return templates
    }

    static async deleteAbilityTemplate(name) {
        await prisma.npcAbilityTemplate.deleteMany({where: {name}})
        await prisma.npcAbility.deleteMany({where: {name}})
        await prisma.playerAbility.deleteMany({where: {name}})
        return await Database.deleteTemplate(name, prisma.abilityTemplate)
    }

    static async deleteItemTemplate(name) {
        return await Database.deleteTemplate(name, prisma.itemTemplate)
    }

    static async deleteContainerTemplate(name) {
        return await Database.deleteTemplate(name, prisma.containerTemplate)
    }

    static async deleteNpcTemplate(name) {
        return await Database.deleteTemplate(name, prisma.npcTempalte)
    }

    static async abilityCheck(success, playerName, abilityName) {
        // TODO test
        const player = await prisma.player.findUnique({
            where: {name: playerName},
            include: {
                abilities: true
            }
        })
        if (!player) throw new Error('Player not found')
        const ability = player.abilities.find(a => a.name === abilityName)
        if (!ability) throw new Error('Ability not found')
        const updatedPlayer = await prisma.player.update({
            where: {name: playerName},
            data: {
                abilities: {
                    update: {
                        where: {name: abilityName},
                        data: {
                            xp: {
                                increment: success ? 1 : 0
                            },
                            level: {
                                increment: success && ability.xp >= 10 ? 1 : 0
                            }
                        }
                    }
                }
            }
        })
        const players = await Database.getPlayers()
        io.emit('update-global-state', {players})
        return updatedPlayer
    }
}

export default Database
