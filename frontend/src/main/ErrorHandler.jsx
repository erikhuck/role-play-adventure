import React, {Component} from 'react'
import {useNavigate} from 'react-router-dom'

const Error = ({
                   errorMessage,
                   resetErrorMessage
               }) => {
    const navigate = useNavigate()
    const isValidHTML = (htmlString) => {
        // eslint-disable-next-line no-undef
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlString, 'text/html')
        if (doc.documentElement.nodeName !== 'HTML') {
            return false
        }
        for (const child of doc.documentElement.childNodes) {
            if (child.nodeName === 'parsererror') {
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
        <div style={{
            padding: '20px',
            textAlign: 'center'
        }}>
            <h1>Error</h1>
            {isValidHTML(errorMessage) ? (
                <div dangerouslySetInnerHTML={{__html: errorMessage}}/>
            ) : (
                <p>{errorMessage}</p>
            )}
            <button onClick={handleBackToHome} style={{
                marginTop: '20px',
                padding: '10px 20px'
            }}>
                Back to Home
            </button>
        </div>
    )
}

// noinspection JSUnresolvedReference
class ErrorHandler extends Component {
    constructor(props) {
        super(props)
        this.state = {errorMessage: null}
    }

    static getDerivedStateFromError(error) {
        return {errorMessage: error.message}
    }

    componentDidMount() {
        // eslint-disable-next-line no-undef
        window.addEventListener('error', this.handleGlobalError)
        // eslint-disable-next-line no-undef
        window.addEventListener('unhandledrejection', this.handlePromiseRejection)
    }

    componentWillUnmount() {
        // eslint-disable-next-line no-undef
        window.removeEventListener('error', this.handleGlobalError)
        // eslint-disable-next-line no-undef
        window.removeEventListener('unhandledrejection', this.handlePromiseRejection)
    }

    handleGlobalError = (event) => this.setState({errorMessage: event.error.message})

    handlePromiseRejection = (event) => this.setState({errorMessage: event.reason.message})

    resetError = () => this.setState({errorMessage: null})

    render() {
        if (this.state.errorMessage) {
            return <Error errorMessage={this.state.errorMessage} resetErrorMessage={this.resetError}/>
        }
        return this.props.children
    }
}

export default ErrorHandler
