import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

const Error = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const getQueryParam = (param) => {
        const params = new URLSearchParams(location.search)
        return params.get(param)
    }
    const handleBackToHome = () => {
        navigate('/')
    }
    const errorMessage = getQueryParam('message') || 'An unknown error occurred'
    return (
        <div style={{padding: '20px', textAlign: 'center'}}>
            <h1>Error</h1>
            <p>{errorMessage}</p>
            <button onClick={handleBackToHome} style={{marginTop: '20px', padding: '10px 20px'}}>
                Back to Home
            </button>
        </div>
    )
}

export default Error
