import {Router} from 'express'
import {deleteTemplate, processSliderValues} from '../lib/index.js'
import Database from '../lib/database.js'
import {optionalNumber} from '../../../shared.js'

const npcsRoutes = Router()

npcsRoutes.post('/', async (req, res) => {
    const {name} = req.body
    await Database.addNpc(name)
    return res.status(201).json({message: `NPC of template name ${name} added.`})
})

npcsRoutes.delete('/', async (req, res) => {
    const {id} = req.body
    await Database.deleteNpc(id)
    return res.status(201).json({message: `NPC of ID ${id} deleted.`})
})

npcsRoutes.post('/template', async (req, res) => {
    const {
        name,
        maxHealth,
        maxStamina,
        carryCapacity,
        ...rest
    } = req.body
    const containerTemplates = Object.keys(rest).filter(key => !key.includes('npcSlider'))
    const abilityLevels = processSliderValues(rest, 'npc')
    const abilityNames = Object.keys(abilityLevels)
    let abilityTemplates = await Database.getAbilityTemplatesOfNames(abilityNames)
    abilityTemplates = abilityTemplates.reduce((acc, abilityTemplate) => {
        const {
            name,
            effectedConditions
        } = abilityTemplate
        abilityTemplate = {
            level: abilityLevels[name],
            name,
            effectedConditions
        }
        acc.push(abilityTemplate)
        return acc
    }, [])
    const template = {
        name,
        maxHealth: optionalNumber(maxHealth),
        maxStamina: optionalNumber(maxStamina),
        carryCapacity: optionalNumber(carryCapacity),
        abilityTemplates,
        containerTemplates
    }
    await Database.addNpcTemplate(template)
    res.status(201).json({message: `Container template of name ${name} added`})
})

npcsRoutes.delete('/template', async (req, res) => {
    return await deleteTemplate(req, res, Database.deleteNpcTemplate)
})

export default npcsRoutes
