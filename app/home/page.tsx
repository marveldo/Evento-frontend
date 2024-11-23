"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ArrowImg from "@/public/Group 39866.png"
import Image from 'next/image'
import { MusicIcon } from '../componenets/Button/arrowicon'
import { PopularEvents,RecommendedEvents } from '../componenets/home/Events'
import { ButtonC } from '../componenets/Button/button'
import {useSearchParams } from 'next/navigation'
import Link from 'next/link'
export default  function Page (){
    const params = useSearchParams();
    const tag = params.get('tag')
    

    const categories = ['Popular','Tech','Health & Wellness','Buisness', 'Romance' , 'Travel & Adventure','Science & Nature','Fashion & Beauty']
    
    
    return(
        <div className='w-full py-[4.5rem]'>
            <div className='bg-[#FCEEE7] w-full text-center flex flex-col gap-y-6 justify-center py-16 md:px-14 lg:px-28 px-8 relative'>
                <h1 className='md:text-[55px] text-[28px] font-[600] font-montserrat'>Finding Events Have <span className='text-[#E0580C]'>Never</span> been <span className='text-[#E0580C]'>Easier</span></h1>
                <div className='md:px-28 px-4 md:text-[16px] text-[13px]  font-nunito font-[400] leading-[28px]'><p>Discover events that match your interests effortlessly. From live concerts to community gatherings, explore a variety of experiences tailored just for you. Stay updated, connect with others, and make every moment count.</p></div>
                <div className="flex w-full justify-center mt-7 rounded-[8px]">
                    <div className='flex bg-white space-x-0 rounded-[8px]'>
                    <Input type="email" placeholder="Email" className='max-w-[372px] border-none' />
                    <Button type="submit" className='bg-[#E0580C]'>Subscribe</Button>
                    </div>
                  
                  </div>
                  <div className='md:absolute md:block hidden  left-0'>
                    <Image src={ArrowImg} alt='Arrow image'/>
                  </div>
            </div>
            <div className='max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4   max-[1200px]:pt-10 min-[1300px]:pt-24 max-[1290px]:pt-14 max-[870px]:pt-4 flex flex-col gap-y-16'>
              <h1 className='font-montserrat text-[32px] hidden md:block font-[700] leading-[40px]'>Event Categories</h1>
              <div className=' flex-nowrap  md:flex-wrap overflow-x-scroll md:overflow-x-hidden flex gap-x-5 gap-y-5 md:justify-center'>
                {categories.map((obj,index)=>{
                    const encodedtag = encodeURIComponent(obj)
                    return(<Link href={`/home?tag=${encodedtag}`} key={index} className={`rounded-[100px] px-2 py-2  items-center gap-x-1 border-[#F2BB9B] border-[1px] flex ${ tag === obj ? 'bg-[#E0580C] text-white': ''} ${ obj  === 'Popular' && !tag ? 'bg-[#E0580C] text-white': ''}`}>
                        <MusicIcon size={5}/>
                        <p className='md:text-[16px] text-[10px] font-nunito font-[700]'>{obj}</p>
                    </Link>)
                })}
              </div>
            </div>
            <div className='max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 max-[1200px]:pt-10 min-[1300px]:pt-24 max-[1290px]:pt-14 max-[870px]:pt-4 flex flex-col gap-y-16'>
                <div className='gap-y-4'>
                    <p className='text-[#959595] font-nunito font-[600] text-[14px] leading-[24px]'>Discover</p>
                    <h1 className='text-[#1E1E1E] font-montserrat font-[700] md:text-[32px] text-[24px] leading-[40px]'>{tag ? tag : 'Popular'} Events</h1>
                </div>
                <PopularEvents tag={tag ? tag : null}/>
                <div className='w-full flex justify-center'>
                   <ButtonC>View More</ButtonC>
                </div>
            </div>
 
            <div className='max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 max-[1200px]:pt-10 min-[1300px]:pt-24 max-[1290px]:pt-14 max-[870px]:pt-4 flex flex-col gap-y-16'>
                <div className='gap-y-4'>
                    <p className='text-[#959595] font-nunito font-[600] text-[14px] leading-[24px]'>Discover</p>
                    <h1 className='text-[#1E1E1E] font-montserrat font-[700] md:text-[32px] text-[24px] leading-[40px]'>Recommended for You</h1>
                </div>
                <RecommendedEvents/>
                <div className='w-full flex justify-center'>
                   <ButtonC>View More</ButtonC>
                </div>
            </div>

          
           
        </div>
    )
}