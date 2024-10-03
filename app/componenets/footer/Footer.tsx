import React from "react";
import Image from "next/image";
import Apple from "@/public/apple badge.png"
import Google from "@/public/googlebadge.png"
import twitter from "@/public/Twitter.png"
import Linkdenicon from "@/public/Linkden.png"
import facebook from "@/public/Social.png"
import instagram from "@/public/Instagram.png"


export default function Footer () {
    return (
        <div className="mt-auto bg-white w-full sm:px-24 sm:py-20 max-[870px]:px-4 max-[870px]:py-3 flex flex-col border-t-[1px] border-[#DEDEDE]">
            <div className="flex flex-row max-[870px]:flex-col max-[870px]:gap-y-3 justify-between max-[870px]:items-start items-center pb-7 border-b-[1px] border-[#DEDEDE]">
                <div className="flex flex-row max-[870px]:flex-col max-[870px]:items-start gap-x-9 items-center max-[870px]:text-start text-center">
                 <h1 className="font-[700] font-chelseamarket text-[24px] text-[#E0580C]">Evento</h1>
                 <div className="flex gap-x-7 font-nunito font-[700] max-[870px]:text-[10px]">
                 <p>Explore</p>
                 <p>What’s New</p>
                 <p>Help</p>
                 <p>Contact us</p>
                 </div>
                
                </div>
                <div className="flex flex-col gap-y-3 text-center max-[870px]:text-start">
                    <h1 className="font-nunito font-[700] text-[14px] max-[870px]:text-[10px] leading-[20px]">Download the app</h1>
                    <div className="flex flex-row gap-x-2">
                        <Image src={Apple} alt="apple badge"/>
                        <Image src={Google} alt="google badge"/>
                    </div>
                </div>

            </div>
            <div className="pt-7 flex justify-between flex-row max-[870px]:flex-col max-[870px]:gap-y-5 ">
                <p className="font-nunito font-[600] text-[14px] text-[#E0580C]">© 2023 Evento. All rights reserved.</p>
                <div className="flex flex-row gap-x-3 font-nunito font-[500]">
                    <p>Terms of Service</p>
                    <p>Privacy Policy</p>

                </div>
                <div className="flex flex-row gap-x-6">
                    <Image src={Linkdenicon} alt="linkden"/>
                    <Image src={twitter} alt="twitter"/>
                    <Image src={facebook} alt="facebook"/>
                    <Image src={instagram} alt="instagram"/>
                    
                </div>

            </div>

        </div>
    )
}

