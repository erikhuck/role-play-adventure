import {Router} from 'express'
import {optionalNumber, CharacterType} from '../../../shared.js'
import Database from '../lib/database.js'
import {deleteTemplate, processSliderValues} from '../lib/index.js'
import _ from 'lodash'

const inventoryRoutes = Router()

inventoryRoutes.put('/coins', async (req, res) => {
    let {containerId, update} = req.body
    update = Number(update)
    await Database.updateCoins(containerId, update)
    return res.status(200).json({message: `Container of ID ${containerId} updated coins by amount of ${update}`})
})

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

inventoryRoutes.put('/item', async (req, res) => {
    const {item, itemTarget, success} = req.body
    if (item.charges <= 0) {
        return req.status(400).json({message: 'Item cannot be used if no charges are left.'})
    }
    await Database.updateItemCharges(item.id, item.charges - 1)
    const effectedConditions = item.template.effectedConditions
    const effectedAbilities = item.template.effectedAbilities
    if (success && (effectedConditions || effectedAbilities)) {
        const target = itemTarget.characterType === CharacterType.Player ? await Database.getPlayer(itemTarget.name) : await Database.getNpc(itemTarget.name)
        if (!_.isEmpty(effectedConditions)) {
            await Database.updateCharacterConditions(target, effectedConditions, itemTarget.characterType)
        }
        if (!_.isEmpty(effectedAbilities)) {
            await Database.updateCharacterAbilities(target, effectedAbilities, itemTarget.characterType)
        }
    }
    return res.status(200).json({message: `Item of ID ${item.id} used on ${itemTarget.name}.`})
})

inventoryRoutes.put('/item/reset', async (req, res) => {
    const {item} = req.body
    await Database.updateItemCharges(item.id, item.template.maxCharges)
    return res.status(200).json({message: `Item of ID ${item.id} charges reset.`})
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
    const {name, characterName, characterType, location} = req.body
    await Database.addContainer(name, characterName, characterType, location)
    res.status(201).json({message: `Container of name ${name} added to ${characterName}.`})
})

inventoryRoutes.delete('/container', async (req, res) => {
    const {id} = req.body
    await Database.deleteContainer(id)
    res.status(201).json({message: `Container of ID ${id} deleted.`})
})

export default inventoryRoutes
