import {Router} from 'express'
import {optionalNumber} from '../../../shared.js'
import Database from '../lib/database.js'
import {deleteTemplate, processSliderValues} from '../lib/index.js'

const inventoryRoutes = Router()

inventoryRoutes.post('/item/template', async (req, res) => {
    let {
        name,
        weight,
        price,
        maxCharges,
        associatedAbility,
        description,
        ...rest
    } = req.body
    const effectedAbilities = processSliderValues(rest, 'itemAbility')
    const effectedConditions = processSliderValues(rest, 'itemCondition')
    const template = {
        name,
        weight: Number(weight),
        price: optionalNumber(price),
        maxCharges: optionalNumber(maxCharges),
        abilityName: associatedAbility,
        effectedAbilities,
        effectedConditions,
        description
    }
    await Database.addItemTemplate(template)
    res.status(201).json({message: `Item template of name ${name} added`})
})

inventoryRoutes.delete('/item/template', async (req, res) => {
    return await deleteTemplate(req, res, Database.deleteItemTemplate)
})

inventoryRoutes.post('/container/template', async (req, res) => {
    const {
        name,
        weightCapacity
    } = req.body
    const template = {
        name,
        weightCapacity: Number(weightCapacity)
    }
    await Database.addContainerTemplate(template)
    res.status(201).json({message: `Container template of name ${name} added`})
})

inventoryRoutes.delete('/container/template', async (req, res) => {
    return await deleteTemplate(req, res, Database.deleteContainerTemplate)
})

export default inventoryRoutes
