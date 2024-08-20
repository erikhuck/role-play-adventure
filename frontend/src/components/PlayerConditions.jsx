import React, {useContext, useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import {GlobalContext} from "../main/GlobalContext.jsx"
import {apiFetch} from "../lib.js"

const PlayerConditions = ({updateGlobalState}) => {
    const {globalState} = useContext(GlobalContext)
    let conditionData = undefined
    if (globalState.conditions) {
        conditionData = globalState.conditions.map(condition => ({
            name: condition.charAt(0).toUpperCase() + condition.slice(1),
            value: globalState.player[condition],
            max: globalState.player[`max_${condition}`]
        }))
    }
    return (
        <>
            <h2>Player Conditions</h2>
            {conditionData ? (
                <ul>
                    {conditionData.map(({name, value, max}) => (
                        <li key={name}>
                            {name}: {value} / {max}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading player conditions...</p>
            )
            }
        </>
    )
}

export default PlayerConditions
