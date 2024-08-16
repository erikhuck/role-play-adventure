import {useContext, useEffect} from "react"
import {GlobalContext} from "../main/GlobalContext.jsx"
import {useNavigate} from "react-router-dom"
import {apiFetch} from "../lib.js"

const PlayerAbilities = ({updateGlobalState}) => {
    const {globalState} = useContext(GlobalContext)
    const navigate = useNavigate()
    // TODO replace <p>ability.name</p> with the ability UI.
    return (
        <>
            <h2>Player Abilities</h2>
            {globalState.player.abilities ? (
                <ul>
                    {globalState.player.abilities.map(ability => (
                        <li>
                            <p>ability.name</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading abilities ...</p>
            )}
        </>
    )
}

export default PlayerAbilities
