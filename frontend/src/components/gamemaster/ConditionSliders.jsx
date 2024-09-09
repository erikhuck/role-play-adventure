import React, {useState} from 'react'
import {Condition} from '../../../../shared.js'

const ConditionSliders = ({sliderCategory}) => {
    const capitalizedConditions = Object.keys(Condition)
    const [sliderValues, setSliderValues] = useState(
        capitalizedConditions.reduce((acc, condition) => ({
            ...acc,
            [condition]: 0
        }), {})
    )
    const handleSliderChange = (condition, event) => {
        const newValue = event.target.value
        setSliderValues(prevValues => ({
            ...prevValues,
            [condition]: newValue
        }))
    }
    return (
        <>
            {capitalizedConditions.map(condition => (
                <div key={condition}>
                    <label htmlFor={`${sliderCategory}Slider${condition}`}>{condition}:</label>
                    <input
                        type="range"
                        id={`${sliderCategory}Slider${condition}`}
                        name={`${sliderCategory}Slider${condition}`}
                        min="-5"
                        max="5"
                        value={sliderValues[condition]}
                        onChange={event => handleSliderChange(condition, event)}
                    />
                    <span id={`${sliderCategory}SliderValue${condition}`}>
                        {sliderValues[condition]}
                    </span>
                    <br/>
                </div>
            ))}
        </>
    )
}

export default ConditionSliders
