import axios from "axios"
import { decryptToken } from "../utils/token_encryption"

export const Refreshtoken = async(refresh_token : string) => {
    
    try{
        const response = await axios.post(`${process.env.BACKEND_URL}/auth/refresh/`,{
            refresh : refresh_token
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
                email : data.email
            },
        }
    }catch(error : any){
       return null
    }
}
