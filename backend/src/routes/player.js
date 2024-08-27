import {Router} from 'express'
import Database from '../lib/database.js'

const playerRouter = Router()

playerRouter.post('/new', async (req, res) => {
    const {newPlayerName} = req.body
    let playerNames = await Database.getPlayerNames()
    if (playerNames.includes(newPlayerName)) {
        return res.status(400).send('Player already exists')
    } else {
        await Database.addPlayer(newPlayerName)
        return res.status(201).json({message: `Player "${newPlayerName} added`})
    }
})

export default playerRouter
