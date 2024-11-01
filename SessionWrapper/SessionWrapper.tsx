"use client"
import React from "react"

import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"

interface SessionProps {
    children : React.ReactNode,
    session : Session | null
}



export default  function SessionWrapper({children , session}:SessionProps): JSX.Element{
    
    return (
        <SessionProvider  session={session} >
            {children}
        </SessionProvider>
    )

    

}