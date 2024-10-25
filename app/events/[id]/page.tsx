"use client"
import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import Image from 'next/image'
import calenderline from "@/public/majesticons_calendar-line.svg"
import location from "@/public/Frame 742.svg"
import { 
    ArrowTopRightIcon, 
    Pencil1Icon, 
    ChevronRightIcon, 
    ChevronLeftIcon 
  } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import Trash from "@/public/trash.svg"
import { Skeleton } from '@/components/ui/skeleton'
import { Getevent, Geteventattendees } from '@/app/actions/getevents'
import { Event } from '@/app/componenets/home/Events'
import moment from 'moment'
import { useToast } from '@/hooks/use-toast'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'


interface Category {
    id: string ,
    tag_name : string
}
interface SingleEvent extends Event {
    description : string,
    time : string,
    date : string,
    capacity : number,
    category : Category[]
    hosted_by : {
        id : string,
        full_name : string,
        email : string,
        profile_img : string
    },
    event_link : string ,
}

interface Userinfo {
    profile_img : string,
    email : string,
    id : string
}

interface Attendees {
    total? : number,
    count? : number,
    data? : Userinfo[] 
}


export default function EventPageFunction ({params} : {params : { id : string}}){
    const param = params.id
    const [loading , setloading] = React.useState(true)
    const [loadingattend , setloadingattend] = React.useState(true)
    const [attendeesdata , setattendeesdata] = React.useState<Attendees|null>(null)
    const [eventdata , seteventdata] = React.useState<SingleEvent | null>(null)
    const {toast} = useToast()
    const { data: session, status } = useSession();
    
   
   const loadingdiv = <div className='space-y-6'>
    <div className='flex flex-wrap gap-x-7 gap-y-4'>
        <Skeleton className='md:w-[45%] w-full max-h-[541px] min-h-[296px]'/>
        <div className='flex flex-col gap-y-5 md:w-[50%] w-full'>
            <Skeleton className='w-full h-[40px] max-w-[500px]'/>
            <div className='flex gap-x-4'>
                <Image src={calenderline} alt='Calender' height={56} width={56} />
                <div className='flex flex-col justify-between'>
                    <Skeleton className='h-[20px] w-[150px]'/>
                    <Skeleton className='h-[20px] w-[200px]'/>
                </div>
            </div>
            <div className='flex gap-x-4'>
                <Image src={location} alt='Location' height={56} width={56} />
                <div className='flex flex-col justify-between'>
                <Skeleton className='h-[20px] w-[150px]'/>
                <Skeleton className='h-[20px] w-[200px]'/>
                </div>
            </div>
            <div className='grid grid-cols-1  md:grid-cols-3 gap-x-3 gap-y-3'>
                <Skeleton className='flex flex-col gap-y-3 p-4 h-[89px]  rounded-[8px]'/>
                    
                <Skeleton className='flex flex-col gap-y-3 p-4 h-[89px]   rounded-[8px]'/>
                <Skeleton className='flex flex-col gap-y-3 p-4 h-[89px]  rounded-[8px]'/>
            </div>
            <Skeleton className='h-[56px]'/>
            
            
            <Skeleton className='h-[56px]'/>
            
        
           
        </div>
    </div>

    <div className='flex gap-x-7 items-center'>
       <Skeleton className="h-12 w-12 rounded-full" />
       <Skeleton className='h-[20px] w-[200px]'/>
    </div>

    <div className='space-y-6'>
        <h1 className='font-montserrat font-[600] md:text-[24px] text-[20px]'>About this event</h1>
        <Skeleton className='w-full h-[20px]'/>
        <Skeleton className='w-full h-[20px]'/>
        <Skeleton className='w-full h-[20px]'/>
        <Skeleton className='w-full h-[20px]'/>
    </div>
</div>

   React.useEffect(()=>{
      const loadevent = async() => {
        try{
         const event = await Getevent(param)

        
        if(event.status === 200){
            seteventdata(event.data)
            
        }
        else if (event.status === 401){
            toast({
                variant : 'destructive',
                title : "Session Expired",
                description : 'Please Login again'
              })
              signOut({callbackUrl : '/'})
        }
        else {
            toast({
                variant : 'destructive',
                title : "Something Went wrong",
                description : 'Please Try again'
            })
        }
        }
        finally{
            setloading(false)
        }
      }

      loadevent()
   }, [])

   React.useEffect(()=> {
    const Loadattendees = async() => {
        try{
           const attendees = await Geteventattendees(param , 1)

           if (attendees.status === 200){
             setattendeesdata(attendees)
           }
           else if (attendees.status === 401){
            toast({
                variant : 'destructive',
                title : "Session Expired",
                description : 'Please Login again'
              })
              signOut({callbackUrl : '/'})
        }
        else {
            toast({
                variant : 'destructive',
                title : "Something Went wrong",
                description : 'Please Try again'
            })
        }
        }finally{
             setloadingattend(false)
        }
    }
    Loadattendees()
   }, [])

    return (
    <div className='pt-28 max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 mb-40'>
        <Tabs defaultValue='Event Overview' className='w-full'>
            <TabsList>
                <TabsTrigger value='Event Overview'>Event Overview</TabsTrigger>
                <TabsTrigger value='Attendees'>Attendees</TabsTrigger>
            </TabsList>
            <TabsContent value="Event Overview" className='pt-8'>
                {loading? loadingdiv : <div className='space-y-6'>
                    <div className='flex flex-wrap gap-x-7 gap-y-4'>
                        <img src={eventdata?.event_image} alt='Event image' className='md:w-[45%] w-full max-h-[541px] min-h-[296px]'/>
                        <div className='flex flex-col gap-y-5 md:w-[50%] w-full'>
                            <h1 className='font-montserrat font-[600] md:text-[32px] text-[28px]'>{eventdata ? eventdata.event_name : '---'}</h1>
                            <div className='flex gap-x-4'>
                                <Image src={calenderline} alt='Calender' height={56} width={56} />
                                <div className='flex flex-col justify-between'>
                                    <h1 className='font-nunito font-[500] text-[16px]'>{eventdata ? moment(eventdata.start_date).format('MMMM , Do YYYY') : '---'}</h1>
                                    <p className='font-nunito font-[400] text-[12px]'>{eventdata ? `${moment(eventdata.start_time, "HH:mm:ss").format("h:mm A")} to ${moment(eventdata.time, "HH:mm:ss").format("h:mm A")}` :"--- to ---"}</p>
                                </div>
                            </div>
                            <div className='flex gap-x-4'>
                                <Image src={location} alt='Location' height={56} width={56} />
                                <div className='flex flex-col justify-between'>
                                    <h1 className='font-nunito font-[500] text-[16px] flex gap-x-2 items-center'>Location <ArrowTopRightIcon/></h1>
                                    <p className='font-nunito font-[400] text-[12px]'>{eventdata ? eventdata.location : '---'}</p>
                                </div>
                            </div>
                            <div className='grid grid-cols-1  md:grid-cols-3 gap-x-3 gap-y-3'>
                                <div className='flex flex-col gap-y-3 p-4 border-[#360789] border-2  shadow-[#360789] shadow-sm rounded-[8px]'>
                                    <h1 className='font-nunito font-[500] text-[16px]'>Event category</h1>
                                    <p className='font-nunito font-[400] text-[12px] '>{eventdata ? eventdata.category.map((obj, index)=> {
                                        return <span key={index}>
                                        {obj.tag_name}{index !== eventdata.category.length - 1 ? ', ' : ''}
                                      </span>
                                    }) : '----'}</p>
                                </div>
                                <div className='flex flex-col gap-y-3 p-4 border-[#E0580C] border-2  shadow-[#E0580C] shadow-sm rounded-[8px]'>
                                    <h1 className='font-nunito font-[500] text-[16px]'>Event capacity</h1>
                                    <p className='font-nunito font-[400] text-[12px]  '>{eventdata ? eventdata.capacity : '----'} persons</p>
                                </div>
                                <div className='flex flex-col gap-y-3 p-4 border-[#12B76A] border-2 shadow-[#12B76A] shadow-sm rounded-[8px]'>
                                    <h1 className='font-nunito font-[500] text-[16px]'>Price</h1>
                                    <p className='font-nunito font-[400] text-[12px]  '>{eventdata ? eventdata.price : '----'}$</p>
                                </div>
                            </div>
                         {
                         session?.user?.userId === eventdata?.hosted_by.id ?  <Button className='border-[#E0580C] border-2 bg-white text-[#E0580C] hover:bg-[#E0580C] h-[56px] hover:text-white flex gap-x-3' disabled={eventdata ? false : true}>
                                <Pencil1Icon className='underline-offset-4'/>
                                Edit Event
                            </Button> : <div className='w-full p-3 border-[#C0C0C0] border-[0.5px] font-[400] rounded-[12px] font-nunito text-[16px] space-y-4'>
                                  <h1>Hello! To join the event, please register below.</h1>
                                  <Button className='w-full bg-[#E0580C] text-white hover:bg-white hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px] text-[12px] h-[56px]' >
                                     Click to Register
                                  </Button>
                                </div>
                                }
                            
                            
                            <Button className='border-[#E0580C] border-2 w-full bg-white text-[#E0580C] hover:bg-[#E0580C] h-[56px] hover:text-white flex gap-x-3'>
                                <Pencil1Icon className='underline-offset-4'/>
                                View Attendees
                            </Button>
                            
                        
                           
                        </div>
                    </div>

                    <div className='flex gap-x-7 items-center'>
                        <Avatar>
                           <AvatarImage src={eventdata ? eventdata.hosted_by.profile_img : "https://github.com/shadcn.png"} alt="@shadcn" />
                           <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                        <p className='font-nunito font-[500] text-[16px]'>Hosted by {eventdata ? eventdata.hosted_by.full_name : '---'}</p>
                    </div>

                    <div className='space-y-6'>
                        <h1 className='font-montserrat font-[600] md:text-[24px] text-[20px]'>About this event</h1>
                        <p className='md:text-[16px] text-[12px] font-nunito font-[400]'>
                             {eventdata ? eventdata.description : '---'}
                        </p>
                    </div>
                </div>}
            </TabsContent>
            <TabsContent value="Attendees" className='pt-8'>
                <div className='md:px-6 px-2 space-y-5'>
                    <h1 className='text-[28px] font-montserrat font-[700]'>All attendees data</h1>
                    <p className='text-[16px] font-nunito font-[600]'>5 Attendees</p>
                    <div className='md:border-[1px]  rounded-[16px] overflow-hidden md:border-[#B1B1B1] w-full md:h-[577px] h-[700px] flex flex-col '>
                    
                    <div className='w-full font-montserrat font-[600] text-[20px] hidden  text-center bg-[#F5F5F5] md:grid md:grid-cols-4 py-4'>
                     <div>Name</div>
                     <div>Contact</div>
                     <div>Address </div>
                     <div>Action</div>
                    </div>
                    
                    
                    <>
                    <div className='w-full md:grid md:grid-cols-4 hidden  text-center font-nunito font-[600] text-[14px] py-5 border-b-[1px] border-[#B1B1B1]'>
                        <div className='flex justify-center items-center gap-x-3 '>
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                          <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                        <p className='text-[20px]'>Albert  Ronald</p>
                        </div>
                        <div className='flex items-center justify-center'>albertflores@gmail.com</div>
                        <div className='flex items-center justify-center'>Lagos, Nigeria</div>
                        <div className='flex justify-center items-center'>
                            <Image src={Trash} alt='Trash'/>
                        </div>
                    </div>
                    <div className='max-[720px]:flex justify-between px-3 py-4 border-b-[1px] border-[#B1B1B1] hidden'>
                        <div className='flex items-center gap-x-3 '>
                           <Avatar>
                             <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                             <AvatarFallback>US</AvatarFallback>
                           </Avatar>
                          <div className='flex flex-col gap-y-2'>
                               <p className='text-[20px]'>Albert  Ronald</p>
                               <div className='flex items-center'>albertflores@gmail.com</div>
                               <div className='flex items-center'>Lagos, Nigeria</div>
                          </div>
                        </div>
                        <div className='flex justify-center items-center'>
                            <Image src={Trash} alt='Trash'/>
                        </div>
                    </div>
                    
                    </>
                   
                    

                    <div className='w-full flex justify-between items-center md:py-12 py-3 px-5 md:px-20 mt-auto'>
                        <div className='md:text-[15px] text-[12px]'>
                        <h2>
                        Showing 5 of 5 entries
                        </h2>
                        </div>
                        <div className='flex flex-row gap-x-2 text-[16px]'>
                            <div className='p-2 bg-[#FCEEE7] rounded-[4px] flex items-center'>
                                <ChevronLeftIcon className='size-5'/>
                            </div>
                            <div className='p-2 rounded-[4px] border-[1px] border-[#B1B1B1]  '>1</div>
                            <div className='p-2 rounded-[4px] border-[1px] border-[#B1B1B1] '>2</div>
                            <div className='p-2 rounded-[4px] border-[1px] border-[#B1B1B1] '>3</div>
                            <div className='p-2 rounded-[4px] border-[1px] border-[#B1B1B1] '>4</div>
                            
                            <div className='p-2 bg-[#FCEEE7] rounded-[4px] flex items-center'>
                                <ChevronRightIcon className='size-5'/>
                            </div>
                        </div>
                       
                       </div>
                    </div>

                </div>
            </TabsContent>
        </Tabs>
    </div>
)
}