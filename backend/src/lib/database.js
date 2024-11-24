import {PrismaClient} from '@prisma/client'
import io from './websocket.js'
import {CharacterType, Condition, mapNames, MaxLevel, MaxXp} from '../../../shared.js'
import _ from 'lodash'
import TurnManager from './turns.js'

const prisma = new PrismaClient()

// noinspection JSUnresolvedReference
class Database {
    static #npcTemplateInclude = {
        include: {
            abilityTemplates: true,
            containerTemplates: true
        }
    }

    static #characterInclude = {
        include: {
            containers: {include: {items: {include: {template: true}}}},
            abilities: true
        }
    }

    static async #getCharacter(name, model) {
        return await model.findUnique({
            where: {name},
            ...this.#characterInclude
        })
    }

    static async getPlayer(name) {
        return await Database.#getCharacter(name, prisma.player)
    }

    static async getNpc(name) {
        return await Database.#getCharacter(name, prisma.npc)
    }

    static async getPlayers() {
        return await prisma.player.findMany(this.#characterInclude)
    }

    static async getPlayerNames() {
        const players = await prisma.player.findMany({select: {name: true}})
        return mapNames(players)
    }

    static async getNpcs() {
        return await prisma.npc.findMany(this.#characterInclude)
    }

    static async #getTemplates(model, include = undefined) {
        return await model.findMany(include)
    }

    static async getAbilityTemplatesOfNames(names) {
        return await prisma.abilityTemplate.findMany({
            where: {
                name: {
                    in: names
                }
            }
        })
    }

    static async getAbilityTemplates() {
        return await this.#getTemplates(prisma.abilityTemplate)
    }

    static async getItemTemplates() {
        return await this.#getTemplates(prisma.itemTemplate)
    }

    static async getContainerTemplates() {
        return await this.#getTemplates(prisma.containerTemplate)
    }

    static async getNpcTemplates() {
        return await Database.#getTemplates(prisma.npcTemplate, Database.#npcTemplateInclude)
    }

    static async #getTemplate(model, name, include = undefined) {
        return await model.findUnique({where: {name}, ...include})
    }

    static async #updatePlayers(otherUpdates){
        const players = await Database.getPlayers()
        io.emit('update-global-state', {players, ...otherUpdates})
    }

    static async #updateCharacters(otherUpdates) {
        const npcs = await Database.getNpcs()
        await this.#updatePlayers({npcs, ...otherUpdates})
    }

    static async addItem(name, containerId) {
        const template = await this.#getTemplate(prisma.itemTemplate, name)
        await prisma.item.create({
            data: {
                template: {
                    connect: {name}
                },
                charges: template.maxCharges,
                container: {
                    connect: {id: containerId}
                }
            }
        })
        await Database.#updateCharacters({})
    }

    static async addContainer(name, characterName, characterType, location) {
        const template = await Database.#getTemplate(prisma.containerTemplate, name)
        const connectClause = {[characterType]: {connect: {name: characterName}}}
        await prisma.container.create({
            data: {
                ...template,
                location,
                ...connectClause
            }
        })
        await Database.#updateCharacters({})
    }

    static async #delete(model, id) {
        await model.delete({where: {id}})
        await Database.#updateCharacters({})
    }

    static async deleteItem(id) {
        await this.#delete(prisma.item, id)
    }

    static async deleteContainer(id) {
        await this.#delete(prisma.container, id)
    }

    static async addAbilityTemplate(template) {
        await prisma.abilityTemplate.create({data: template})
        const abilityTemplates = await Database.getAbilityTemplates()
        const players = await Database.getPlayers()
        for (const player of players) {
            const abilityNames = mapNames(player.abilities)
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
        await this.#updatePlayers({abilityTemplates})
    }

    static async #addTemplate(template, model, type, include = undefined) {
        await model.create({data: template})
        const templates = await Database.#getTemplates(model, include)
        io.emit('update-global-state', {[type + 'Templates']: templates})
    }

    static async addItemTemplate(template) {
        await Database.#addTemplate(template, prisma.itemTemplate, 'item')
    }

    static async addContainerTemplate(template) {
        await Database.#addTemplate(template, prisma.containerTemplate, 'container')
    }

    static async addNpcTemplate(template) {
        const {
            name,
            maxHealth,
            maxStamina,
            carryCapacity
        } = template
        template = {
            name,
            maxHealth,
            maxStamina,
            carryCapacity,
            abilityTemplates: {
                create: template.abilityTemplates
            },
            containerTemplates: {
                connect: template.containerTemplates.map(name => ({name}))
            }
        }
        await Database.#addTemplate(template, prisma.npcTemplate, 'npc', Database.#npcTemplateInclude)
    }

    static async deleteTemplate(name, model, type, include = undefined) {
        await model.delete({where: {name}})
        const templates = await Database.#getTemplates(model, include)
        await Database.#updateCharacters({[type + 'Templates']: templates})
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
        await Database.deleteTemplate(name, prisma.npcTemplate, 'npc', Database.#npcTemplateInclude)
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
        await this.#updatePlayers({})
    }

    static async addNpc(templateName) {
        let npcs = await prisma.npc.findMany({select: {name: true}})
        const npcNames = mapNames(npcs)
        const template = await this.#getTemplate(prisma.npcTemplate, templateName, this.#npcTemplateInclude)
        let nameOccurrence = 1
        for (const npcName of npcNames) {
            if (npcName === templateName || (npcName.startsWith(`${templateName} (`) && npcName.endsWith(')'))) {
                nameOccurrence += 1
            }
        }
        let {abilityTemplates, containerTemplates, name, ...rest} = template
        if (nameOccurrence > 1) {
            name = `${name} (${nameOccurrence})`
        }
        await prisma.npc.create({
            data: {
                ...rest,
                name,
                abilities: {
                    create: abilityTemplates.map(({name, effectedConditions, level}) => ({
                        name,
                        effectedConditions,
                        level
                    }))
                },
                containers: {
                    create: containerTemplates.map(({name, weightCapacity}) => ({
                        name,
                        weightCapacity
                    }))
                },
                health: template.maxHealth,
                stamina: template.maxHealth
            }
        })
        npcs = await this.getNpcs()
        io.emit('update-global-state', {npcs})
    }

    static async deleteNpc(id){
        const npc = await prisma.npc.delete({where: {id}})
        const npcs = await this.getNpcs()
        io.emit('update-global-state', {npcs})
        TurnManager.dropTurn(npc.name)
    }

    static async abilityCheck(success, character, ability, characterType) {
        if (characterType === CharacterType.Player) {
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
                    where: {name: character.name},
                    data: {
                        abilities: {
                            update: {
                                where: {
                                    playerName_name: {
                                        playerName: character.name,
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
        }
        const characters = await Database.updateCharacterConditions(character, ability.effectedConditions, characterType)
        io.emit('update-global-state', {[`${characterType}s`]: characters})
    }

    static updateCharacterCondition(character, condition, effect) {
        let maxCondition = `max${_.startCase(condition)}`
        condition = condition.toLowerCase()
        character[condition] += effect
        character[condition] = character[condition] >= 0 ? character[condition] : 0
        maxCondition = character[maxCondition]
        character[condition] = character[condition] <= maxCondition ? character[condition] : maxCondition
    }

    static async updateCharacterConditions(character, effectedConditions, characterType) {
        for (const condition of Object.keys(effectedConditions)) {
            Database.updateCharacterCondition(character, condition, effectedConditions[condition])
        }
        for (const condition of characterType === CharacterType.Player ? [Condition.Stamina, Condition.Hunger, Condition.Thirst, Condition.Fatigue] : [Condition.Stamina]) {
            if (character[condition] === 0) {
                Database.updateCharacterCondition(character, Condition.Health, -1)
            }
        }
        const {health, stamina} = character
        let data = {health, stamina}
        if (characterType === CharacterType.Player) {
            const {fatigue, hunger, thirst, happiness} = character
            data = {fatigue, hunger, thirst, happiness, ...data}
        }
        const model = characterType === CharacterType.Npc ? prisma.npc : prisma.player
        await model.update({
            where: {name: character.name},
            data
        })
        return characterType === CharacterType.Npc ? await Database.getNpcs() : await Database.getPlayers()
    }
}

export default Database
