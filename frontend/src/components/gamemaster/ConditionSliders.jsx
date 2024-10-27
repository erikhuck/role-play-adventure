import Sliders from './Sliders.jsx'
import {Condition} from '../../../../shared.js'

const ConditionSliders = ({
                              category,
                              min = -5,
                              max = 5
                          }) => {
    const capitalizedConditions = Object.keys(Condition)
    return (
        <>
            <p>Effected Conditions:</p>
            <Sliders category={category} keys={capitalizedConditions} min={min} max={max}/>
        </>
    )
}

export default ConditionSliders
