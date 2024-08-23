import express from 'express'
import authRoutes from './auth.js'
import turnsRoutes from './turns.js'
import playerRoutes from './player.js'
import abilitiesRoutes from './abilities.js'
import inventoryRoutes from './inventory.js'
import npcsRoutes from './npcs.js'
import Database from '../lib/database.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/turns', turnsRoutes)
router.use('/player', playerRoutes)
router.use('/abilities', abilitiesRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/npcs', npcsRoutes)

export default router
