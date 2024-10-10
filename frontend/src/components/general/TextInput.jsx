import camelCase from 'lodash/camelCase'

const TextInput = ({
                       label,
                       required = true
                   }) => {
    const name = camelCase(label)
    return (
        <>
            <label htmlFor={name}>{label}: </label>
            <input type="text" id={name} name={name} required={required}/>
        </>
    )
}

export default TextInput
