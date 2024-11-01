"use client"
import {ButtonC , ButtonN} from "../Button/button"
import React from "react"
import Link from "next/link"
import { signOut , useSession } from "next-auth/react"
import { PlusIcon,BellIcon,TextAlignJustifyIcon,HomeIcon } from "@radix-ui/react-icons"
import { SearchIcon } from "../Button/arrowicon"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
    SheetClose,
    SheetHeader,
    SheetTrigger
  } from "@/components/ui/sheet"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"




export default function Navbar () {
  const { data: session, status } = useSession();
  
  
  

  return (
        <div className="max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 bg-white z-30  py-4  flex justify-between items-center fixed top-0 w-full border-b-[1px] border-[#EBEBEB]">
            <h1 className="font-[700] font-chelseamarket text-[24px] text-[#E0580C]">Evento</h1>
            <div className={`flex gap-x-4 items-center ${status === 'unauthenticated' ? '' : 'hidden'}`}>
            <Link href='/login' className={`${status === 'authenticated' ? 'hidden' : ''}`}><ButtonC >Sign In</ButtonC></Link>
            <div onClick={()=>{signOut({callbackUrl : '/'})}} className={`${status === 'authenticated' ? '' : 'hidden'} cursor-pointer`}><ButtonC>Sign Out</ButtonC></div>
                <ButtonN  >Create event</ButtonN>
            </div> 
            <div className={`${status === 'authenticated' ? '' : 'hidden'} flex items-center gap-x-8 font-nunito font-[500] leading-[24px] text-[14px] text-black max-[550px]:hidden`}>
                <Link href="/home">Explore</Link>
                <Link href='/dashboard' >Manage Events</Link>
                <Link href='/create-event' className="flex gap-x-2 items-center"><p>Create Event</p> <PlusIcon className="size-4"/></Link>
            </div>

            <div className={`${status === 'authenticated' ? '' : 'hidden'} flex items-center gap-x-4 font-chelseamarket font-[500] leading-[24px] text-[14px] text-black max-[550px]:hidden `}>
                <SearchIcon size={5}/>
                <BellIcon className="size-5"/>
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar>
                       <AvatarImage src={session?.user?.image} alt="@user" />
                       <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="w-full">
                        <h1 className="font-[700] font-nunito text-[24px] p-3 border-b-black border-b-[1px] text-[#E0580C] text-center">Welcome {session?.user?.name}</h1>
                        <div className="flex flex-col justify-center gap-y-3 w-full pt-3 text-center">
                            <Link href='/' className="flex gap-x-3 items-center justify-center"><HomeIcon className="size-5"/> Home</Link>
                            <div onClick={()=>{signOut({callbackUrl : '/'})}}>
                            <ButtonC>
                            <div className={`${status === 'authenticated' ? '' : 'hidden'} cursor-pointer`}><p>Log out</p></div>
                            </ButtonC>
                            </div>
                           
                          
                        </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
            </div>
            
            <Sheet>
                <SheetTrigger asChild className={`min-[550px]:hidden ${status === 'authenticated' ? '' : 'hidden'}`}>
                    <TextAlignJustifyIcon className="size-5"/>
                </SheetTrigger>
                <div className="hidden">
                <SheetTitle>Navbar</SheetTitle>
                     <SheetDescription>
                        This is a Navbar component
                     </SheetDescription>
                </div>
                <SheetContent side="right">
                    <SheetHeader className="flex justify-between mb-28">
                    <Avatar>
                       <AvatarImage src={session?.user?.image} alt="@user" />
                       <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className="font-[700] font-chelseamarket text-[24px] text-[#E0580C]">Evento</h1>

                    </SheetHeader>
                    <div className="flex flex-col gap-y-10 items-center">
                    <SheetClose asChild><Link href="/">Home</Link></SheetClose>
                    <SheetClose asChild><Link href="/home">Explore</Link></SheetClose>
                    <SheetClose> <div onClick={()=>{signOut({callbackUrl : '/'})}} className={`${status === 'authenticated' ? '' : 'hidden'} cursor-pointer`}>
                        <p>Log out</p>
                        </div>
                        </SheetClose>
                    <SheetClose asChild>
                    <Link href='/create-event' className="flex gap-x-2 items-center"><p>Create Event</p> <PlusIcon className="size-4"/></Link>
                    </SheetClose>
                    <SheetClose asChild>
                    <Link href='/dashboard' className="flex gap-x-2 items-center"><p>Manage Event</p></Link>
                    </SheetClose>
                   

                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}





