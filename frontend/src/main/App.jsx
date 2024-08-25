import React, {useState} from 'react'
import {Route, Routes} from 'react-router-dom'
import io from 'socket.io-client'
import {apiFetch} from '../lib.js'
import Login from '../pages/Login.jsx'
import Player from '../pages/Player.jsx'
import GameMaster from '../pages/GameMaster.jsx'
import {useCallback, useEffect} from "react"
import GlobalContext from "./GlobalContext.jsx"

const socket = io('/', {path: '/api/websocket'})

const App = () => {
    const [appIsSetUp, setAppIsSetUp] = useState(false)
    const [globalState, setGlobalState] = useState({playerName: undefined, players: undefined, turns: undefined, currentTurn: undefined})
    const updateGlobalState = useCallback((partialState) => {
        setGlobalState((prevState) => ({
            ...prevState,
            ...partialState
        }))
    }, [setGlobalState])
    useEffect(() => {
        (async () => {
            const initialGlobalState = await apiFetch('init', 'GET')
            setGlobalState(initialGlobalState)
            socket.on('update-global-state', (data) => {
                updateGlobalState(data)
            })
            setAppIsSetUp(true)
        })()
    }, [])
    // noinspection JSXUnresolvedComponent
    return (
        appIsSetUp ? (
            <GlobalContext.Provider value={{globalState, setGlobalState}}>
                <Routes>
                    <Route path="/login" element={<Login updateGlobalState={updateGlobalState}/>}/>
                    <Route path="/" element={<Player updateGlobalState={updateGlobalState}/>}/>
                    <Route path="/gamemaster" element={<GameMaster/>}/>
                </Routes>
            </GlobalContext.Provider>
        ) : (
            <p>Setting up app...</p>
        )
    )
}

export default App
