import express from 'express'
import {getPlayer} from '../lib/index.js'
import Database from '../lib/database.js'

const playerRouter = express.Router()

playerRouter.get('/', async (req, res) => {
    const players = await Database.getPlayers()
    res.status(200).json(players)
})

playerRouter.get('/name', async (req, res) => {
    const player = await getPlayer(req)
    const playerName = player ? player.name : null
    res.status(200).json({playerName})
})

playerRouter.post('/new', async (req, res) => {
    const {newPlayerName} = req.body
    let playerNames = await Database.getPlayerNames()
    if (!(playerNames.includes(newPlayerName))) {
        await Database.addPlayer(newPlayerName)
        res.status(201).json({message: `Player "${newPlayerName} added`})
    } else {
        res.status(400).text('Player already exists')
    }
})

export default playerRouter
