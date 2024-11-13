"use server"
import { Newax } from "@/axios/axiosinstance"

export const GetCurrentuser = async() => {
    const axinstance = await Newax()
    try {
       const response = await axinstance.get(`${process.env.BACKEND_URL}/auth/current-user/`)
       return {
        status_code : response.status,
        data : response.data.data
       }
    }catch(error : any){
       return error.response ? {
        error : error.response.data.message || "current-user failed",
        status_code: error.response.status,
      }
    : {
        error: "An unexpected error occurred.",
      };
    }
}