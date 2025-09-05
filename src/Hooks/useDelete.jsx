import { useContext } from "react"
import { AuthContext } from "../Context/AuthContext/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ToastConfig } from "../utils/ToastConfig"
import { useNavigate } from "react-router-dom"

export default function useDelete(key, id, from) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { userToken } = useContext(AuthContext)
    const callApi = () => {
        let url = ''
        if (key == 'deletePost') {
            url = `${import.meta.env.VITE_BASE_URL}/posts/${id}`
        }
        if (key == 'deleteComment') {
            url = `${import.meta.env.VITE_BASE_URL}/comments/${id}`
        }
        return axios.delete(url, {
            headers: {
                token: userToken
            }
        })
    }
    return useMutation({
        mutationKey: [key],
        mutationFn: callApi,
        onSuccess: () => {
            toast.success(`${key.split('delete')[1]} Deleted Successfully`, ToastConfig)
            queryClient.invalidateQueries('allPosts')
            queryClient.invalidateQueries('userPosts')
            if (from == 'PostDetails') {
                navigate(-1)
            }
        },
        onError: () => {
            toast.error(`Error in Deleting ${key.split('delete')[1]}`, ToastConfig)
        }
    })
}
