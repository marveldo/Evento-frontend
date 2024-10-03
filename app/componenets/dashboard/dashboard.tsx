"use client"
import Firsticon from "@/public/Firsticon.svg"
import Trustedicon from "@/public/Trusted.svg"
import Tabsicon from "@/public/Tabs.svg"
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { ButtonC } from "../Button/button"
import { Button } from "@/components/ui/button"
import EventImage from "@/public/Frame 1000003993.png"
import { PlusIcon,ClockIcon } from "@radix-ui/react-icons"
import { LocationIcon } from "../Button/arrowicon"


export function MainDashboard(){

    return (
        <>
        <div className="grid lg:grid-cols-3 grid-cols-2 max-[400px]:grid-cols-1 justify-between gap-y-4 sm:gap-x-24 gap-x-12">
            <div className="shadow-sm shadow-[#1018280F]  min-w-[120px] w-full flex justify-between items-center p-4">
                 <div className=" flex flex-col gap-y-4 col-span-1">
                    <h1 className="font-montserrat font-[700] sm:text-[32px] text-[24px] leading-[40px]">4</h1>
                    <p className="font-nunito sm:text-[20px] text-[16px] font-[400] leading-[28px]">Upcoming events</p>
                 </div>
                 <div className="sm:block hidden">
                    <Image src={Firsticon} alt="First icon"/>
                 </div>
            </div>
            <div className="shadow-sm shadow-[#1018280F]   min-w-[168px] w-full  flex justify-between items-center p-4">
                 <div className=" flex flex-col gap-y-4 col-span-1">
                    <h1 className="font-montserrat font-[700] sm:text-[32px] text-[24px] leading-[40px]">100+</h1>
                    <p className="font-nunito sm:text-[20px] text-[16px] font-[400] leading-[28px]">Created events</p>
                 </div>
                 <div className="sm:block hidden">
                    <Image src={Tabsicon} alt="First icon"/>
                 </div>
            </div>
            <div className="shadow-sm shadow-[#1018280F]   min-w-[168px] w-full flex justify-between items-center p-4">
                 <div className=" flex flex-col gap-y-4 col-span-1">
                    <h1 className="font-montserrat font-[700] sm:text-[32px] text-[24px] leading-[40px]">90</h1>
                    <p className="font-nunito sm:text-[20px] text-[16px] font-[400] leading-[28px]">Past events</p>
                 </div>
                 <div className="sm:block hidden">
                    <Image src={Trustedicon} alt="First icon"/>
                 </div>
            </div>
        </div>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-x-24">

        <div className="col-start-1 col-end-3 space-y-4">
            <div className="flex justify-between w-full">
            <p className="font-nunito font-[600] text-[20px">Upcoming Events</p>
            <p className="font-nunito font-[700] text-[14px]">View all</p>
            </div>
           
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-12 gap-y-4 w-full">
                <div  className='rounded-[8px]'>
                   <Image src={EventImage} alt='Event Image' className="w-[100%] h-[180px]" height={180}/>
                  <div className='bg-white p-4 flex-col flex gap-y-3 shadow-sm shadow-[#1018281A]'>
                    <div className='w-full flex justify-between items-center'>
                       <p className='text-[#E57435] font-nunito font-[600] text-[12px] leading-[20px]'>Mon, 3rd Aug</p>
                       <div className='p-1 text-[12px]  font-[400] leading-[20px] text-[#E57435] bg-[#FCEEE7]'>$200</div>
                    </div>
                    <h1 className='font-montserrat font-[600] text-[20px] leading-[24px]'>Hng event</h1>
                    <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                       <LocationIcon size={5}/>
                       <p>Aluasa, Lagos</p>
                    </div>
                    <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                      <ClockIcon className='size-5'/>
                      <p>4:00 WAT</p>
                    </div>
           
         
                  </div>
                </div>  
                <div  className='rounded-[8px]'>
                   <Image src={EventImage} alt='Event Image' className="w-[100%] h-[180px]" height={180}/>
                  <div className='bg-white p-4 flex-col flex gap-y-3 shadow-sm shadow-[#1018281A]'>
                    <div className='w-full flex justify-between items-center'>
                       <p className='text-[#E57435] font-nunito font-[600] text-[12px] leading-[20px]'>Mon, 3rd Aug</p>
                       <div className='p-1 text-[12px]  font-[400] leading-[20px] text-[#E57435] bg-[#FCEEE7]'>$200</div>
                    </div>
                    <h1 className='font-montserrat font-[600] text-[20px] leading-[24px]'>Hng event</h1>
                    <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                       <LocationIcon size={5}/>
                       <p>Aluasa, Lagos</p>
                    </div>
                    <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                      <ClockIcon className='size-5'/>
                      <p>4:00 WAT</p>
                    </div>
           
         
                  </div>
                </div> 

                <div  className='rounded-[8px]'>
                   <Image src={EventImage} alt='Event Image' className="w-[100%] h-[180px]" height={180}/>
                  <div className='bg-white p-4 flex-col flex gap-y-3 shadow-sm shadow-[#1018281A]'>
                    <div className='w-full flex justify-between items-center'>
                       <p className='text-[#E57435] font-nunito font-[600] text-[12px] leading-[20px]'>Mon, 3rd Aug</p>
                       <div className='p-1 text-[12px]  font-[400] leading-[20px] text-[#E57435] bg-[#FCEEE7]'>$200</div>
                    </div>
                    <h1 className='font-montserrat font-[600] text-[20px] leading-[24px]'>Hng event</h1>
                    <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                       <LocationIcon size={5}/>
                       <p>Aluasa, Lagos</p>
                    </div>
                    <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                      <ClockIcon className='size-5'/>
                      <p>4:00 WAT</p>
                    </div>
           
         
                  </div>
                </div> 

                <div  className='rounded-[8px]'>
                   <Image src={EventImage} alt='Event Image' className="w-[100%] h-[180px]" height={180}/>
                  <div className='bg-white p-4 flex-col flex gap-y-3 shadow-sm shadow-[#1018281A]'>
                    <div className='w-full flex justify-between items-center'>
                       <p className='text-[#E57435] font-nunito font-[600] text-[12px] leading-[20px]'>Mon, 3rd Aug</p>
                       <div className='p-1 text-[12px]  font-[400] leading-[20px] text-[#E57435] bg-[#FCEEE7]'>$200</div>
                    </div>
                    <h1 className='font-montserrat font-[600] text-[20px] leading-[24px]'>Hng event</h1>
                    <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                       <LocationIcon size={5}/>
                       <p>Aluasa, Lagos</p>
                    </div>
                    <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                      <ClockIcon className='size-5'/>
                      <p>4:00 WAT</p>
                    </div>
           
         
                  </div>
                </div> 
            </div>
        </div>

        <div className="lg:flex hidden font-nunito flex-col gap-y-5 h-full w-full">
         <Calendar  className="w-full p-0 space-y-5 font-nunito"  classNames={{
              months:
                "flex w-full flex-col sm:flex-row  sm:space-x-4 sm:space-y-0 flex-1",
              month: "space-y-4 w-full flex flex-col gap-y-2",
              table: "w-full h-full border-collapse  space-y-10",
              head_row: "mb-4",
              row: "w-full mt-2",
              day_today : "bg-[#E0580C] text-white rounded-[100%]",
              cell: "text-center pt-4 relative",
              day_selected : " after:bg-[#E0580C]  after:content-['*'] after:text-[#E0580C] after:absolute after:bottom-[-3px]  after:rounded-[100%] after:text-[1px] after:block after:align-middle after:inline after:ml-1  after:p-[2px] after:h-[3px]"
              
            }}/>
        <Button className="py-6 flex gap-x-2 text-white hover:text-[#E0580C] hover:bg-white hover:border-[1px] hover:border-[#E0580C] bg-[#E0580C]">Create event <PlusIcon className="size-5"/></Button>
        <Button className="py-6 flex gap-x-2 hover:text-white text-[#E0580C] hover:bg-[#E0580C] border-[1px] border-[#E0580C] bg-white">Explore</Button>
        </div>
        </div>
    </>
    )
}