import Sliders from './Sliders.jsx'
import {Condition} from '../../../../shared.js'

const ConditionSliders = ({category}) => {
    const capitalizedConditions = Object.keys(Condition)
    return (
        <>
            <p>Effected Conditions:</p>
            <Sliders category={category} keys={capitalizedConditions}/>
        </>
    )
}

export default ConditionSliders
