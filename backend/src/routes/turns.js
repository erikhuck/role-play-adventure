import {Router} from 'express'
import TurnManager from '../lib/turns.js'
import Database from '../lib/database.js'
import {CharacterType} from '../../../shared.js'
import _ from 'lodash'

const turnsRoutes = Router()

turnsRoutes.post('/add', async (req, res) => {
    const {
        characterType,
        name
    } = req.body
    let turn = null
    if (characterType === CharacterType.Player) {
        turn = await Database.getPlayer(name)
    } else if (characterType === CharacterType.Npc) {
        turn = await Database.getNpc(name)
    } else {
        return res.status(400).send('Invalid turn type')
    }
    turn = {
        name: turn.name,
        characterType
    }
    if (!_.some(TurnManager.turns, turn)) {
        TurnManager.addTurn(turn)
    }
    return res.status(201).json({message: `${name} added to turns`})
})

turnsRoutes.delete('/drop', (req, res) => {
    const {name} = req.body
    const turn = TurnManager.dropTurn(name)
    if (turn === null) {
        return res.status(400).send('Turn index out of range for current number of turns')
    } else {
        return res.json({message: `Turn of name "${turn.name}" dropped`})
    }
})

turnsRoutes.put('/next', async (req, res) => {
    await TurnManager.nextTurn()
    return res.json({message: `Now at turn number ${TurnManager.currentTurn}`})
})

export default turnsRoutes
