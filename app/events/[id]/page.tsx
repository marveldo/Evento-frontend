import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import image from '@/public/Frame 1000003993.png'
import Image from 'next/image'
import calenderline from "@/public/majesticons_calendar-line.svg"
import location from "@/public/Frame 742.svg"
import { ArrowTopRightIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button";


export default function EventPageFunction ({params} : {params : { id : string}}){
    const param = params.id

    return (
    <div className='pt-28 max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 mb-40'>
        <Tabs defaultValue='Event Overview' className='w-full'>
            <TabsList>
                <TabsTrigger value='Event Overview'>Event Overview</TabsTrigger>
                <TabsTrigger value='Attendees'>Attendees</TabsTrigger>
            </TabsList>
            <TabsContent value="Event Overview" className='pt-8'>
                <div className='space-y-6'>
                    <div className='flex flex-wrap gap-x-7 gap-y-4'>
                        <Image src={image} alt='Event image' className='md:w-[45%] w-full max-h-[541px] min-h-[296px]'/>
                        <div className='flex flex-col gap-y-5 md:w-[50%] w-full'>
                            <h1 className='font-montserrat font-[600] md:text-[32px] text-[28px]'>Dey Play Event</h1>
                            <div className='flex gap-x-4'>
                                <Image src={calenderline} alt='Calender' height={56} width={56} />
                                <div className='flex flex-col justify-between'>
                                    <h1 className='font-nunito font-[500] text-[16px]'>Wednesday, November 15, 2023</h1>
                                    <p className='font-nunito font-[400] text-[12px]'>1:00 PM to 2:00 PM</p>
                                </div>
                            </div>
                            <div className='flex gap-x-4'>
                                <Image src={location} alt='Location' height={56} width={56} />
                                <div className='flex flex-col justify-between'>
                                    <h1 className='font-nunito font-[500] text-[16px] flex gap-x-2 items-center'>Location <ArrowTopRightIcon/></h1>
                                    <p className='font-nunito font-[400] text-[12px]'>Lagos, Nigeria</p>
                                </div>
                            </div>
                            <div className='grid grid-cols-1  md:grid-cols-3 gap-x-3 gap-y-3'>
                                <div className='flex flex-col gap-y-3 p-4 border-[#360789] border-2  shadow-[#360789] shadow-sm rounded-[8px]'>
                                    <h1 className='font-nunito font-[500] text-[16px]'>Event category</h1>
                                    <p className='font-nunito font-[400] text-[12px] '>Tech</p>
                                </div>
                                <div className='flex flex-col gap-y-3 p-4 border-[#E0580C] border-2  shadow-[#E0580C] shadow-sm rounded-[8px]'>
                                    <h1 className='font-nunito font-[500] text-[16px]'>Event capacity</h1>
                                    <p className='font-nunito font-[400] text-[12px]  '>50 persons</p>
                                </div>
                                <div className='flex flex-col gap-y-3 p-4 border-[#12B76A] border-2 shadow-[#12B76A] shadow-sm rounded-[8px]'>
                                    <h1 className='font-nunito font-[500] text-[16px]'>Price</h1>
                                    <p className='font-nunito font-[400] text-[12px]  '>0$</p>
                                </div>
                            </div>
                            <Button className='border-[#E0580C] border-2 bg-white text-[#E0580C] hover:bg-[#E0580C] h-[56px] hover:text-white flex gap-x-3'>
                                <Pencil1Icon className='underline-offset-4'/>
                                Edit Event
                            </Button>
                            
                            
                            <Button className='border-[#E0580C] border-2 w-full bg-white text-[#E0580C] hover:bg-[#E0580C] h-[56px] hover:text-white flex gap-x-3'>
                                <Pencil1Icon className='underline-offset-4'/>
                                View Attendees
                            </Button>
                            
                        
                           
                        </div>
                    </div>

                    <div className='flex gap-x-7 items-center'>
                        <img src='https://lh3.googleusercontent.com/a/ACg8ocLuzYscFNqGCy1vhxwptmQulH755IkTKkBSs_TzVh_ogwwy-A=s96-c' className='w-[40px] h-[40px] rounded-full' alt='Image'/>
                        <p className='font-nunito font-[500] text-[16px]'>Hosted by BigJohnny</p>
                    </div>

                    <div className='space-y-6'>
                        <h1 className='font-montserrat font-[600] md:text-[24px] text-[20px]'>About this event</h1>
                        <p className='md:text-[16px] text-[12px] font-nunito font-[400]'>Embark on an extraordinary journey into the realm of innovation and technology with our upcoming event! We invite you to immerse yourself in an electrifying atmosphere where groundbreaking ideas and cutting-edge solutions converge. This event is not just a gathering; it's a celebration of technological marvels and the visionaries shaping the future.

Throughout the day, you'll have the opportunity to engage with industry trailblazers through insightful keynote sessions, hands-on workshops, and interactive panel discussions. Get ready to broaden your horizons, exchange ideas with like-minded enthusiasts, and witness firsthand the transformative power of technology.

Whether you're a seasoned professional, an aspiring tech wizard, or simply curious about the latest trends, our event offers something for everyone. Join us as we explore the boundless possibilities of the tech landscape, fostering collaboration, and sparking inspiration that transcends conventional boundaries.</p>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="Attendees" className='pt-8'> Attendees</TabsContent>
        </Tabs>
    </div>
)
}