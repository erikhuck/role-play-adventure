import React, {useCallback, useContext, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {GlobalContext} from "../main/GlobalContext.jsx"
import {apiFetch, getTurnName, isPlayerTurn} from "../lib.js"

const Turns = ({updateGlobalState}) => {
    const {globalState} = useContext(GlobalContext)
    const navigate = useNavigate()
    useEffect(() => {
        (async function () {
            const {currentTurn, turns} = await apiFetch('turns/add', navigate, 'POST', {
                turn_type: 'player', 'name': globalState.player.name
            })
            updateGlobalState({currentTurn, turns})
        })()
    }, [])
    const handleNextTurn = useCallback(async () => {
        const {currentTurn} = await apiFetch('turns/next', navigate, 'PUT')
        updateGlobalState({currentTurn})
    }, [updateGlobalState, navigate])
    const turnName = getTurnName(globalState)
    return (
        <>
            <h2>Who's Turn Is It?</h2>
            {turnName ? (
                <ul>
                    {globalState.turns.map((turn, index) => (
                        <li key={index}>
                            <p>{index === globalState.currentTurn ? <b>{turn.name}</b> : turn.name}</p>
                        </li>
                    ))}
                    {isPlayerTurn(globalState) ? (
                        <>
                            <p>It's your turn!</p>
                            <button onClick={handleNextTurn}>End Turn</button>
                        </>
                    ) : (
                        <p>It's {turnName}'s turn</p>
                    )}
                </ul>

            ) : (
                <p>Loading turns...</p>
            )}
        </>
    )
}

export default Turns
