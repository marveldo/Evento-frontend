"use server"
import { authOptions } from "@/lib/authOptions"
import axios from "axios"
import { getServerSession } from "next-auth"
import { decryptToken, encryptToken } from "@/app/utils/token_encryption"
import { cookies } from "next/headers"
import { encode } from "next-auth/jwt"

export const  Newax = async() => {
    const session = await getServerSession(authOptions)
    const decrypted_access = decryptToken(session?.access_token)
    const axios_instance = axios.create({
        baseURL : process.env.BACKEND_URL,
        headers : {
        
            Authorization : `Bearer ${decrypted_access}`
        }
    })
    
axios_instance.interceptors.request.use(async(req)=>{
        return req
    })

axios_instance.interceptors.response.use(
    response => response, //return successful response directly
    async error => {
        const originalrequest = error.config;
        if(error.response.status == 401 && !originalrequest._retry){
            originalrequest._retry = true //mark the request retried to aviod infinite loops
            try{
                const response = await axios.post(`${process.env.BACKEND_URL}/auth/refresh/`,{
                    refresh : decryptToken(session?.refresh_token)
                })
                const access = response.data.access
                const refresh = response.data.refresh
                const data = response.data.data
                
                const encodedsession = await encode({
                    secret : process.env.NEXTAUTH_SECRET as string,
                    token : {
                       access_token : access,
                       refresh_token : refresh,
                       user : {
                         userId : data.id,
                         name : data.full_name,
                         image : data.profile_img,
                         email : data.email
                       }
                    },
                    maxAge : 30 * 24 * 60 * 60 
                })
                const cookiestore = cookies()
                cookiestore.set('next-auth.session-token',encodedsession,{
                    httpOnly : true,
                    sameSite : 'lax',
                    maxAge : 30 * 24 * 60 * 60 
                })
                axios_instance.defaults.headers.common['Authorization'] = `Bearer ${access}`
                originalrequest.headers['Authorization'] = `Bearer ${access}`
                return axios_instance(originalrequest)

            }catch(error){
                return Promise.reject(error)
            }

        }
        return Promise.reject(error)
    }

)

    return axios_instance
}
