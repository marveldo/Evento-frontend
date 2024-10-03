"use server"
import { Newax } from "@/axios/axiosinstance"


export const Getevents = async(param : string) => {
      const axiis = await Newax()
      try{
         const response = await axiis.get(`${process.env.BACKEND_URL}/events/?tag=${param}`)
         return {
            status : 200,
            data : response.data.data}
      }
      catch(error : any){
            return error.response ? {
                error : error.response.data.message || "Create Organization failed.",
                status: error.response.status,
              }
            : {
                error: "An unexpected error occurred.",
              };
        }
      }

