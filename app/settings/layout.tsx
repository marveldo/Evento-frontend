import React from "react"
import Sidebar from "../componenets/settings/bar"

interface SettingsLayout{
    children : React.ReactNode
}

export default function SettingsLayout({children} : Readonly<SettingsLayout>){
    return (
        <div className="pt-36 w-full flex md:flex-row flex-col mb-40 gap-x-8 gap-y-12">
         <Sidebar/>
         {children}
        </div>
    )
}