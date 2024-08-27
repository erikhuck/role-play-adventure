import {useContext} from "react"
import GlobalContext from "../../main/GlobalContext.jsx"
import {getPlayer} from '../../lib.js'

const PlayerAbilities = () => {
    const {globalState} = useContext(GlobalContext)
    const player = getPlayer(globalState)
    // TODO replace <p>ability.name</p> with the ability UI.
    return (
        <>
            <h2>Player Abilities</h2>
            {player.abilities.length > 0 ? (
                <ul>
                    {player.abilities.map(ability => (
                        <li key={ability.name}>
                            <p>{ability.name}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No abilities yet</p>
            )}
        </>
    )
}

export default PlayerAbilities
