const NumberInput = ({
                         maxValue,
                         name
                     }) => {
    const placeholder = `Enter a number (0-${maxValue})`
    return (
        <div>
            <label htmlFor={name}>{`${name}: `}</label>
            <input
                type="number"
                id={name}
                name={name}
                min="0"
                max={maxValue}
                placeholder={placeholder}
                style={{width: `${placeholder.length + 1}ch`}}
            />
        </div>
    )
}

export default NumberInput
