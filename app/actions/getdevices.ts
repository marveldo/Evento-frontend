"use server"
import { Newax } from "@/axios/axiosinstance"

export const Getdevices = async() => {
    const axinstance = await Newax()

    try{
        const response = await axinstance.get(`${process.env.BACKEND_URL}/auth/devices/`)

        return {
            status_code : response.status,
            data : response.data.data
           }
    }
    catch(error : any){
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

export const Logoutdevice = async(device_id : string) => {
    
    const axinstance = await Newax()

    try {
        const response = await axinstance.delete(`${process.env.BACKEND_URL}/auth/logout-device/${device_id}/`)
       
       
        return {
            status_code : response.status,
        }
    
    }
    catch(error : any){
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

