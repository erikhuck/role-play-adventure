import {Router} from 'express'
import {Condition, optionalNumber} from '../../../shared.js'
import _ from 'lodash'
import Database from '../lib/database.js'
import {deleteTemplate} from '../lib/index.js'

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
    const effectedAbilities = {}
    const effectedConditions = {}
    for (let key of Object.keys(rest)) {
        const value = Number(rest[key])
        key = key.replace('itemSlider', '')
        if (value !== 0) {
            if (_.includes(Object.keys(Condition), key)) {
                effectedConditions[key] = value
            } else {
                effectedAbilities[key] = value
            }
        }
    }
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

inventoryRoutes.post('/container/template', (req, res) => {
    // TODO
    res.send('Add container template endpoint')
})

inventoryRoutes.delete('/container/template', (req, res) => {
    // TODO
    res.send('Delete container template endpoint')
})

export default inventoryRoutes
