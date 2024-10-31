import React, { createContext, useContext, useState } from 'react'

const Context = createContext()

export const ContextProvider = ({ children }) => {
    const [guest, setGuest] = useState(true)
    const [authSus, setAuthSus] = useState(false)
    const [authMessage, setAuthMessage] = useState('')

    return (
        <Context.Provider value={{ guest, setGuest, authSus, setAuthSus, authMessage, setAuthMessage }}>
            {children}
        </Context.Provider>
    )
}

export const useGuest = () => useContext(Context)