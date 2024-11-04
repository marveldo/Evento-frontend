"use client"
import React from "react"
import { useSession } from "next-auth/react"
import { tokendecrypt , TestToken } from "@/app/actions/decryptaction"
import  useWebSocket , { SendMessage }  from 'react-use-websocket';
import { useToast } from "@/hooks/use-toast";

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
        shouldconnect ? `ws://${process.env.NEXT_PUBLIC_BACKEND_HOST}/ws/notifications/?access_token=${token}` : null, 
        {
        
        onMessage : (event) => {
            const data = JSON.parse(event.data)
            toast({
                title : data.detail,
                description : data.message,
                className : 'bg-[#E0580C] text-white font-nunito'
            })
        },
        onClose : (event) => setshouldconnect(false),
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