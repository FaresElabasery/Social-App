import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastConfig } from "../utils/ToastConfig";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useAuth(key) {
    const { setUserToken } = useContext(AuthContext)
    const navigate = useNavigate()
    const callApi = async (values) => {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/${key}`, values)
        return response.data
    };

    return useMutation({
        mutationKey: [key],
        mutationFn: callApi,
        onSuccess: (response) => {
            toast.success(key + ' Successfully', ToastConfig)
            if (key == 'signin') {
                setUserToken(response.token)
                localStorage.setItem('token', response.token)
                navigate('/')
            }
        },
        onError: (error) => {
            if (key =='signup') {
                toast.error(error?.response?.data?.error, ToastConfig)
            }else{
                toast.error(error?.response?.data?.error, ToastConfig)
                return 'incorrect email or password'
            }
        }
    })
}
