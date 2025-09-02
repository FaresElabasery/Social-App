import { useContext } from "react"
import { AuthContext } from './../Context/AuthContext/AuthContext';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function usePosts(key) {
    const { userToken: token, userInfo } = useContext(AuthContext)
    const callApi = () => {
        let url = ''
        if (key == 'userInfo') {
            url = `${import.meta.env.VITE_BASE_URL}/users/profile-data`
        } else if (Array.isArray(key) && key[0] == 'userPosts') {
            url = `${import.meta.env.VITE_BASE_URL}/users/${key[1]}/posts`
        } else if (key == 'allPosts') {
            url = `${import.meta.env.VITE_BASE_URL}/posts?sort=-createdAt`
        }
        return axios.get(url, {
            headers: {
                token
            }
        }
        ).then(res => res.data)
    }
    return useQuery({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: callApi,
        staleTime: 8 * 1000, // 8 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!token && !!key && !!userInfo
    })
}