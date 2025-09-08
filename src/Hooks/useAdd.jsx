import axios from "axios"
import { useContext } from "react"
import { AuthContext } from "../Context/AuthContext/AuthContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { ToastConfig } from "../utils/ToastConfig"

export default function useAdd(key, id, reset) {
    const { userToken } = useContext(AuthContext)
    const queryClient = useQueryClient()
    let url = ''
    const callApi = (values) => {
        if (key == 'addComment') {
            url = `${import.meta.env.VITE_BASE_URL}/comments`
        }
        return axios.post(url, {
            content: values.content.trim(),
            post: id
        }, {
            headers: {
                token: userToken
            }
        })
    }

    return useMutation({
        mutationKey: ['addComment'],
        mutationFn: callApi,
        onSuccess: () => {
            toast.success('Comment Added Successfully', ToastConfig)
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails', id] })
            reset()
        },
    })
}
