"use server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"

export async function getsession(){
    
    const session = await getServerSession(authOptions)
    if (session !== null){
        return {
            status : 'authenticated',
            session : session
        }
    }
    else{
        return {
            status :  'unauthenticated',
            session : null
        }
    }
}