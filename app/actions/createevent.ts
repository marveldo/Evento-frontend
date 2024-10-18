"use server"
import { Newax } from "@/axios/axiosinstance";
import FormData from "form-data";


export const CreateEvents = async(formdata : FormData) => {
    const axinstance = await Newax()
   

    try{
        const response = await axinstance.post(`${process.env.BACKEND_URL}/events/`, formdata)
        return {
            status_code : 201,
            data : response.data.data
        }
    }catch(error : any){
        return error.response ? {
            error : error.response.data.message || "Create Organization failed.",
            status_code: error.response.status,
          }
        : {
            error: "An unexpected error occurred.",
          };
    }
}