import React, {useState, useEffect} from 'react';
import {useNavigate, createSearchParams} from 'react-router-dom';

function ErrorHandler({children}) {
    const [eventListenerSet, setEventListenerSet] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const handleError = (error) => {
            navigate(`/error?${createSearchParams({message: error.message})}`)
        }
        try {
            window.addEventListener('error', handleError)
            setEventListenerSet(true)
        } catch (error) {
            console.error('ERROR ADDING ERROR HANDLER:\n', error)
        }
    }, [])
    return (!eventListenerSet ? (
        <div>Loading app...</div>
        ) : (
            {children}
        )
    )
}

export default ErrorHandler;
