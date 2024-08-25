import express from 'express'
import TurnManager from '../lib/turns.js'
import Database from '../lib/database.js'
import {objectInArray} from '../../../shared.js'

const turnsRoutes = express.Router()

turnsRoutes.post('/add', async (req, res) => {
    const {turnType, name} = req.body
    const turnAdded = res => res.status(201).json({message: `${name} added to turns`})
    let turn = null
    if (turnType === 'player') {
        turn = await Database.getPlayer(name)
        if (objectInArray(turn, TurnManager.turns)) {
            return turnAdded(res)
        }
    } else if (turnType === 'npc') {
        turn = Database.getNPC(name)
    } else {
        return res.status(400).text('Invalid turn type')
    }
    TurnManager.addTurn(turn)
    return turnAdded(res)
})

turnsRoutes.delete('/drop', (req, res) => {
    const {index} = req.body
    const turn = TurnManager.dropTurn(index)
    if (turn !== null) {
        return res.json({message: `Turn of name "${turn.name}" dropped`})
    } else {
        return res.status(400).text('Turn index out of range for current number of turns')
    }
})

turnsRoutes.put('/next', (req, res) => {
    TurnManager.nextTurn()
    return res.json({message: `Now at turn number ${TurnManager.currentTurn}`})
})

export default turnsRoutes
