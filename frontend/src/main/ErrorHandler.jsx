import React, {Component} from 'react'
import Error from '../components/Error.jsx'


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
        window.addEventListener('error', this.handleGlobalError)
        window.addEventListener('unhandledrejection', this.handlePromiseRejection)
    }

    componentWillUnmount() {
        window.removeEventListener('error', this.handleGlobalError)
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
