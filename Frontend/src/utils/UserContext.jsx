import { useContext, createContext, useEffect, useState } from "react";
import { api } from "./axios";

let token = null
const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
    let [userData, setUserData] = useState(null)
    let [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            await api.get("auth/refreshtoken")
                .then(({ data }) => {
                    setAccesstoken(data.accesstoken)
                    setUserData(data.name)
                })
                .catch((err) => {
                    console.log(err)
                    setAccesstoken(null)
                    setUserData(null)
                })
                .finally(() => {
                    setIsLoading(false)
                })

        }
        fetchData()
    }, [])

    if (isLoading) return null

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext)
}

export const setAccesstoken = (value) => {
    token = value
}

export const getAccesstoken = () => {
    return token
}