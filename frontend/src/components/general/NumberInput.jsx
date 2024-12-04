import camelCase from 'lodash/camelCase'

const NumberInput = ({
                         maxValue,
                         name,
                         required = true,
                         minValue = "0"
                     }) => {
    const placeholder = `Enter a number (${minValue}-${maxValue})`
    return (
        <div>
            <label htmlFor={name}>{`${name}: `}</label>
            <input
                type="number"
                id={name}
                name={`${camelCase(name)}`}
                min={minValue}
                max={maxValue}
                placeholder={placeholder}
                style={{width: `${placeholder.length + 1}ch`}}
                required={required}
            />
        </div>
    )
}

export default NumberInput
