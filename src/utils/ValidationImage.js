import { toast } from "react-toastify";
import { ToastConfig } from "./ToastConfig";

export const ValidationImage = (e) => {
    let file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
        toast.error('Please upload a file less than 1MB', ToastConfig)
    } else if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
        toast.error('Please upload a valid image', ToastConfig)
    }else{
        return true
    }
    return false
}