import GlobalContext from '../../main/GlobalContext.jsx'
import {useCallback, useContext} from 'react'
import {apiFetch} from '../../lib.js'

const TurnList = ({buttonDisabled}) => {
    const {globalState} = useContext(GlobalContext)
    const handleNextTurn = useCallback(async () => {
        await apiFetch('turns/next', 'PUT')
    }, [])
    return (
        <>
            <ul>
                {
                    globalState.turns.map((turn, index) => (
                            <li key={index}>
                                <p>{index === globalState.currentTurn ? <b>{turn.name}</b> : turn.name}</p>
                            </li>
                        )
                    )
                }
            </ul>
            <button onClick={handleNextTurn} disabled={buttonDisabled}>End Turn</button>
        </>
    )
}

export default TurnList
