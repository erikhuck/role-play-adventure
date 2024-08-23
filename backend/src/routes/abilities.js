import express from 'express'
import {getPlayer} from '../lib/index.js'
import Database from '../lib/database.js'
import TurnManager from '../lib/turns.js'
import {Condition} from '../../../shared.js'
import {randomInt} from 'crypto'

const abilitiesRoutes = express.Router()

const getRandomInt = (min, max) => randomInt(max - min + 1) + min

abilitiesRoutes.post('/check', async (req, res) => {
    const player = await getPlayer(req)
    if (!player) return res.status(400).text('Player not found')
    const { abilityName, targetType, difficultyLevel, characterIndex, targetAbility } = req.body
    const ability = player.abilities[abilityName]
    if (!ability) return res.status(400).text('Ability not found')
    let targetCheck
    if (targetType === 'difficulty_level') {
        targetCheck = parseInt(difficultyLevel, 10)
    } else if (targetType === 'character') {
        const character = TurnManager.turns[parseInt(characterIndex, 10)]
        if (!character) return res.status(400).text('Character not found')
        const targetAbilityObject = character.abilities[targetAbility]
        if (!targetAbilityObject) return res.status(400).text('Target ability not found')
        targetCheck = targetAbilityObject.level + targetAbilityObject.tmp_diff + getRandomInt(1, 20)
    } else {
        return res.status(400).text('Invalid ability check target type')
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

abilitiesRoutes.get('/templates', (req, res) => {
    res.json(Object.values(db.ability_templates))
})

abilitiesRoutes.post('/template', async (req, res) => {
    const {abilityName} = req.body
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
        const template = {name: abilityName, effectedConditions: effectedConditions}
        await Database.addAbilityTemplate(template)
        res.status(201).json({message: `Ability template "${abilityName}" added`})
    } catch (error) {
        res.status(400).text(error.message)
    }
})

abilitiesRoutes.delete('/template', async (req, res) => {
    const {abilityName} = req.body
    await Database.deleteAbilityTemplate(abilityName)
    res.status(200).send({message: `Ability template "${abilityName}" deleted`})
})

export default abilitiesRoutes
