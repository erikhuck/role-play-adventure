import camelCase from 'lodash/camelCase'

const NumberInput = ({
                         maxValue,
                         name,
                         required = true
                     }) => {
    const placeholder = `Enter a number (0-${maxValue})`
    return (
        <div>
            <label htmlFor={name}>{`${name}: `}</label>
            <input
                type="number"
                id={name}
                name={`${camelCase(name)}`}
                min="0"
                max={maxValue}
                placeholder={placeholder}
                style={{width: `${placeholder.length + 1}ch`}}
                required={required}
            />
        </div>
    )
}

export default NumberInput
