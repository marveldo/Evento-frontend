"use client"
import { ClockIcon } from '@radix-ui/react-icons'
import { LocationIcon } from '../Button/arrowicon'
import { useEffect, useState, useTransition } from "react"
import { Getevents } from "@/app/actions/getevents"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import moment from "moment"
import { signOut } from "next-auth/react"

export interface Event {
    location : string ,
    start_time : string,
    people_registered : string,
    price : number ,
    start_date : Date,
    event_image : string,
    event_name : string
    
}





export function PopularEvents({ tag } : {tag : string | null}) : JSX.Element {
    const [events, setevent] = useState<Event[] | null>(null)
    let showevents : string | React.JSX.Element[] = '' 
    const {toast} = useToast()
    const [isloading, startTransition] = useTransition()
    const  amount  = [1,2,3]
    const loading_div = amount.map((obj,index)=> {
        return(
            <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[180px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        )
       
    })
    
    if(events !== null){
        if(events.length >= 1){
        showevents = events.slice(0,6).map((obj,index)=>{
            return(
                <div  key={index} className='rounded-[8px]'>
               <img src={obj.event_image} alt='Event Image' className="w-[100%] h-[180px]" />
           <div className='bg-white p-4 flex-col flex gap-y-3 shadow-sm shadow-[#1018281A]'>
             <div className='w-full flex justify-between items-center'>
                 <p className='text-[#E57435] font-nunito font-[600] text-[12px] leading-[20px]'>{moment(obj.start_date).format('ddd Do MMM ')}</p>
                 <div className='p-1 text-[12px]  font-[400] leading-[20px] text-[#E57435] bg-[#FCEEE7]'>${`${obj.price}`}</div>
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
         </div>  
            )
         }
        )
    }
    else{
        showevents = ''
    }
    }
    else{
      showevents
    }
    
    useEffect(()=>{
    
    
     startTransition(async()=>{
        const querytag = tag !== null ? tag : 'Popular'
        const response2 = await Getevents(querytag)
       
        if (response2.status === 200){
            setevent(response2.data)
        }
        else if(response2.status === 401){
            toast({
                variant : 'destructive',
                title : 'Session Timed out',
                description :'Please Log in again'
            })
            signOut({callbackUrl : '/'})
        }
        else{
           toast({
            variant : 'destructive',
            title : 'Error getting events',
            description :'Please refresh the page again '
           })
        }
        
          
          
     })
       
    },[tag])
    return (
    <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grrid-cols-1 gap-[56px]'>
    {isloading ? loading_div : showevents}
    </div>
      )
}



export function RecommendedEvents() : JSX.Element {
    const [events, setevent] = useState<Event[] | null>(null)
    let showevents : string | React.JSX.Element[] = '' 
    const {toast} = useToast()
    const [isloading, startTransition] = useTransition()
    const  amount  = [1,2,3]
    const loading_div = amount.map((obj,index)=> {
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
    if(events !== null){
        if(events.length >= 1){
        showevents = events.slice(0,6).map((obj,index)=>{
            return(
                <div  key={index} className='rounded-[8px]'>
                <img src={obj.event_image} alt='Event Image' className="w-[100%] h-[180px]"/>
           <div className='bg-white p-4 flex-col flex gap-y-3 shadow-sm shadow-[#1018281A]'>
             <div className='w-full flex justify-between items-center'>
                 <p className='text-[#E57435] font-nunito font-[600] text-[12px] leading-[20px]'>{moment(obj.start_date).format('ddd Do MMM ')}</p>
                 <div className='p-1 text-[12px]  font-[400] leading-[20px] text-[#E57435] bg-[#FCEEE7]'>${`${obj.price}`}</div>
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
         </div>
            )
         }
        )
    }
    else{
        showevents = ''
    }
    }
    else{
      showevents
    }
    
    useEffect(()=>{

     startTransition(async()=>{
      
        const response2 = await Getevents('Recommended')

        if (response2.status === 200){
            setevent(response2.data)
        }
        else if(response2.status === 401){
            toast({
                variant : 'destructive',
                title : 'Session Timed out',
                description :'Please Log in again'
            })
            signOut({callbackUrl : '/'})
        }
        else{
           toast({
            variant : 'destructive',
            title : 'Error getting events',
            description :'Please refresh the page again '
           })
        }
        
          
          
     })
       
    },[])
    return (
    <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grrid-cols-1 gap-[56px]'>
    {isloading ? loading_div : showevents}
    </div>
      )
}
  