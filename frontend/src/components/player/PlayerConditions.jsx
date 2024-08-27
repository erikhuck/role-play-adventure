import React, {useContext} from 'react'
import GlobalContext from '../../main/GlobalContext.jsx'
import {Condition} from '../../../../shared.js'
import {getPlayer} from '../../lib.js'

const PlayerConditions = () => {
    const {globalState} = useContext(GlobalContext)
    const player = getPlayer(globalState)
    const conditionData = Object.keys(Condition).map(condition => ({
        name: condition,
        value: player[Condition[condition]],
        max: player[`max${condition}`]
    }))
    return (
        <>
            <h2>Player Conditions</h2>
            <ul>
                {conditionData.map(({
                                        name,
                                        value,
                                        max
                                    }) => (
                    <li key={name}>
                        {name}: {value} / {max}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default PlayerConditions
