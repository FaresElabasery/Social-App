import axios from "axios"
import { AuthContext } from "../Context/AuthContext/AuthContext"
import { useContext } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { ToastConfig } from "../utils/ToastConfig"

export default function useUpdate(key, image, onClose, body, id, resetUpdateForm) {
    const queryClient = useQueryClient()
    const { userToken } = useContext(AuthContext)
    let title = ''
    const callApi = () => {
        const formdata = new FormData()
        let url = ''
        if (key === 'uploadProfilePicture') {
            url = `${import.meta.env.VITE_BASE_URL}/users/upload-photo`
            if (image instanceof File) {
                image && formdata.append('photo', image)
            } else {
                return
            }
            title = 'Profile Picture'
        } else if (key == 'updatePost') {
            url = `${import.meta.env.VITE_BASE_URL}/posts/${id}`
            title = 'Post'
            if (image instanceof File) {
                image && formdata.append('image', image)
                body && formdata.append('body', body)
            } else
                body && formdata.append('body', body)
        }
        return axios.put(url, formdata, {
            headers: {
                token: userToken
            }
        })
    }
    return useMutation({
        mutationKey: [key],
        mutationFn: callApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userInfo'] })
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails', id] })
            toast.success(`${title} Updated Successfully`,ToastConfig)
            if (key == 'updatePost') {
                resetUpdateForm()
            } else
                onClose()
        },
        onError: () => {
            toast.error('Profile Picture Update Failed',ToastConfig)
            if (key == 'updatePost') {
                resetUpdateForm()
            }
        }
    })
}

