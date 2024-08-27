import express from 'express'
import Database from '../lib/database.js'

const playerRouter = express.Router()

playerRouter.post('/new', async (req, res) => {
    const {newPlayerName} = req.body
    let playerNames = await Database.getPlayerNames()
    if (!(playerNames.includes(newPlayerName))) {
        await Database.addPlayer(newPlayerName)
        res.status(201).json({message: `Player "${newPlayerName} added`})
    } else {
        res.status(400).send('Player already exists')
    }
})

export default playerRouter
