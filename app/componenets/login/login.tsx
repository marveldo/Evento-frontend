"use client"
import React, { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import formSchema from "./loginschema/login"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import google from "@/public/devicon_google.png"
import Image from "next/image"
import Link from "next/link"
import { signIn } from 'next-auth/react'; 
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "../Button/arrowicon"





export default function Login () {
  const router = useRouter()
  const {toast} = useToast()
  const [isLoading,startTransition] = useTransition()
  const [loginloading , start2Transition] = useTransition()
 
  const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            email : "",
            password : ""
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
          description : `${error}`
        })
      }
    })
    
  }
  
  const SubmitForm = (values : z.infer<typeof formSchema>) => {
    start2Transition(async()=>{
      const {email , password} = values
      try{
        const response = await signIn(
          "credentials",
          {
            email,
            password,
            redirect: false,
          },
          { callbackUrl: "/home" },
        );
        if (response?.status === 200){
          toast({
            title : "Login Successful ❤️",
            description :"Have fun booking your tickets",
            className : "bg-[#E0580C] text-white font-nunito"
          })
          
          router.push('/home')

        }
        else if (response?.status === 401){
          toast({
            variant : "destructive",
            title : "Invalid Credentials",
            description :"Invalid Username or password",
            className : "text-white font-nunito"
          })
        }
        else {
          toast({
            variant : "destructive",
            title : "something went wrong",
            description :"Check back later",
            className : "text-white font-nunito"
          })
        }
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

  return (
    <div className="flex justify-center items-center pt-32 font-nunito">
      
        <div className="p-20 max-[500px]:p-6 max-[350px]:p-2 space-y-6 shadow-[#0000000A] shadow-lg font-nunito">
            <div className="flex flex-col gap-y-2 text-center mb-3">
              <h1 className="font-montserrat font-[600] text-[32px]">Welcome to Evento</h1> 
              <p className="font-nunito text-[12px]">Login to Continue using Evento</p>
            </div>
        <Button onClick={()=>{Handlegooglelogin()}} disabled={isLoading || loginloading}  className="bg-[white] gap-x-2 flex text-black hover:text-white  hover:bg-black w-full h-[50px] border-[1px] border-black">
          {isLoading && <Spinner/>}
           <Image src={google} alt="google logo"/>
           <p>Login with Google</p>
        </Button>
     <div className="h-[1px] bg-[#767676] w-full flex justify-center items-center">
       <p className="font-work px-4 bg-white text-[11px] shadow-none  ">OR</p>
     </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(SubmitForm)} className="flex flex-col gap-y-6 max-w-[452px] min-w-[326px] font-nunito">
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
                <Input placeholder="Input your Password" {...field} disabled={isLoading || loginloading} className="h-[50px] font-nunito italic" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex font-nunito justify-between items-center">
         <div className=" flex items-center space-x-2">
          <Checkbox id="Remember" disabled={isLoading || loginloading} className="data-[state=checked]:bg-[#E0580C] data-[state=checked]:border-none"/>
          <label htmlFor="Remember" className="font-nunito italic text-[13px]">Remember Me?</label>
        </div>
          <p className="font-nunito text-[13px] text-[#E0580C] italic">Forgot Password ?</p>
        </div>
        </div>
        <Button type="submit" disabled={isLoading || loginloading} className="bg-[#E0580C] flex gap-x-2 text-white hover:bg-white hover:text-[#E0580C] hover:border-[1px] hover:border-[#E0580C] items-center  w-full h-[50px]">
        {loginloading && <Spinner/>}
          Submit
          </Button>
        <Link href='/signup' className="text-center font-nunito font-[400] italic text-[14px]"><p>Don’t have an account?<span className="text-[#E0580C]">Sign Up</span></p></Link>
      </form>
    </Form>
        </div>

    </div>
  )
}