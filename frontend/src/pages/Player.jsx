import React, {useContext, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch} from "../lib.js"
import GlobalContext from "../main/GlobalContext.jsx"
import PlayerTurns from '../components/PlayerTurns.jsx'
import PlayerConditions from "../components/PlayerConditions.jsx"
import PlayerAbilities from "../components/PlayerAbilities.jsx"
import PlayerInventory from "../components/PlayerInventory.jsx"
import CollapsibleComponent from "../components/CollapsibleComponent.jsx"

const Player = ({updateGlobalState}) => {
    const {globalState, setGlobalState} = useContext(GlobalContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (!globalState.playerName) {
            navigate('/login')
        }
    }, [])
    const handleLogout = useCallback(async () => {
        await apiFetch('auth/logout', 'POST')
        const playerIndex = globalState.turns.findIndex(turn => turn.name === globalState.playerName)
        await apiFetch('turns/drop', 'DELETE', {index: playerIndex})
        updateGlobalState({playerName: undefined})
        navigate('/login')
    }, [setGlobalState, navigate, globalState.turns, globalState.playerName])
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
