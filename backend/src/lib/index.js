import Database from '../lib/database.js'

export const getPlayer = async (req) => {
    const playerName = req.session.playerName
    const playerNames = await Database.getPlayerNames()
    if (!playerName) {
        return null
    } else if (!(playerNames.includes(playerName))) {
        delete req.session.playerName
        return null
    } else {
        return await Database.getPlayer(playerName)
    }
}

export const deleteTemplate = async (req, res, deleteFunc) => {
    const {name} = req.body
    const templates = await deleteFunc(name)
    return res.status(200).send({templates})
}
