import React from "react"
import { EventFormComp } from "../componenets/create-event/event-form"
export default function EventFormPage(){
    return <div className="w-full pt-32 flex justify-center mb-40">
        <div className="w-full max-w-[592px] space-y-16 md:px-0 px-3">
           <EventFormComp/>
        </div>
    </div>
}