import React from "react"
import Sidebar from "../componenets/settings/bar"

interface SettingsLayout{
    children : React.ReactNode
}

export default function SettingsLayout({children} : Readonly<SettingsLayout>){
    return (
        <div className="pt-36 w-full flex mb-40 gap-x-8">
         <Sidebar/>
         {children}
        </div>
    )
}