import React, {createContext, useState} from 'react'

export const GlobalContext = createContext({})
export const GlobalProvider = ({children}) => {
    const [globalState, setGlobalState] = useState({playerName: undefined, players: undefined, turns: undefined, currentTurn: undefined, abilityTemplates: undefined})
    return (
        <GlobalContext.Provider value={{globalState, setGlobalState}}>
            {children}
        </GlobalContext.Provider>
    )
}
