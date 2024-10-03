import React from "react";
import {  ButtonN } from "../Button/button";
import { Arrow } from "../Button/arrowicon";
import Image from "next/image";
import avatarimages from "@/public/Frame 1171275765.png"
import mainframe from "@/public/Frame 1171276051.png"


export default function Body () {

    return (
        
         <div className=" max-[1250px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 sm:py-8 sm:pt-40 max-[600px]:pt-40 flex flex-row max-[870px]:flex-col max-[870px]:items-center max-[870px]:gap-y-10 gap-x-14 w-full">
           <div className="flex flex-col gap-y-6 py-1 w-1/2 max-[870px]:w-full max-[870px]:items-center max-[870px]:text-center">
            <div className="border-[1px] font-[500] font-nunito leading-[16px] border-[#E0580C] text-[#E0580C] px-4 py-2  max-[1200px]:text-[12px] min-[1300px]:text-[16px] max-[1290px]:text-[12px] max-w-[329px] rounded-[12px] flex items-center justify-between gap-x-2 bg-white">
            Plan your special event with us now
                <Arrow/>
            </div>
           <div className="max-[1200px]:text-[40px] font-montserrat  leading-[60px] min-[1300px]:text-[48px] max-[870px]:text-[24px] max-[1290px]:text-[40px] font-[700] ">
           <h1>Never miss a moment with <span className="text-[#E0580C]">Evento</span></h1>
        
            </div>    

            <div className="max-[1200px]:text-[14px] min-[1300px]:text-[20px] max-[1290px]:text-[14px]  font-[600] font-nunito pe-8">
            <h1>Effortlessly organize your schedule an stay on top </h1>
            <h1>of your plans.</h1>
            </div>   
            <div className="flex gap-x-2 items-center max-[870px]:justify-center max-[870px]:text-[11px]">
                <Image src={avatarimages} alt="Avatar images" />
                <p>Join over 12,00+ people in creating events </p>
            </div>
            
            <ButtonN>Create your event</ButtonN>    
            
           </div>

           <div className="sm:w-1/2">
             <Image src={mainframe} alt="Mainpic"/>
           </div>
        </div>
       
    )
}
