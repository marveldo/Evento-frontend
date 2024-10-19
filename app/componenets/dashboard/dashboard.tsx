"use client"
import React from "react"
import Firsticon from "@/public/Firsticon.svg"
import Trustedicon from "@/public/Trusted.svg"
import Tabsicon from "@/public/Tabs.svg"
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { PlusIcon,ClockIcon } from "@radix-ui/react-icons"
import { LocationIcon } from "../Button/arrowicon"
import { GetCurrentuser } from "@/app/actions/getcurrentuser"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Event } from "../home/Events"
import moment from "moment"
import Link from "next/link"
import Calendericon from "@/public/calendericon.svg"

interface UserDetails {
    id : string,
    full_name : string,
    email : string,
    profile_img : string,
    upcoming_events_count : number,
    past_events_count : number,
    created_events_count : number,
    upcoming_events : Event[]
}

export function MainDashboard(){
    const [loading, setloading] = React.useState(true)
    const {toast} = useToast()
    const [userdetails, setuserdetails] = React.useState<UserDetails | null>(null)
    let showupcomingevents : String | React.JSX.Element = ''
    const [selecteddays, setselecteddays] = React.useState<Date[] | undefined>(undefined)
    const loading_div = <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-12 gap-y-4 w-full">{
      [1,2,3].map((obj,index)=> {
         return(
             <div className="flex flex-col space-y-3">
             <Skeleton className="h-[180px] w-full rounded-xl" />
             <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
             </div>
           </div>
         )
        
     })
    }</div> 

    if(userdetails !== null){
      if(userdetails.upcoming_events.length >= 1){
         showupcomingevents = <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-12 gap-y-4 w-full">
          { userdetails.upcoming_events.slice(0,6).map((obj, index)=> {
            return (<Link href={`events/${obj.id}`} key={index}  className='rounded-[8px]'>
              <img src={obj.event_image} alt='Event Image' className="w-[100%] h-[180px]"/>
             <div className='bg-white p-4 flex-col flex gap-y-3 shadow-sm shadow-[#1018281A]'>
               <div className='w-full flex justify-between items-center'>
                  <p className='text-[#E57435] font-nunito font-[600] text-[12px] leading-[20px]'>{moment(obj.start_date).format('ddd Do MMM ')}</p>
                  <div className='p-1 text-[12px]  font-[400] leading-[20px] text-[#E57435] bg-[#FCEEE7]'>${obj.price}</div>
               </div>
               <h1 className='font-montserrat font-[600] text-[20px] leading-[24px]'>{obj.event_name}</h1>
               <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                  <LocationIcon size={5}/>
                  <p>{obj.location}</p>
               </div>
               <div className='flex gap-x-1 text-[#676767] items-center font-nunito text-[12px] leadin-[20px] font-[500]'>
                 <ClockIcon className='size-5'/>
                 <p>{obj.start_time} WAT</p>
               </div>
           </div>
           </Link> )
          })}
         </div>
        }else{
          showupcomingevents = <div className="col-start-1 col-end-3 space-y-4 p-4">
            <div className="flex flex-col gap-y-4 text-center items-center">
               <Image src={Calendericon} alt="Calernder" />
               <p className="font-montserrat font-[600] md:text-[24px] text-[20px]">Hey there! 👋 It seems like this corner is a bit quiet</p>
               <p className="font-nunito font-[700] text-[16px]">Click the <Link className="text-[#E0580C]" href='/create-event'>create event </Link>or <Link href='/home' className="text-[#E0580C]">explore </Link>event button to get started</p>
            </div>
          </div>
        }
      }else {
        showupcomingevents = ''
      }
    

    React.useEffect(()=>{
        const loaddata = async()=>{
         try{
         const response = await GetCurrentuser() 
         if (response.status_code === 200){
            setuserdetails(response.data)
            const datelist : Date[] = []
            response.data.upcoming_events.map((obj : Event) => {
              datelist.push(new Date(obj.start_date))
            })
            setselecteddays(datelist)
         }
         else if(response.status_code === 401){
            toast({
               variant : 'destructive',
               title : "Session Expired",
               description : 'Please Login again'
             })
             signOut({callbackUrl : '/'})
         }
         else{
            toast({
               variant : 'destructive',
               title : "Couldnt retrieve details",
               description : 'Reload the page or try again later'
             })
         }
        }
        finally{
         setloading(false)
        }
      }
        loaddata()
    }, [])
    return (
        <>
        <div className="grid lg:grid-cols-3 grid-cols-2 max-[400px]:grid-cols-1 justify-between gap-y-4 sm:gap-x-24 gap-x-12">
            <div className="shadow-sm shadow-[#1018280F]  min-w-[120px] w-full flex justify-between items-center p-4">
                { loading ? <div className=" flex flex-col gap-y-4 col-span-1">
                  <Skeleton className="h-[30px] md:w-[200px] w-[80px] max-[392px]:w-[180px] rounded-xl"/>
                  <Skeleton className="h-[40px] md:w-[250px] w-[120px] max-[392px]:w-[220px]  rounded-xl"/>
                </div> : <div className=" flex flex-col gap-y-4 col-span-1">
                    <h1 className="font-montserrat font-[700] sm:text-[32px] text-[24px] leading-[40px]">{userdetails === null ? '--' : userdetails.upcoming_events_count}</h1>
                    <p className="font-nunito sm:text-[20px] text-[16px] font-[400] leading-[28px]">Upcoming events</p>
                 </div>}
                 <div className="sm:block hidden">
                    <Image src={Firsticon} alt="First icon"/>
                 </div>
            </div>
            <div className="shadow-sm shadow-[#1018280F]   min-w-[168px] w-full  flex justify-between items-center p-4">
                 {loading ? <div className=" flex flex-col gap-y-4 col-span-1">
                  <Skeleton className="h-[30px] md:w-[200px] w-[80px] max-[392px]:w-[180px]  rounded-xl"/>
                  <Skeleton className="h-[40px] md:w-[250px] w-[120px] max-[392px]:w-[220px]  rounded-xl"/>
                </div> : <div className=" flex flex-col gap-y-4 col-span-1">
                    <h1 className="font-montserrat font-[700] sm:text-[32px] text-[24px] leading-[40px]">{userdetails === null ? '--' : userdetails.created_events_count}</h1>
                    <p className="font-nunito sm:text-[20px] text-[16px] font-[400] leading-[28px]">Created events</p>
                 </div>}
                 <div className="sm:block hidden">
                    <Image src={Tabsicon} alt="First icon"/>
                 </div>
            </div>
            <div className="shadow-sm shadow-[#1018280F]   min-w-[168px] w-full flex justify-between items-center p-4">
                { loading ? <div className=" flex flex-col gap-y-4 col-span-1">
                  <Skeleton className="h-[30px] md:w-[200px] w-[80px] max-[392px]:w-[180px]  rounded-xl"/>
                  <Skeleton className="h-[40px] md:w-[250px] w-[120px] max-[392px]:w-[220px] rounded-xl"/>
                </div> : <div className=" flex flex-col gap-y-4 col-span-1">
                    <h1 className="font-montserrat font-[700] sm:text-[32px] text-[24px] leading-[40px]">{userdetails === null ? '--' : userdetails.past_events_count}</h1>
                    <p className="font-nunito sm:text-[20px] text-[16px] font-[400] leading-[28px]">Past events</p>
                 </div>}
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
           
           { loading ? loading_div : showupcomingevents }
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
              
            }}
            selected = {selecteddays}
            />
        <Link href='/create-event' ><Button className="py-6 flex gap-x-2 text-white hover:text-[#E0580C] hover:bg-white hover:border-[1px] hover:border-[#E0580C] bg-[#E0580C] w-full">Create event <PlusIcon className="size-5"/></Button></Link>
        <Link href='/home'><Button className="py-6 flex gap-x-2 hover:text-white text-[#E0580C] hover:bg-[#E0580C] border-[1px] border-[#E0580C] bg-white w-full">Explore</Button></Link>
        </div>
        </div>
    </>
    )
}