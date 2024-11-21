import React, {useCallback, useContext, useEffect} from 'react'
import GlobalContext from '../../main/GlobalContext.jsx'
import {apiFetch, getTurnName, isPlayerTurn} from '../../lib.js'
import {CharacterType} from '../../../../shared.js'
import TurnList from './TurnList.jsx'

const PlayerTurns = () => {
    const {globalState} = useContext(GlobalContext)
    useEffect(() => {
        (async () => {
            await apiFetch('turns/add', 'POST', {
                characterType: CharacterType.Player,
                name: globalState.playerName
            })
        })()
    }, [globalState.playerName])
    const handleNextTurn = useCallback(async () => {
        await apiFetch('turns/next', 'PUT')
    }, [])
    const turnName = getTurnName(globalState)
    return (
        <>
            <h2>Who's Turn Is It?</h2>
            {
                turnName ? (
                    <>
                        <TurnList/>
                        {
                            isPlayerTurn(globalState) ? (
                                <>
                                    <p>It's your turn!</p>
                                    <button onClick={handleNextTurn}>End Turn</button>
                                </>
                            ) : (
                                <p>It's {turnName}'s turn</p>
                            )
                        }
                    </>
                ) : (
                    <p>Adding player to turns...</p>
                )
            }
        </>
    )
}

export default PlayerTurns
