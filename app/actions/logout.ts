"use server"
import { authOptions } from "@/lib/authOptions"
import axios from "axios"
import { getServerSession } from "next-auth"


export const Logout = async() => {
    const session = await getServerSession(authOptions)

    try {
        const response = await axios.post(`${process.env.BACKEND_URL}/auth/logout/`, {
            refresh_token : session?.refresh_token ,
            device_id : session?.user?.device_id
        })

        return {
            status : response.status,
        }
    }
    catch(error : any){
        return error.response ? {
            error : error.response.data.message || "Logout Failed",
            status: error.response.status,
          }
        : {
            error: "An unexpected error occurred.",
          };
    }
}