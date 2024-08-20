import React, {useState, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch, getFormData} from "../lib.js"

const Login = () => {
    const [playerNames, setPlayerNames] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        (async function () {
            const playerNames = await apiFetch('player/names', navigate)
            setPlayerNames(playerNames)
        })()
    }, [])
    const handleLogin = useCallback(async (playerName) => {
        await apiFetch('auth/login', navigate, 'POST', {playerName})
        navigate('/')
    }, [navigate])
    const handleNewPlayer = useCallback(async (event) => {
        const {newPlayerName} = getFormData(event)
        const playerNames = await apiFetch('player/new', navigate, 'POST', {newPlayerName})
        setPlayerNames(playerNames)
    }, [navigate])
    return (
        <div>
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
        </div>
    )
}

export default Login
