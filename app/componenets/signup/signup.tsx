"use client"
import React, {useTransition} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import signupschema from "./signupschema/singup"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupAction } from "@/app/actions/signup"
import google from "@/public/devicon_google.png"
import Image from "next/image"
import Link from "next/link"
import { signIn , useSession} from 'next-auth/react';
import { useRouter } from "next/navigation"; 
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "../Button/arrowicon"


export default function SignUp(){
    const router = useRouter()
    const {data : session, status} = useSession()
    const {toast} = useToast()
    const [isLoading,startTransition] = useTransition()
    const [loginloading , start2Transition] = useTransition()
   
    const form = useForm<z.infer<typeof signupschema>>({
        resolver : zodResolver(signupschema),
        defaultValues : {
            "fullname": "",
            "email": "",
            "password": ""
        }
    })
    const Handlegooglelogin = async() => {
      startTransition(async()=>{
        try{
          await signIn('google')
          
        }catch(error){
          toast({
            variant : "destructive",
            title : "Error",
            description : `${error}`,
            className : "text-white font-nunito"
          })
        }
      })
      
    }

    const SubmitForm = (values : z.infer<typeof signupschema>) => {
        start2Transition(async()=>{
         
        const query = await SignupAction(values)
            if(query?.status_code === 201){
              toast({
                title : "Registeration Successful",
                description : "Log in to continue",
                className : "bg-[#E0580C] text-[white] font-nunito"
              })
             router.push('/login')
            }
            else if(query?.status_code === 422){ 
              toast({
                variant : "destructive",
                title : "Email Already Exists",
                description : "Email already exists Log into your email",
                className : "text-white font-nunito"
              })
            }
            else{
              toast({
                variant : "destructive",
                title : "Ooops",
                description : "Something went wrong",
                className : "text-white font-nunito"
              })
            }

        
          
        })
    }

    return(
        <div className="flex justify-center items-center pt-32 font-nunito">
        <div className="p-20 max-[500px]:p-6 max-[350px]:p-2 space-y-6 shadow-[#0000000A] shadow-lg font-nunito">
            <div className="flex flex-col gap-y-2 text-center mb-3">
              <h1 className="font-montserrat font-[600] text-[32px]">Welcome to Evento</h1> 
              <p className="font-nunito text-[12px]">Sign up to Continue using Evento</p>
            </div>
        <Button onClick={()=>{Handlegooglelogin()}} disabled={isLoading || loginloading}   className="bg-[white] gap-x-2 flex text-black hover:text-white  hover:bg-black w-full h-[50px] border-[1px] border-black">
           {isLoading && <Spinner/>}
           <Image src={google} alt="google logo"/>
           <p>Signup with Google</p>
        </Button>
     <div className="h-[1px] bg-[#767676] w-full flex justify-center items-center">
       <p className="font-work px-4 bg-white text-[11px] shadow-none  ">OR</p>
     </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(SubmitForm)} className="flex flex-col gap-y-6 max-w-[452px] min-w-[326px] font-nunito">
      <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-nunito italic">Full name</FormLabel>
              <FormControl>
                <Input placeholder="Input your full name" disabled={isLoading || loginloading}  className={"h-[50px] font-nunito italic"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
        
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-nunito italic">Email</FormLabel>
              <FormControl>
                <Input placeholder="Input your Email" disabled={isLoading || loginloading}  className={"h-[50px] font-nunito italic"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
        
          )}
        />
        <div className="space-y-3 font-nunito">
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-nunito italic">Password</FormLabel>
              <FormControl>
                <Input placeholder="Input your Password" {...field} disabled={isLoading || loginloading}  className="h-[50px] font-nunito italic" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button type="submit" disabled={isLoading || loginloading}  className="bg-[#E0580C] text-white hover:bg-white hover:text-[#E0580C] hover:border-[1px] flex items-center gap-x-2 hover:border-[#E0580C]  w-full h-[50px]">
          {loginloading && <Spinner/>}
          Submit
          </Button>
        <Link href='/login' className="text-center font-nunito font-[400] italic text-[14px]"><p>Already have an account?<span className="text-[#E0580C]">Log in</span></p></Link>
      </form>
    </Form>
        </div>

    </div>
    )
}