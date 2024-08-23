import {createSearchParams} from 'react-router-dom'

export const apiFetch = async (path, navigate, method = 'GET', body = undefined) => {
    // A trailing slash / is intentionally excluded since the path needs to match the endpoint exactly.
    // If a trailing slash is needed e.g. in an index endpoint of a blueprint, it must be appended to the path argument
    const apiPath = `/api/${path}`
    try {
        const response = await fetch(apiPath, {
                method,
                headers: body ? {
                    'Content-Type': 'application/json'
                } : undefined,
                body: body ? JSON.stringify(body) : undefined
            }
        )
        if (response.status === 200 || response.status === 201) {
            return await response.json()
        } else {
            let message = await response.text()
            message = message ? message : 'Unknown error'
            throw new Error(message)
        }
    } catch (e) {
        navigate(`/error?${createSearchParams({message: e.message})}`)
    }
    return undefined
}

export const getTurnName = globalState => (
    globalState.turns && globalState.currentTurn !== undefined ? globalState.turns[globalState.currentTurn].name : undefined)

export const isPlayerTurn = globalState => getTurnName(globalState) === globalState.playerName

export const getFormData = (event) => {
    event.preventDefault()
    let formData = new FormData(event.target)
    return Object.fromEntries(formData.entries())
}

export const getPlayer = globalState => globalState.players && globalState.playerName ? globalState.players.find(obj => obj.name === globalState.playerName) : undefined
