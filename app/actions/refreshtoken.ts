import axios from "axios"
import { decryptToken } from "../utils/token_encryption"

export const Refreshtoken = async(refresh_token : string , device_id : string) => {
    
    try{
        const response = await axios.post(`${process.env.BACKEND_URL}/auth/refresh/`,{
            refresh : refresh_token,
            device_id : device_id
        })
        const access = response.data.access
        const refresh = response.data.refresh
        const data = response.data.data

        return {
            access_token : access,
            refresh_token : refresh,
            user : {
                userId : data.id,
                name : data.full_name,
                image : data.profile_img,
                email : data.email,
                device_id : device_id
            },
        }
    }catch(error : any){
       return null
    }
}
