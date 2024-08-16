import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import io from 'socket.io-client'
import Login from '../pages/Login.jsx'
import Player from '../pages/Player.jsx'
import GameMaster from '../pages/GameMaster.jsx'
import Error from "../pages/Error.jsx"
import {useEffect} from "react"

const socket = io('http://127.0.0.1:5001/')

function App() {
    useEffect(() => {
        // Listen for reload events from the WebSocket server
        socket.on('reload', (_) => {
            window.location.reload()
        })
    }, [])
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Player/>}/>
                <Route path="/gamemaster" element={<GameMaster/>}/>
                <Route path="/error" element={<Error/>}/>
            </Routes>
        </Router>
    )
}

export default App
