import React, {useState, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch} from "../lib.js"

const Login = () => {
    const [playerNames, setPlayerNames] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        (async function () {
            const players = await apiFetch('player/names', navigate)
            setPlayerNames(players)
        })()
    }, [])
    const handleLogin = useCallback(async (playerName) => {
        await apiFetch('auth/login', navigate, 'POST', {player_name: playerName})
        navigate('/')
    }, [navigate])
    const handleNewPlayer = useCallback(async (event) => {
        event.preventDefault() // Prevent the default form submission
        // noinspection JSUnresolvedReference
        const newPlayerName = event.target.new_player.value
        const players = await apiFetch(
            'player/new', navigate, 'POST', {new_player_name: newPlayerName})
        setPlayerNames(players)
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
                <label htmlFor="new_player">New player name:</label>
                <input type="text" id="new_player" name="new_player" required/>
                <button type="submit">Create Player</button>
            </form>
        </div>
    )
}

export default Login
