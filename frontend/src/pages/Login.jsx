import React, {useContext, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch, getFormData} from "../lib.js"
import GlobalContext from '../main/GlobalContext.jsx'

const Login = ({updateGlobalState}) => {
    const {globalState} = useContext(GlobalContext)
    const navigate = useNavigate()
    const playerNames = globalState.players.map(player => player.name)
    const handleLogin = useCallback(async (playerName) => {
        const responseBody = await apiFetch('auth/login', 'POST', {playerName})
        updateGlobalState({playerName: responseBody.playerName})
        navigate('/')
    }, [navigate])
    const handleNewPlayer = useCallback(async (event) => {
        const {newPlayerName} = getFormData(event)
        await apiFetch('player/new', 'POST', {newPlayerName})
    }, [navigate])
    return (
        <>
            <h1>Login</h1>
            <h2>Select Player</h2>
            {playerNames.length === 0 ? (
                <p>No players yet</p>
            ) : (
                playerNames.map(playerName => (
                    <button key={playerName} onClick={() => handleLogin(playerName)}>
                        {playerName}
                    </button>
                ))
            )}
            <h2>Create New Player</h2>
            <form onSubmit={handleNewPlayer}>
                <label htmlFor="newPlayerName">New player name:</label>
                <input type="text" id="newPlayerName" name="newPlayerName" required/>
                <button type="submit">Create Player</button>
            </form>
        </>
    )
}

export default Login
