"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { Avatar , AvatarImage , AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Profilepicschema , SocialSchema} from '../schemas/profile'
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
import FormData from 'form-data'
import { GetCurrentuser, Updatecurrentuser } from '@/app/actions/getcurrentuser'
import { useToast } from '@/hooks/use-toast'
import { CustomUser } from '@/lib/authOptions'
import { signOut } from 'next-auth/react'
import { Spinner } from '@/app/componenets/Button/arrowicon'
import { profile } from 'console'


interface UserDetails {
    id : string,
    full_name : string,
    email : string,
    profile_img : string,
    bio : string | null,
    website : string | null,
    instagram : string | null,
    twitter : string | null,
    facebook : string | null
}


export default function Accountpage(){
    const {data : session , status , update} = useSession()
    const [ picurl , setpicurl] = React.useState<string | null>(session?.user?.image as string)
    const [loading , startloading] = React.useTransition()
    const [userdata , setuserdata] = React.useState<UserDetails | null>(null)
    const {toast} = useToast()


   const profilepicform = useForm<z.infer<typeof Profilepicschema>>({
      resolver : zodResolver(Profilepicschema),
      defaultValues : {
         profile_pic :  undefined,
         bio : userdata ? userdata.bio as string : undefined,
         full_name : userdata? userdata.full_name : undefined
      }
   })
   const socialform = useForm<z.infer<typeof SocialSchema>>({
    resolver : zodResolver(SocialSchema),
    defaultValues : {
        website : userdata? userdata.website as string : undefined,
        instagram : userdata? userdata.instagram as string : undefined,
        facebook : userdata? userdata.facebook as string : undefined,
        twitter : userdata? userdata.twitter as string : undefined,
    }
   })
   
   const SubmitUpdateprofile = (values : z.infer<typeof Profilepicschema>) => {
      const data = new FormData()
      
      Object.entries(values).forEach(([key , value]) =>  {
        data.append(`${key}` , value)
      })

      startloading(async()=> {
         const response = await Updatecurrentuser(data)
         if (response.status === 200){
             update({
                ...session,
                user : {
                        userId : response.data.id,
                        image : response.data.profile_img,
                        name : response.data.full_name,
                        email : response.data.email,
                        device_id : session?.user?.device_id
                       } as CustomUser
                
             })

             setuserdata(response.data)
             toast({
                title : 'Updated Successfully',
                description : 'Details have been updated',
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
         else{
            toast({
                variant : "destructive",
                title : "Update Failed",
                description :"Something went wrong",
                className : "text-white font-nunito"
              }) 
         }
      })
      


   }

   const SubmitUpdateLinks = (values : z.infer<typeof SocialSchema>) => {
    const data = new FormData()
      
    Object.entries(values).forEach(([key , value]) =>  {
      data.append(`${key}` , value)
    })

    startloading(async()=> {
        const response = await Updatecurrentuser(data)
        if (response.status === 200){
            setuserdata(response.data)
            toast({
               title : 'Updated Successfully',
               description : 'Details have been updated',
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
        else{
           toast({
               variant : "destructive",
               title : "Update Failed",
               description :"Something went wrong",
               className : "text-white font-nunito"
             }) 
        }
     })

   }

   React.useEffect(() => {
    if (userdata) {
      
      profilepicform.reset({
        full_name : userdata.full_name,
        bio : userdata.bio ? userdata.bio : undefined 
      })

      socialform.reset({
        website : userdata.website ? userdata.website : undefined,
        twitter : userdata.twitter ? userdata.twitter : undefined,
        facebook : userdata.facebook ? userdata.facebook : undefined,
        instagram : userdata.instagram ? userdata.instagram : undefined
      })
    }
  }, [userdata])

   React.useEffect(()=>{
      const loaddata = async()=>{
        const response = await GetCurrentuser()
        if(response.status_code === 200){
            setuserdata(response.data as UserDetails)
        }
        else if(response.status_code === 401){
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
            title : "Update Failed",
            description :"Something went wrong",
            className : "text-white font-nunito"
          }) 
       }
      }

      loaddata()
   },[])
    return (
        <div className='w-full max-w-[793px] md:p-10 md:border-[#EBEBEB] md:border-[1px] px-3 space-y-12 md:shadow-[#1018280F] md:shadow-sm rounded-[16px]'>
            <h1 className='font-montserrat font-[600] md:text-[32px] text-[24px]'>
              Account
            </h1>

            <div className='space-y-3'>
                <h2 className='font-nunito font-[500] md:text-[20px] text-[#1E1E1E]'>Edit Profile</h2>
                <p className='text-[#767676] font-nunito font-[400] md:text-[14px] '>Customize your profile to your liking </p>

            </div>
         
         <div>

            <Form {...profilepicform}>
                <form onSubmit={profilepicform.handleSubmit(SubmitUpdateprofile)} className='flex flex-col gap-y-7'>
                <FormField
                control={profilepicform.control}
                name='profile_pic'
                render={({field}) => (
                    <FormItem className='space-y-3'>
                        <div className='flex-row flex gap-x-7 items-center'>
                         {picurl &&  <Avatar className='w-[84px] h-[84px]'>
                       <AvatarImage src={picurl}  alt='profile picture' />
                       <AvatarFallback>US</AvatarFallback>
                        </Avatar> }
                        <FormLabel htmlFor='profile-pic' className='bg-[#E0580C] text-white rounded-[8px] hover:bg-white hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px] p-3'>Upload Picture</FormLabel>
                        <FormControl>
                            <Input 
                             type='file' 
                             id='profile-pic' 
                             className='hidden' 
                             onChange={( e : React.ChangeEvent<HTMLInputElement>) => {
                                const files = e.target.files
                                if(files && files.length > 0){
                                    const file = files[0]
                                    field.onChange(file)
                                    const preview = URL.createObjectURL(file)
                                    setpicurl(preview)
                                }
                             }}
                             disabled={loading}
                             />
                        </FormControl>
                        </div>
                        <FormMessage/>
                    </FormItem>
                    
                )}
                />

                <FormField
                control={profilepicform.control}
                name = 'full_name'
                render={({field}) => (
                    <FormItem>
                        <FormLabel className='text-[#303030] font-nunito font-[600] text-[14px]'>Full Name</FormLabel>
                        <FormControl>
                            <Input type='text' className='h-[56px] border-[#EBEBEB] border-[1px]' placeholder='Enter Your Full Name' onChange={field.onChange} disabled={loading} value={field.value as string}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                
                />

                <FormField
                control={profilepicform.control}
                name = 'bio'
                render = {({field}) => (
                    <FormItem>
                        <FormLabel className='text-[#303030] font-nunito font-[600] text-[14px]'>Short bio</FormLabel>
                        <FormControl>
                            <Input type="text" className='h-[128px] border-[#EBEBEB] border-[1px]' placeholder='Enter Your bio'  onChange={field.onChange}  disabled={loading} value={field.value as string} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <div className='flex justify-end'>
                    <Button className=' flex gap-x-3 bg-[#E0580C]  text-white rounded-[8px] hover:bg-white py-6 hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px] ' disabled={loading}>
                        {loading && <Spinner/>}
                        Save Changes
                    </Button>
                </div>
                </form>
            </Form>
            
        
        </div>
       
        <div className='space-y-3'>
                <h2 className='font-nunito font-[500] md:text-[20px] text-[#1E1E1E]'>Social media Links</h2>
                <p className='text-[#767676] font-nunito font-[400] md:text-[14px] '>Attach your social media for more visibilty</p>

            </div>

        <Form {...socialform}>
            <form onSubmit={socialform.handleSubmit(SubmitUpdateLinks)} className='flex flex-col gap-y-7'>
            <FormField
                control={socialform.control}
                name = 'website'
                render = {({field}) => (
                    <FormItem>
                        <FormLabel className='text-[#303030] font-nunito font-[600] text-[14px]'>Website URL</FormLabel>
                        <FormControl>
                            <Input className='h-[56px] border-[#EBEBEB] border-[1px]' placeholder='Enter Your Website url' onChange={field.onChange} disabled={loading} value={field.value as string}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )}
                />

                <FormField
                control={socialform.control}
                name = 'twitter'
                render = {({field}) => (
                    <FormItem>
                        <FormLabel className='text-[#303030] font-nunito font-[600] text-[14px]'>Twitter</FormLabel>
                        <FormControl>
                            <Input className='h-[56px] border-[#EBEBEB] border-[1px]' placeholder='Enter the URL to your Twitter page' onChange={field.onChange} disabled={loading} value={field.value as string}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )}
                />

                <FormField
                control={socialform.control}
                name = 'facebook'
                render = {({field}) => (
                    <FormItem>
                        <FormLabel className='text-[#303030] font-nunito font-[600] text-[14px]'>Facebook</FormLabel>
                        <FormControl>
                            <Input className='h-[56px] border-[#EBEBEB] border-[1px]' placeholder='Enter the URL to your Facebook page' onChange={field.onChange} disabled={loading} value={field.value as string} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )}
                />

                <FormField
                control={socialform.control}
                name = 'instagram'
                render = {({field}) => (
                    <FormItem>
                        <FormLabel className='text-[#303030] font-nunito font-[600] text-[14px]'>Instagram</FormLabel>
                        <FormControl>
                            <Input className='h-[56px] border-[#EBEBEB] border-[1px]' placeholder='Enter the URL to your Instagram page' onChange={field.onChange} disabled={loading} value={field.value as string} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )}
                />

                <div className='flex justify-end'>
                    <Button className=' flex gap-x-3 bg-[#E0580C] text-white rounded-[8px] hover:bg-white py-6 hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px] ' disabled={loading}>
                    {loading && <Spinner/>}
                        Save Changes
                        
                        </Button>
                </div>
            </form>

        </Form>
        
            
        </div>
    )
}