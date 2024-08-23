import {useContext} from "react"
import {GlobalContext} from "../main/GlobalContext.jsx"
import {getPlayer} from '../lib.js'

const PlayerAbilities = () => {
    const {globalState} = useContext(GlobalContext)
    const player = getPlayer(globalState)
    // TODO replace <p>ability.name</p> with the ability UI.
    return (
        <>
            <h2>Player Abilities</h2>
            {player.abilities ? (
                <ul>
                    {player.abilities.map(ability => (
                        <li>
                            <p>{ability.name}</p>
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
