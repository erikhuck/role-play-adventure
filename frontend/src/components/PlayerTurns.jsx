import React, {useCallback, useContext, useEffect} from "react"
import GlobalContext from "../main/GlobalContext.jsx"
import {apiFetch, getTurnName, isPlayerTurn} from "../lib.js"

const PlayerTurns = () => {
    const {globalState} = useContext(GlobalContext)
    useEffect(() => {
        (async () => {
            await apiFetch('turns/add', 'POST', {
                turnType: 'player', 'name': globalState.playerName
            })
        })()
    }, [])
    const handleNextTurn = useCallback(async () => {
        await apiFetch('turns/next', 'PUT')
    }, [])
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
                <p>Adding player to turns...</p>
            )}
        </>
    )
}

export default PlayerTurns
