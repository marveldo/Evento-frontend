"use server"
import { Newax } from "@/axios/axiosinstance"
import FormData from "form-data"

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
        status_code: error.response.status || 500,
      }
    : {
        error: "An unexpected error occurred." ,
        status_code : 500
      };
    }
}

export const Updatecurrentuser = async(values : FormData) => {
    const axinstance = await Newax()
   
     try {
       const response = await axinstance.put(`${process.env.BACKEND_URL}/auth/current-user/`, values)

       return {
        status : 200,
        data : response.data.data
       }


     }
     catch(error : any){
      return error.response ? {
        error : error.response.data || "Update user failed",
        status: error.response.status || 500,
      }
    : {
        error: "An unexpected error occurred." ,
        status : 500
      };
     }

}