import {useContext, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch, getFormData} from "../lib.js"
import GlobalContext from '../main/GlobalContext.jsx'
import {mapNames} from '../../../shared.js'
import TextInput from '../components/general/TextInput.jsx'

const Login = ({updateGlobalState}) => {
    const {globalState} = useContext(GlobalContext)
    const navigate = useNavigate()
    const playerNames = mapNames(globalState.players)
    const handleLogin = useCallback(async (playerName) => {
        const responseBody = await apiFetch('auth/login', 'POST', {playerName})
        updateGlobalState({playerName: responseBody.playerName})
        navigate('/')
    }, [navigate, updateGlobalState])
    const handleNewPlayer = useCallback(async (event) => {
        const {newPlayerName} = getFormData(event)
        await apiFetch('player/new', 'POST', {newPlayerName})
    }, [])
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
                <TextInput label="New Player Name"/>
                <button type="submit">Create Player</button>
            </form>
        </>
    )
}

export default Login
