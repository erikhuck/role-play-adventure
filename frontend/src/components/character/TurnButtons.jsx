import GlobalContext from '../../main/GlobalContext.jsx'
import {useContext} from 'react'

const TurnButtons = ({setTurn}) => {
    const {globalState} = useContext(GlobalContext)
    return (
        <>
            {globalState.turns.map((turn, index) => (
                <button key={index} onClick={() => setTurn(turn)}>
                    {turn.name}
                </button>
            ))}
        </>
    )
}

export default TurnButtons
