import {Router} from 'express'
import {getPlayer, deleteTemplate, processSliderValues} from '../lib/index.js'
import Database from '../lib/database.js'
import {CharacterType, AbilityCheckTargetType} from '../../../shared.js'
import {randomInt} from 'crypto'

const abilitiesRoutes = Router()

const getRandomInt = (min, max) => randomInt(max - min + 1) + min

abilitiesRoutes.post('/check', async (req, res) => {
    const player = await getPlayer(req)
    if (!player) return res.status(400).send('Player not found')
    const {
        abilityName,
        targetType
    } = req.body
    const findAbility = (abilities, name) => abilities.find(ability => ability.name === name)
    const ability = findAbility(player.abilities, abilityName)
    if (!ability) return res.status(400).send('Ability not found')
    let targetCheck
    if (targetType === AbilityCheckTargetType.DifficultyLevel) {
        const {difficultyLevel} = req.body
        targetCheck = difficultyLevel
    } else if (targetType === AbilityCheckTargetType.Character) {
        const {
            characterName,
            characterType,
            characterAbilityName
        } = req.body
        let character
        if (characterType === CharacterType.Player) {
            character = await Database.getPlayer(characterName)
        } else {
            character = await Database.getNpc(characterName)
        }
        if (!character) return res.status(400).send('Character not found')
        const characterAbility = findAbility(character.abilities, characterAbilityName)
        if (!characterAbility) return res.status(400).send('Character ability not found')
        targetCheck = characterAbility.level + characterAbility.tmpDiff + getRandomInt(1, 20)
    } else {
        return res.status(400).send('Invalid ability check target type')
    }
    const check = getRandomInt(1, 20)
    const total = check + ability.level + ability.tmpDiff
    const success = check >= targetCheck
    await Database.abilityCheck(success, player, ability)
    return res.status(201).json({
        success,
        abilityName,
        check,
        total,
        targetCheck
    })
})

abilitiesRoutes.post('/template', async (req, res) => {
    const {
        name,
        ...rest
    } = req.body
    const effectedConditions = processSliderValues(rest, 'ability')
    try {
        const template = {
            name,
            effectedConditions
        }
        const templates = await Database.addAbilityTemplate(template)
        res.status(201).json({templates})
    } catch (error) {
        if (error.name === 'PrismaClientKnownRequestError') {
            return res.status(400).send('Ability template already exists')
        }
        return res.status(500).send(error.message)
    }
})

abilitiesRoutes.delete('/template', async (req, res) => {
    return await deleteTemplate(req, res, Database.deleteAbilityTemplate)
})

export default abilitiesRoutes
