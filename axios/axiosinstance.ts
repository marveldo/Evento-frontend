"use server"
import { authOptions } from "@/lib/authOptions"
import axios from "axios"
import { getServerSession } from "next-auth"
import { decryptToken, encryptToken } from "@/app/utils/token_encryption"
import { cookies } from "next/headers"
import { encode } from "next-auth/jwt"
import { getSession } from "next-auth/react"


export const  Newax = async() => {
    const session = await getServerSession(authOptions)
    const decrypted_access = decryptToken(session?.access_token)
    const axios_instance = axios.create({
        baseURL : process.env.BACKEND_URL,
        headers : {
            "Content-Type" : "multipart/form-data",
            "Authorization" : `Bearer ${decrypted_access}`
        }
    })
    
axios_instance.interceptors.request.use(async(req)=>{
        return req
    })



    return axios_instance
}
