const CheckboxList = ({
                          label,
                          options
                      }) => {
    return (
        <>
            <p>{label}:</p>
            {options.map((option) => (
                <div key={option}>
                    <input type="checkbox" id={option} name={option}/>
                    <label key={option} htmlFor={option}>
                        {option}
                    </label>
                </div>
            ))}
        </>
    )
}

export default CheckboxList
