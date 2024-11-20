"use server"
import { Newax } from "@/axios/axiosinstance"
import { notFound } from "next/navigation"
import { status } from "nprogress"
import { redirect } from "next/navigation"


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
                error : error.response.data.message || "Get Events Failed",
                status: error.response.status,
              }
            : {
                status : 500,
                error: "An unexpected error occurred.",
              };
        }
      }

export const Getevent = async(param : string) => {
    const axinstance = await Newax()
    try{
      const response = await axinstance.get(`${process.env.BACKEND_URL}/events/${param}/`)
      
      return {
        status : 200 ,
        data : response.data.data
      }
    }
    catch(error : any) {
        if (error.response?.status === 404){
           redirect('/404')
        }
        else{
        return error.response ? {
          error : error.response.data.message || "Get Event Failed",
          status: error.response.status,
        } :  {
          error: "An unexpected error occurred.",
        }
      }
    }
}

export const Geteventattendees = async(param : string , offset : number) => {
    const axinstance = await Newax()
    try{
      const response = await axinstance.get(`${process.env.BACKEND_URL}/events/${param}/attendees/?offset=${offset}&limit=5`)

      return {
        status : 200,
        count : response.data.count as number,
        data : response.data.data,
        total : response.data.total_pages as number
      }
    }
    catch(error : any){
      if (error.response?.status === 404){
        redirect('/404')
      }
      else{
        return error.response ? {
          error : error.response.data.message || "Get Event Failed",
          status: error.response.status,
        
        } :  {
          error: "An unexpected error occurred.",
          
        }
      }
    }
}

export const RegisterUser = async(param : string , offset : number, email : string | null | undefined) => {
     const axinstance = await Newax()
     try{
      const response = await axinstance.post(`${process.env.BACKEND_URL}/events/${param}/attendees/?offset=${offset}&limit=5`, { email : email})

      return {
        status : 200,
        count : response.data.count as number,
        data : response.data.data,
        total : response.data.total_pages as number
      }
    }
    catch(error : any){
      if (error.response?.status === 404){
        notFound()
      }
      else{
        return error.response ? {
          error : error.response.data.message || "Get Event Failed",
          status: error.response.status,
        
        } :  {
          error: "An unexpected error occurred.",
          
        }
      }
    }
}
