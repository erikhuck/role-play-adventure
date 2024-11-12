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

inventoryRoutes.post('/item', async (req, res) => {
    const {name, containerId} = req.body
    await Database.addItem(name, containerId)
    res.status(201).json({message: `Item of name ${name} added to container of ID ${containerId}`})
})

inventoryRoutes.delete('/item', async (req, res) => {
    const {id} = req.body
    await Database.deleteItem(id)
    res.status(201).json({message: `Item of ID ${id} deleted.`})
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

inventoryRoutes.post('/container', async (req, res) => {
    const {name, playerName, location} = req.body
    await Database.addContainer(name, playerName, location)
    res.status(201).json({message: `Container of name ${name} added to player ${playerName}.`})
})

inventoryRoutes.delete('/container', async (req, res) => {
    const {id} = req.body
    await Database.deleteContainer(id)
    res.status(201).json({message: `Container of ID ${id} deleted.`})
})

export default inventoryRoutes
