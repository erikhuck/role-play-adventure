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
    await deleteFunc(name)
    return res.status(201).json({message: `Template "${name}" deleted`})
}

export const processSliderValues = (values, type) => {
    type = `${type}Slider`
    return Object.keys(values).reduce((acc, key) => {
        const value = Number(values[key])
        if (key.includes(type)) {
            key = key.replace(type, '')
            if (value !== 0) acc[key] = value
        }
        return acc
    }, {})
}
