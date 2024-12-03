import {Router} from 'express'
import authRoutes from './auth.js'
import turnsRoutes from './turns.js'
import playerRoutes from './player.js'
import abilitiesRoutes from './abilities.js'
import inventoryRoutes from './inventory.js'
import npcsRoutes from './npcs.js'
import {getPlayer} from '../lib/index.js'
import Database from '../lib/database.js'
import TurnManager from '../lib/turns.js'

const router = Router()

router.get('/init', async (req, res) => {
    const player = await getPlayer(req)
    const playerName = player ? player.name : undefined
    const players = await Database.getPlayers()
    const abilityTemplates = await Database.getAbilityTemplates()
    const itemTemplates = await Database.getItemTemplates()
    const containerTemplates = await Database.getContainerTemplates()
    const npcTemplates = await Database.getNpcTemplates()
    const npcs = await Database.getNpcs()
    const initialState = {
        playerName,
        players,
        turns: TurnManager.turns,
        currentTurn: TurnManager.currentTurn,
        abilityTemplates,
        itemTemplates,
        containerTemplates,
        npcTemplates,
        npcs
    }
    return res.status(200).json(initialState)
})
router.post('/sleep', async (req, res) => {
    const {
        character,
        characterType
    } = req.body
    await Database.characterSleep(character, characterType)
    return res.status(201).json({message: `Character "${character.name}" slept successfully.`})
})
router.use('/auth', authRoutes)
router.use('/turns', turnsRoutes)
router.use('/player', playerRoutes)
router.use('/abilities', abilitiesRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/npcs', npcsRoutes)

export default router
