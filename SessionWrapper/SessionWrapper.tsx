"use client"
import React from "react"
import { SessionProvider } from "next-auth/react"

interface SessionProps {
    children : React.ReactNode
}


export default function SessionWrapper({children}:SessionProps): JSX.Element{

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )

}