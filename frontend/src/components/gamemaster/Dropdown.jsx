import camelCase from 'lodash/camelCase'

function Dropdown({
                      label,
                      options,
                      required = true
                  }) {
    return (
        <div>
            <label htmlFor={label}>{`${label}: `}</label>
            <select name={camelCase(label)} id={label} defaultValue="" required={required}>
                <option value="" disabled>Select an Option</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Dropdown
