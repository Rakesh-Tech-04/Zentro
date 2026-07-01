import { useContext, createContext, useEffect, useState } from "react";
import { api } from "./axios";

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
    let [accesstoken, setAccesstoken] = useState(null)
    let [username, setUsername] = useState(null)

    useEffect(() => {
        async function fetchData() {
            await api.get("auth/refreshtoken")
                .then(({ data }) => {
                    localStorage.setItem('accesstoken', data.accesstoken)
                    setAccesstoken(data.accesstoken)
                    setUsername(data.name)
                })
                .catch((err) => {
                    console.log(err)
                    setAccesstoken(null)
                    setUsername(null)
                })
        }
        fetchData()
    }, [])

    return (
        <UserContext.Provider value={{ accesstoken, username, setUsername, setAccesstoken }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext)
}