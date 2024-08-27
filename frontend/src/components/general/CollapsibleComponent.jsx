import React, {useState} from 'react'

const CollapsibleComponent = ({
                                  label,
                                  children
                              }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)
    return (
        <div>
            <button className="toggle-button" onClick={toggle}>
                {label}
            </button>
            {isOpen && (
                <div>
                    {children}
                </div>
            )}
        </div>
    )
}

export default CollapsibleComponent
