import express from 'express'
import {getPlayer, deleteTemplate} from '../lib/index.js'
import Database from '../lib/database.js'
import TurnManager from '../lib/turns.js'
import {Condition} from '../../../shared.js'
import {randomInt} from 'crypto'

const abilitiesRoutes = express.Router()

const getRandomInt = (min, max) => randomInt(max - min + 1) + min

abilitiesRoutes.post('/check', async (req, res) => {
    const player = await getPlayer(req)
    if (!player) return res.status(400).send('Player not found')
    const {abilityName, targetType, difficultyLevel, characterIndex, targetAbility} = req.body
    const ability = player.abilities[abilityName]
    if (!ability) return res.status(400).send('Ability not found')
    let targetCheck
    if (targetType === 'difficulty_level') {
        targetCheck = parseInt(difficultyLevel, 10)
    } else if (targetType === 'character') {
        const character = TurnManager.turns[parseInt(characterIndex, 10)]
        if (!character) return res.status(400).send('Character not found')
        const targetAbilityObject = character.abilities[targetAbility]
        if (!targetAbilityObject) return res.status(400).send('Target ability not found')
        targetCheck = targetAbilityObject.level + targetAbilityObject.tmp_diff + getRandomInt(1, 20)
    } else {
        return res.status(400).send('Invalid ability check target type')
    }
    const abilityCheck = getRandomInt(1, 20)
    const total = abilityCheck + ability.level + ability.tmp_diff
    const success = abilityCheck >= targetCheck
    await Database.abilityCheck(success, player.name, abilityName)
    res.json({
        success,
        abilityName,
        abilityLevel: ability.level,
        abilityCheck,
        checkTotal: total,
        targetCheck,
        tmpDiff: ability.tmp_diff
    })
})

abilitiesRoutes.post('/template', async (req, res) => {
    const {name} = req.body
    const effectedConditions = Object.keys(req.body)
        .filter(key => key.startsWith('abilitySlider'))
        .reduce((acc, key) => {
            let condition = key.replace('abilitySlider', '')
            condition = Condition[condition]
            const value = parseInt(req.body[key], 10)
            if (value > 0) acc[condition] = value
            return acc
        }, {})
    try {
        const template = {name, effectedConditions}
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
