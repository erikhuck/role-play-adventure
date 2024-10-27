import {useState} from 'react'

const Sliders = ({
                     category,
                     keys,
                     min = -5,
                     max = 5
                 }) => {
    const [sliderValues, setSliderValues] = useState(
        keys.reduce((acc, key) => ({
            ...acc,
            [key]: 0
        }), {})
    )
    const handleSliderChange = (key, event) => {
        const newValue = event.target.value
        setSliderValues(prevValues => ({
            ...prevValues,
            [key]: newValue
        }))
    }
    return (
        <>
            {keys.map(key => (
                <div key={key}>
                    <label htmlFor={`${category}Slider${key}`}>{key}:</label>
                    <input
                        type="range"
                        id={`${category}Slider${key}`}
                        name={`${category}Slider${key}`}
                        min={`${min}`}
                        max={`${max}`}
                        value={sliderValues[key]}
                        onChange={event => handleSliderChange(key, event)}
                    />
                    <span id={`${category}SliderValue${key}`}>
                        {sliderValues[key]}
                    </span>
                    <br/>
                </div>
            ))}
        </>
    )
}

export default Sliders
