import React, {useContext, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {apiFetch} from "../lib.js"
import {GlobalContext} from "../main/GlobalContext.jsx"
import Turns from '../components/Turns.jsx'
import PlayerConditions from "../components/PlayerConditions.jsx"
import PlayerAbilities from "../components/PlayerAbilities.jsx"
import PlayerInventory from "../components/PlayerInventory.jsx"
import CollapsibleComponent from "../components/CollapsibleComponent.jsx"

const Player = () => {
    const {globalState, setGlobalState} = useContext(GlobalContext)
    const navigate = useNavigate()
    const updateGlobalState = useCallback((partialState) => {
        setGlobalState((prevState) => ({
            ...prevState,
            ...partialState,
        }))
    }, [setGlobalState])
    useEffect(() => {
        (async function () {
            if (!globalState.player) {
                const player = await apiFetch('player/', navigate)
                if (player) {
                    updateGlobalState({player})
                } else {
                    await navigate('/login')
                }
            }
        })()
    }, [])
    // noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection
    const handleLogout = useCallback(async () => {
        await apiFetch('auth/logout', navigate, 'POST')
        const playerIndex = globalState.turns.findIndex(turn => turn.name === globalState.player.name)
        await apiFetch('turns/drop', navigate, 'DELETE', {index: playerIndex})
        setGlobalState({})
        navigate('/login')
    }, [setGlobalState, navigate, globalState.turns, globalState.player])
    return (
        <div>
            {globalState.player ? (
                <>
                    <h1>{globalState.player.name}</h1>
                    <Turns updateGlobalState={updateGlobalState}/>
                    <CollapsibleComponent label={'Conditions'}>
                        <PlayerConditions updateGlobalState={updateGlobalState}/>
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
                <p>Loading player...</p>
            )}
        </div>
    )
}

export default Player
