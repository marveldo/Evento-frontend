"use client"
import React from "react"
import { useSession } from "next-auth/react"
import { tokendecrypt , TestToken } from "@/app/actions/decryptaction"
import  useWebSocket , { SendMessage }  from 'react-use-websocket';
import { useToast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";


interface Hookprops{
    children : React.ReactNode
}

interface WebSocketContextType {
    sendMessage: SendMessage | null;
    lastMessage: MessageEvent<any> | null;
    
  }


const WebsocketContext = React.createContext<WebSocketContextType | null>(null)
export const Websockethook = ({children}: Hookprops) => {
       const {data : session , status} = useSession()
      

       
       
       const [shouldconnect , setshouldconnect] = React.useState(false)
       const [token , settoken] = React.useState('')
       const {toast} = useToast()
       const connectwebsocket = async() => {
        
           const token = session?.access_token as string
           settoken(token)
           setshouldconnect(true)
        
        
       
       }

   
      

    const {sendMessage , lastMessage  } = useWebSocket(
        shouldconnect ? `wss://${process.env.NEXT_PUBLIC_BACKEND_HOST}/ws/notifications/?access_token=${token}` : null, 
        {
        
        onMessage : (event) => {
            const data = JSON.parse(event.data)
            toast({
                title : data.detail,
                description : data.message,
                className : 'bg-[#E0580C] text-white font-nunito'
            })
        },
        onClose : (event) =>{
            if(event.code === 4401){
                toast({
                    title : 'User logged Out',
                    description : 'You Have Been Logged out from a different device',
                    variant : 'destructive',
                    className : 'text-white font-nunito'

                })
                signOut({callbackUrl : '/'})
            }
            setshouldconnect(false)
        },
        retryOnError : true
    }

    )
   
       
 
    
    
    React.useEffect(()=>{
        if(session && status === 'authenticated'){
       
            connectwebsocket()
    
           }
        
        
    },[session])
    return (
            <WebsocketContext.Provider value={{sendMessage , lastMessage}} >
                {children}
            </WebsocketContext.Provider>
     )
       
}