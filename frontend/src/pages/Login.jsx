import React, {useContext, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch, getFormData} from "../lib.js"
import {GlobalContext} from '../main/GlobalContext.jsx'

const Login = ({updateGlobalState}) => {
    const {globalState} = useContext(GlobalContext)
    const navigate = useNavigate()
    useEffect(() => {
        (async function () {
            const players = await apiFetch('player/', navigate)
            updateGlobalState({players})
        })()
    }, [])
    const playerNames = globalState.players !== undefined ? globalState.players.map(player => player.name) : undefined
    const handleLogin = useCallback(async (playerName) => {
        await apiFetch('auth/login', navigate, 'POST', {playerName})
        navigate('/')
    }, [navigate])
    const handleNewPlayer = useCallback(async (event) => {
        const {newPlayerName} = getFormData(event)
        await apiFetch('player/new', navigate, 'POST', {newPlayerName})
    }, [navigate])
    return (
        <>
            {playerNames !== undefined ? (
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
            ) : (
                <p>Loading login...</p>
            )}
        </>
    )
}

export default Login
