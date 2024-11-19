import GlobalContext from '../../main/GlobalContext.jsx'
import React, {useContext} from 'react'

const TurnList = () => {
    const {globalState} = useContext(GlobalContext)
    return (
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
    )
}

export default TurnList
