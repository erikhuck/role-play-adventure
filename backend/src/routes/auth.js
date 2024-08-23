import {Router} from 'express'

const authRoutes = Router()

authRoutes.post('/login', (req, res) => {
    const {playerName} = req.body
    if (playerName) {
        req.session.playerName = playerName
        return res.json({message: `${playerName} logged in`})
    }
    return res.status(400).text('Invalid player name')
})

authRoutes.post('/logout', (req, res) => {
    const playerName = req.session.playerName
    req.session.playerName = undefined
    return res.json({message: `${playerName} logged out`})
})

export default authRoutes
