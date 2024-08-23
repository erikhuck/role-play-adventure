import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import io from 'socket.io-client'
import Login from '../pages/Login.jsx'
import Player from '../pages/Player.jsx'
import GameMaster from '../pages/GameMaster.jsx'
import Error from "../pages/Error.jsx"
import {useCallback, useContext, useEffect} from "react"
import {GlobalContext} from "./GlobalContext.jsx"
import ErrorHandler from './ErrorHandler.jsx'
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
        socket.on('update-global-state', (data) => {
            updateGlobalState(data)
        })
    }, [])
    return (
        <Router>
            <ErrorHandler>
                <Routes>
                    <Route path="/login" element={<Login updateGlobalState={updateGlobalState}/>}/>
                    <Route path="/" element={<Player updateGlobalState={updateGlobalState}/>}/>
                    <Route path="/gamemaster" element={<GameMaster/>}/>
                    <Route path="/error" element={<Error/>}/>
                </Routes>
            </ErrorHandler>
        </Router>
    )
}

export default App
