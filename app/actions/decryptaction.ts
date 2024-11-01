"use server"
import { decryptToken } from "../utils/token_encryption";
import { Newax } from "@/axios/axiosinstance";


export const tokendecrypt = async(access : string) => {
    return decryptToken(access)
}

export const TestToken = async() => {
    const axinstance = await Newax()
    try {
        const response = await axinstance.get(`${process.env.BACKEND_URL}/auth/`)
        return {
            status : response.status
        }
    }
    catch(error : any){
        return error.response ? {
            status : error.response.status
        } : {
            status : 500
        }
    }
}
