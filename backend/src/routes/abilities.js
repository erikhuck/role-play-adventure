import {Router} from 'express'
import {getPlayer, deleteTemplate, processSliderValues} from '../lib/index.js'
import Database from '../lib/database.js'
import {CharacterType, AbilityCheckTargetType} from '../../../shared.js'
import {randomInt} from 'crypto'

const abilitiesRoutes = Router()

const getRandomInt = (min, max) => randomInt(max - min + 1) + min

abilitiesRoutes.post('/check', async (req, res) => {
    const {
        abilityName,
        targetType,
        characterType,
        npcName
    } = req.body
    let character
    if (characterType === CharacterType.Player) {
        character = await getPlayer(req)
        if (!character) return res.status(400).send('Player not found')
    } else {
        character = await Database.getNpc(npcName)
    }
    const findAbility = (abilities, name) => abilities.find(ability => ability.name === name)
    const ability = findAbility(character.abilities, abilityName)
    if (!ability) return res.status(400).send('Ability not found')
    let targetCheck
    if (targetType === AbilityCheckTargetType.DifficultyLevel) {
        const {difficultyLevel} = req.body
        targetCheck = difficultyLevel
    } else if (targetType === AbilityCheckTargetType.Character) {
        const {
            targetName,
            targetCharacterType,
            targetAbilityName
        } = req.body
        let targetCharacter
        if (targetCharacterType === CharacterType.Player) {
            targetCharacter = await Database.getPlayer(targetName)
        } else {
            targetCharacter = await Database.getNpc(targetName)
        }
        if (!targetCharacter) return res.status(400).send('Character not found')
        const characterAbility = findAbility(targetCharacter.abilities, targetAbilityName) || {level: 0, tmpDiff: 0}
        if (!characterAbility) return res.status(400).send('Character ability not found')
        targetCheck = characterAbility.level + characterAbility.tmpDiff + getRandomInt(1, 20)
    } else {
        return res.status(400).send('Invalid ability check target type')
    }
    const check = getRandomInt(1, 20)
    const total = check + ability.level + ability.tmpDiff
    const success = check >= targetCheck
    await Database.abilityCheck(success, character, ability, characterType)
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
