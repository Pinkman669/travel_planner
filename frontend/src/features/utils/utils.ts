import { toast } from "react-toastify"

export const notify = (success: boolean, msg: string) => {
    if (success) {
        return toast.success(msg)
    } else {
        return toast.error(msg)
    }
}