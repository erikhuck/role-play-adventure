import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom'
import ErrorHandler from './ErrorHandler.jsx'
import App from './App.jsx'
import './index.css'

// noinspection JSUnresolvedReference,JSXUnresolvedComponent
ReactDOM.createRoot(
    // eslint-disable-next-line no-undef
    document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <ErrorHandler>
                <App/>
            </ErrorHandler>
        </Router>
    </React.StrictMode>
)
