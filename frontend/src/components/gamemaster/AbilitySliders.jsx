import Sliders from './Sliders.jsx'
import GlobalContext from '../../main/GlobalContext.jsx'
import {mapNames} from '../../../../shared.js'
import {useContext} from 'react'

const AbilitySliders = ({
                            category,
                            label = 'Effected Abilities',
                            min = -5,
                            max = 5
                        }) => {
    const {globalState} = useContext(GlobalContext)
    const abilityNames = mapNames(globalState.abilityTemplates)
    return (
        <>
            <p>{label}:</p>
            <Sliders category={category} keys={abilityNames} min={min} max={max}/>
        </>
    )
}

export default AbilitySliders
