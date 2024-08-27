import React, {useContext, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch} from "../lib.js"
import GlobalContext from "../main/GlobalContext.jsx"
import PlayerTurns from '../components/player/PlayerTurns.jsx'
import PlayerConditions from "../components/player/PlayerConditions.jsx"
import PlayerAbilities from "../components/player/PlayerAbilities.jsx"
import PlayerInventory from "../components/player/PlayerInventory.jsx"
import CollapsibleComponent from "../components/general/CollapsibleComponent.jsx"

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
        const playerIndex = globalState.turns.findIndex(turn => turn.name === globalState.playerName)
        await apiFetch('turns/drop', 'DELETE', {index: playerIndex})
        updateGlobalState({playerName: undefined})
        navigate('/login')
    }, [globalState.turns, globalState.playerName, updateGlobalState, navigate])
    return (
        <div>
            {globalState.playerName ? (
                <>
                    <h1>{globalState.playerName}</h1>
                    <PlayerTurns updateGlobalState={updateGlobalState}/>
                    <CollapsibleComponent label={'Conditions'}>
                        <PlayerConditions/>
                    </CollapsibleComponent>
                    <CollapsibleComponent label="Abilities">
                        <PlayerAbilities/>
                    </CollapsibleComponent>
                    <CollapsibleComponent label="Inventory">
                        <PlayerInventory/>
                    </CollapsibleComponent>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>Navigating to login...</p>
            )}
        </div>
    )
}

export default Player
