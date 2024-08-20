import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import io from 'socket.io-client'
import Login from '../pages/Login.jsx'
import Player from '../pages/Player.jsx'
import GameMaster from '../pages/GameMaster.jsx'
import Error from "../pages/Error.jsx"
import {useCallback, useContext, useEffect} from "react"
import {GlobalContext} from "./GlobalContext.jsx"

const socket = io('/', {path: '/api/websocket'})


function App() {
    const {setGlobalState} = useContext(GlobalContext)
    const updateGlobalState = useCallback((partialState) => {
        setGlobalState((prevState) => ({
            ...prevState,
            ...partialState,
        }))
    }, [setGlobalState])
    useEffect(() => {
        (async function () {
            // Cannot use apiFetch since navigate can only be used within a Router component which are defined below.
            const response = await fetch('/api/conditions')
            const conditions = await response.json()
            updateGlobalState({conditions})
        })()
    }, [])
    useEffect(() => {
        // Listen for events from the web socket.
        socket.on('update-global-state', (data) => {
            updateGlobalState(data)
        })
    }, [])
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Player updateGlobalState={updateGlobalState}/>}/>
                <Route path="/gamemaster" element={<GameMaster/>}/>
                <Route path="/error" element={<Error/>}/>
            </Routes>
        </Router>
    )
}

export default App
