import {Router} from 'express'

const inventoryRoutes = Router()

inventoryRoutes.post('/item/template', (req, res) => {
    // TODO
    res.send('Add item template endpoint')
})

inventoryRoutes.delete('/item/template', (req, res) => {
    // TODO
    res.send('Delete item template endpoint')
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
