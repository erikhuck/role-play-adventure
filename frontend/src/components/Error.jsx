import React from 'react'
import {useNavigate} from 'react-router-dom'

const Error = ({errorMessage, resetErrorMessage}) => {
    const navigate = useNavigate()
    const isValidHTML = (htmlString) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlString, "text/html")
        if (doc.documentElement.nodeName !== "HTML") {
            return false
        }
        for (const child of doc.documentElement.childNodes) {
            if (child.nodeName === "parsererror") {
                return false
            }
        }
        return true
    }
    const handleBackToHome = () => {
        resetErrorMessage()
        navigate('/')
    }
    return (
        <div style={{padding: '20px', textAlign: 'center'}}>
            <h1>Error</h1>
            {isValidHTML(errorMessage) ? (
                <div dangerouslySetInnerHTML={{ __html: errorMessage }} />
            ) : (
                <p>{errorMessage}</p>
            )}
            <button onClick={handleBackToHome} style={{marginTop: '20px', padding: '10px 20px'}}>
                Back to Home
            </button>
        </div>
    )
}

export default Error