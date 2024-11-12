import {useState, useCallback} from 'react'

const SearchableDropdown = ({options, placeholder, required, onSelectOption}) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredOptions, setFilteredOptions] = useState([])
    const handleSearchChange = useCallback(e => {
        const value = e.target.value
        setSearchTerm(value)
        if (value) {
            // Filter options based on search term and limit results to 20.
            const filtered = options
                .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 20)
                .sort()
            setFilteredOptions(filtered)
        } else {
            setFilteredOptions([])
        }
    })
    const onClick = useCallback(async (option) => {
        setSearchTerm('')
        await onSelectOption(option)
    })
    return (
        <div style={{ width: "200px", position: "relative" }}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={placeholder}
                style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                required={required}
            />
            {searchTerm && filteredOptions.length > 0 && (
                <ul
                    style={{
                        listStyle: "none",
                        padding: "0",
                        margin: "0",
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        position: "absolute",
                        width: "100%",
                        backgroundColor: "#242424",
                        zIndex: 1,
                    }}
                >
                    {filteredOptions.map((option, index) => (
                        <li key={index} className="dropdown" onClick={async () => await onClick(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchableDropdown
