import {Router} from 'express'

const npcsRoutes = Router()

npcsRoutes.post('/template', (req, res) => {
    // TODO
    res.send('Add NPC template endpoint')
})

npcsRoutes.delete('/template', (req, res) => {
    // TODO
    res.send('Delete NPC template endpoint')
})

export default npcsRoutes
