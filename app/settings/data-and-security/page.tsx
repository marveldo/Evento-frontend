"use client";
import React from "react";
import { Passwordschema } from "../schemas/data-security";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner} from "@/app/componenets/Button/arrowicon";
import { Updatecurrentuser } from "@/app/actions/getcurrentuser";
import FormData from "form-data";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";
import Image from "next/image";
import tablet from "@/public/Tablet.webp"
import laptop from "@/public/laptop.webp"
import phone from "@/public/Phone.webp"
import { Getdevices , Logoutdevice } from "@/app/actions/getdevices";
import { useSession } from "next-auth/react";

interface Device {
  device_name : string
  device_os : string
  device_type : string
  id :  string
}



export default function Dataprivacy() {
  const passwordform = useForm<z.infer<typeof Passwordschema>>({
    resolver: zodResolver(Passwordschema),
    defaultValues: {
      new_password: undefined,
      confirm_new_password: undefined,
    },
  })
  const {data : session} = useSession()

  let devicesdiv : string | React.JSX.Element = ''
  const [devices , setdevices] = React.useState<Device[] | null>(null)
  const [deviceloading , setdeviceloading] = React.useState(true)
 const { toast } = useToast()

  const [password_loading , start_password_loading] = React.useTransition()
  const [logoutdeviceloading , startlogoutdevice] = React.useTransition()

  const Logout = (id : string) => {
    startlogoutdevice(async()=> {
      const response = await Logoutdevice(id)
      if (response.status_code === 200 ){
        setdevices((prev)=>{
          if (!prev) return null
          return prev.filter((item) => item.id === id)
        })
        toast({
          title : 'Device Logged Out',
          description : 'Device Successfully removed',
          className : 'bg-[#E0580C] text-white font-nunito'
      })

      }
     else if(response.status_code === 401){
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
          title : "Couldn't Remove device",
          description : 'Something went wrong try again later'
        })
       }
  })
  }

  if(devices){
    if(devices.length > 1){
      devicesdiv = <div className="flex flex-col gap-y-12">
       { devices.filter((obj)=> obj.id !== session?.user?.device_id ).map((obj , index)=> {
        let url = phone
        switch(obj.device_type){
          case 'PC':
            url = laptop
          case 'Tablet':
            url = tablet
          case 'Mobile' :
            url = phone
          }
        return(
        <div key={index} className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
          <Image src={laptop} height={80} width={60} alt="laptop pic"/>
          <p className="font-nunito font-[400] md:text-[16px] text-[12px]">{obj.device_os}-{obj.device_type}</p>
          </div>
           
           <Button 
           className="bg-[#E0580C] hover:bg-white text-white hover:text-[#E0580C] flex gap-x-2 hover:border-[1px] md:text-[14px] text-[12px] hover:border-[#E0580C]"
           onClick={()=>{Logout(obj.id)}}
          disabled={logoutdeviceloading || password_loading}
           >
           {logoutdeviceloading && <Spinner/>}
            Logout device
            </Button>
         </div>
        )
        }
        )}
      </div> 
    }
    else {
      devicesdiv = <div className="w-full justify-center text-center mt-6">
        No Other devices Logged in
      </div>
    }
   
  }


  const Submitform = (values: z.infer<typeof Passwordschema>) => {
    const data = new FormData()

    data.append('password', values.new_password)

    start_password_loading(async()=> {
        const response = await Updatecurrentuser(data)
        if (response.status === 200){
            toast({
                title : 'Updated Password Successfully',
                description : 'Password have been updated',
                className : 'bg-[#E0580C] text-white font-nunito'
             })
        }
        else if (response.status === 401){
            toast({
                variant : 'destructive',
                title : 'Session Timed out',
                description :'Please Log in again'
            })
            signOut({callbackUrl : '/'})
         }
        else if (response.status === 422){
            toast({
                variant : 'destructive',
                title : 'Password Incorrect',
                description :'Old password not correct'
            })
         }
        else{
            toast({
                variant : "destructive",
                title : "Update Failed",
                description :"Something went wrong",
                className : "text-white font-nunito"
              }) 
         }


         passwordform.reset({
          new_password: "",
          confirm_new_password: "",
        })

    })
  };


  
  React.useEffect(()=>{
     
    const load_data = async() => {
       const response = await Getdevices()
       if(response.status_code === 200){
          setdevices(response.data)
       }
       else if (response.status_code === 401){
        toast({
            variant : 'destructive',
            title : 'Session Timed out',
            description :'Please Log in again'
        })
        signOut({callbackUrl : '/'})
     }
     else{
      toast({
          variant : "destructive",
          title : "Error gettinfg Devices",
          description :"Something went wrong",
          className : "text-white font-nunito"
        }) 
   }

   setdeviceloading(false)
}

    load_data()

  }, [])

  return (
    <div className="w-full max-w-[793px] md:p-10 md:border-[#EBEBEB] md:border-[1px] px-3 space-y-12 md:shadow-[#1018280F] md:shadow-sm rounded-[16px]">
      <h1 className="font-montserrat font-[600] md:text-[32px] text-[24px]">
        Data & Security
      </h1>

      <div className="space-y-3">
        <h2 className="font-nunito font-[500] md:text-[20px] text-[#1E1E1E]">
          Password
        </h2>
        <p className="text-[#767676] font-nunito font-[400] md:text-[14px] ">
          Set a password or reset it if forgotten. You will receive a code via
          email to confirm the new password
        </p>
      </div>

      <div>
        <Form {...passwordform}>
          <form
            onSubmit={passwordform.handleSubmit(Submitform)}
            className="flex flex-col gap-y-7"
          >
              <FormField
              control={passwordform.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#303030] font-nunito font-[600] text-[14px]">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="h-[56px] border-[#EBEBEB] border-[1px]"
                      placeholder="New password"
                      {...field}
                      disabled={password_loading || logoutdeviceloading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordform.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#303030] font-nunito font-[600] text-[14px]">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="h-[56px] border-[#EBEBEB] border-[1px]"
                      placeholder="Confirm New password"
                      {...field}
                      disabled={password_loading || logoutdeviceloading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
                    <Button className=' flex gap-x-3 bg-[#E0580C]  text-white rounded-[8px] hover:bg-white py-6 hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px] ' disabled={password_loading || logoutdeviceloading}>
                        {password_loading && <Spinner/>}
                        Change Password
                    </Button>
                </div>
          </form>
        </Form>
      </div>
    
      <div className='space-y-3'>
                <h2 className='font-nunito font-[500] md:text-[20px] text-[#1E1E1E]'>Manage Devices</h2>
                <p className='text-[#767676] font-nunito font-[400] md:text-[14px] '>This displays a list of all devices currently signed in to your Evento Space. You can manage and control access by reviewing and logging out from any unfamiliar or unauthorized devices.</p>

      </div>

      {deviceloading ?<div className="w-full justify-center flex"> <Spinner/> </div> : devicesdiv}





    </div>
  );
}
