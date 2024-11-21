import React, {useContext, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch, getPlayer} from '../lib.js'
import GlobalContext from "../main/GlobalContext.jsx"
import PlayerTurns from '../components/character/PlayerTurns.jsx'
import CharacterInfo from '../components/character/CharacterInfo.jsx'
import {CharacterType, Condition} from '../../../shared.js'

const Player = ({updateGlobalState}) => {
    const {globalState} = useContext(GlobalContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (!globalState.playerName) {
            navigate('/login')
        }
    }, [globalState.playerName, navigate])
    const handleLogout = useCallback(async () => {
        await apiFetch('auth/logout', 'POST')
        await apiFetch('turns/drop', 'DELETE', {name: globalState.playerName})
        updateGlobalState({playerName: undefined})
        navigate('/login')
    }, [globalState.playerName, updateGlobalState, navigate])
    const player = getPlayer(globalState)
    const conditionData = player ? (
        Object.keys(Condition).map(condition => ({
                name: condition,
                value: player[Condition[condition]],
                max: player[`max${condition}`]
            })
        )
    ) : undefined
    return (
        <div>
            {globalState.playerName ? (
                <>
                    <h1>{globalState.playerName}</h1>
                    <PlayerTurns updateGlobalState={updateGlobalState}/>
                    <hr/>
                    <CharacterInfo characterType={CharacterType.Player} conditionData={conditionData} character={player}/>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>Navigating to login...</p>
            )}
        </div>
    )
}

export default Player
