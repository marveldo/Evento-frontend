"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { Avatar , AvatarImage , AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Profilepicschema } from '../schemas/profile'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

export default function Accountpage(){
    const {data : session , status} = useSession()
   const profilepicform = useForm<z.infer<typeof Profilepicschema>>({
      resolver : zodResolver(Profilepicschema),
      defaultValues : {
         profile_pic :  undefined,
         bio : undefined,
         full_name : undefined
      }
   })
    return (
        <div className='w-full max-w-[793px] md:p-10 border-[#EBEBEB] border-[1px] space-y-7 shadow-[#1018280F] shadow-sm rounded-[16px]'>
            <h1 className='font-montserrat font-[600] md:text-[32px]'>
              Account
            </h1>

            <div className='space-y-3'>
                <h2 className='font-nunito font-[500] md:text-[20px] text-[#1E1E1E]'>Edit Profile</h2>
                <p className='text-[#767676] font-nunito font-[400] md:text-[14px] '>Customize your profile to your liking </p>

            </div>
         
         <div className='flex flex-row gap-x-7 items-center'>
            <Avatar>
                <AvatarImage src={session?.user?.image} alt='profile picture' />
                <AvatarFallback>US</AvatarFallback>
            </Avatar>
            
            <Button className='bg-[#E0580C] text-white p-2 rounded-[8px] hover:bg-white hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px]'>Upload Picture</Button>
            <Button className='hover:bg-[#E0580C] hover:text-white p-2 rounded-[8px] bg-white text-[#E0580C] border-[#E0580C] border-[1px]'>Remove</Button>
        </div>

        
            
        </div>
    )
}