import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext()

export function AuthContextProvider({ children }) {
    const [userToken, setUserToken] = useState(localStorage.getItem("token") || '')

    const getUserInfo = () => {
        return axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile-data`, {
            headers: {
                token: userToken
            }
        }).then(res => res.data)
    }
    const { data: userInfo, isLoading: isUserInfoLoading } = useQuery({
        queryKey: ['userInfo', userToken],
        queryFn: getUserInfo,
    })

    return <AuthContext.Provider value={{ userToken, setUserToken, userInfo, isUserInfoLoading}}>
        {children}
    </AuthContext.Provider>
}