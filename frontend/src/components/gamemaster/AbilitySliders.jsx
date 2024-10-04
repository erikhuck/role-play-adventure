import Sliders from './Sliders.jsx'
import GlobalContext from '../../main/GlobalContext.jsx'
import {mapNames} from '../../../../shared.js'
import {useContext} from 'react'

const AbilitySliders = ({category}) => {
    const {globalState} = useContext(GlobalContext)
    const abilityNames = mapNames(globalState.abilityTemplates)
    return (
        <>
            <p>Effected Abilities:</p>
            <Sliders category={category} keys={abilityNames}/>
        </>
    )
}

export default AbilitySliders
