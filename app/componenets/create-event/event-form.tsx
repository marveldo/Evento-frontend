"use client"
import React from "react";
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import FormData from "form-data"
import { useForm } from "react-hook-form"
import {Progress}from "@/components/ui/progress"
import { eventformschema } from "./schema/eventformschema";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TimePicker } from "@/components/ui/TimePicker/time-picker";
import { motion } from 'framer-motion'
import dropicon from "@/public/Contained Icon.svg"
import Image from "next/image";
import updatePreview from "@/public/CHANGE.svg"
import Successfulimage from "@/public/Successful.svg"
import { Spinner } from "../Button/arrowicon";
import { useToast } from "@/hooks/use-toast";
import { CreateEvents } from "@/app/actions/createevent";
import { signOut } from "next-auth/react";
import Link from "next/link";


export function EventFormComp () {
    const [progress, setprogress] = React.useState(30)
    const [formstepstate, setformstepstate] = React.useState(0)
    const [previewUrl, setPreviewUrl] = React.useState<String | null>(null);
    const [candisplay, setcandisplay] = React.useState(false)
    const [CustomDate, setCustomdate] = React.useState<Date | null>(null)
    const [Customtime , setCustomtime] = React.useState<String | null>(null)
    const [CustomEndDate, setCustomEnddate] = React.useState<Date | null>(null)
    const [CustomEndtime , setCustomEndtime] = React.useState<String | null>(null)
    const [formsubmitted , setformsubmitted] = React.useState(false)
    const [loading, startTransition] = React.useTransition()
    const [event_link, setevent_link] = React.useState<String | null>(null)
    const [eventlink_copied , seteventlinkcopied] = React.useState(false)
    const {toast} = useToast()
    const form = useForm<z.infer<typeof eventformschema>>({
        resolver: zodResolver(eventformschema),
        defaultValues: {
          'event_name' : "",
          'description' : "",
          'date_start': undefined,
          'time_start' : format(new Date() , 'yyyy-MM-dd hh:mm:ss a') ,
          'date': undefined,
          'time': format(new Date() , 'yyyy-MM-dd hh:mm:ss a'),
          'event_image': undefined,
          'location': "",
          'event_category':'',
          'capacity': 0,
          'price': 0
        },
      })
      
      const timeoutid = setTimeout(() => {
         setcandisplay(true)

         return ()=> clearTimeout(timeoutid)
      }, 500);

  

    const SubmitForm = (values : z.infer<typeof eventformschema>) => {
      const data = new FormData()
 
      startTransition(async()=>{
       
        data.append('event_image', values.event_image)
        data.append('event_name', values.event_name)
        data.append('event_category', values.event_category)
        data.append('date', values.date )
        data.append('start_date', values.date_start)
        data.append('time', format(values.time,'HH:mm:ss'))
        data.append('start_time', format(values.time_start,'HH:mm:ss'))
        data.append('capacity', values.capacity as unknown as string)
        data.append('price', values.price as unknown as string)
        data.append('description', values.description)
        data.append('location', values.location)
        const response = await CreateEvents(data)
       
        if (response.status_code === 201){
          toast({
            title : 'Event Created Successfully',
            description : 'Next Step copy the link to invite people',
            className : 'bg-[#E0580C] text-white font-nunito'
          })
          setevent_link(response.data.event_link)
          setprogress(100)
          setformsubmitted(true)
        }
       else if(response.status_code === 422 || response.status_code === 415){
        toast({
          variant : 'destructive',
          title : "Couldn't Create Event",
          description : 'Due to Bad data Inputted Refill the form'
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
          title : "Couldn't Create Event",
          description : 'Something went wrong try again later'
        })
       }
      })
       }
     
    return (
        <>
          <div className="w-full">
            <h1 className="mb-5">Progress</h1>
          <Progress className="w-full h-[8px] rounded-[8px] bg-[#EBEBEB]"  value={progress}/>
          </div>

          <div className={`w-full md:p-10 p-3 relative flex flex-col gap-y-7 overflow-x-hidden rounded-[24px] shadow-[#0000000A] border-[#EBEBEB] border-[1px] items-center text-center shadow-lg ${formsubmitted ? '' : 'hidden'}`}>
             <h1 className="font-[600] md:text-[32px] text-[20px] font-montserrat">Event Created Successfully</h1>

             <div className="flex justify-center">
              <Image src={Successfulimage} width={263} height={263} alt="Success"/>
             </div>

             <div className="space-y-3">
              <Link href='/home'><Button className="bg-white text-[#E0580C] border-[#E0580C] border-[1px] hover:bg-white ]  w-full h-[56px] ">See All Events</Button></Link>
              <Button 
              className="text-white bg-[#E0580C] hover:bg-white hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px] w-full h-[56px]" 
              disabled={eventlink_copied}
              onClick={()=>{
                navigator.clipboard.writeText(event_link as string)
                .then(()=>{
                  toast({
                    title : 'Link Copied',
                    description : 'You can share with Friends to register for events',
                    className : 'bg-[#E0580C] text-white font-nunito'
                  })
                  seteventlinkcopied(true)
                })
                .catch((err)=> {
                  toast({
                    variant : 'destructive',
                    title : "Failed to copy",
                    description : 'Something went wrong'
                  })
                })
              }}>
              {eventlink_copied ? 'Copied' : 'Copy event Link'}
              </Button>
             </div>
          </div>
        

          <Form {...form}>
            <form onSubmit={form.handleSubmit(SubmitForm)} className={`w-full md:p-10 p-3 relative flex flex-col gap-y-7 overflow-x-hidden rounded-[24px] shadow-[#0000000A] border-[#EBEBEB] border-[1px] shadow-lg ${formsubmitted ? 'hidden' : ''}`}>
              {/* First part of the form */}
              <motion.div 
              className="flex flex-col gap-y-7" 
              animate={{translateX : `-${formstepstate * 150}%`}}>
                <FormField
                  control={form.control}
                  name="event_name"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                         <Input placeholder="Event Name" className="md:text-[32px] text-[20px] text-black md:h-[148px] h-[70px] rounded-[12px] w-full border-[#DEDEDE] border-[1px]" {...field} />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}

                />

               <FormField
                  control={form.control}
                  name="description"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                         <Input placeholder="Description" className="md:text-[20px] text-[16px] text-black h-[92px] rounded-[12px] w-full border-[#DEDEDE] border-[1px]" {...field}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                  />
                {/* Beginning of date and time */}
                <div className="flex flex-col gap-y-3 p-3 border-[#DEDEDE] border-[1px] rounded-[12px]">
                  <div className="flex md:flex-row flex-col md:items-center">
                    <h1 className="me-auto font-montserrat font-[600] text-[20px]">Start</h1>
                    <div className="flex gap-x-2">
                    <FormField
                    control={form.control}
                    name="date_start"
                    render={({field}) => (
                     <FormItem>
                      <FormControl>
                       <Popover>
                           <PopoverTrigger asChild>
                               <Button
                                   variant={"outline"}
                                   className={cn(
                                   "justify-start text-left font-normal flex flex-row items-center h-[56px] md:max-w-[228px]  max-w-[178px] rounded-[8px] ",
                                   !CustomDate && "text-muted-foreground"
                                    )}
                                 >
                                {CustomDate ? format(CustomDate, "PPP") : <span>Pick a date</span>}
                                <ChevronDownIcon className="mr-2 h-4 w-4 size-6 ms-auto" />
                              </Button>
                             </PopoverTrigger>
                             <PopoverContent className="w-auto p-0">
                               <Calendar
                                 mode="single"
                                 selected={new Date(field.value)}
                                 onSelect={(day : Date | undefined) => {
                                 let date = new Date()
                                if (day === undefined){
                                  date = new Date()
                                  }
                                else{
                                    date = day
                                    const formated_date = format(date , "yyyy-MM-dd")
                                    field.onChange(formated_date)
                                    setCustomdate(day)
                                    }
                                    }}
                                    disabled={(date) =>
                                     date < new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                     />
                                    </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage/>
                       </FormItem>
                      )}
                    />

                    <FormField 
                    control={form.control}
                    name="time_start"
                    render={({field}) => (
                      <FormItem>
                         <FormControl>
                         <Popover>
                           <PopoverTrigger asChild>
                               <Button
                                   variant={"outline"}
                                   className={cn(
                                   "justify-start text-left font-normal flex flex-row items-center h-[56px] md:max-w-[156px] max-w-[128px] rounded-[8px] ",
                                   !Customtime && "text-muted-foreground"
                                    )}
                                 >
                                {Customtime ? Customtime: <span>Pick a time</span>}
                                <ChevronDownIcon className="mr-2 h-4 w-4 size-6 ms-auto" />
                              </Button>
                             </PopoverTrigger>
                             <PopoverContent className="w-auto p-4">
                            
                               <TimePicker setDate={(value) => {
                                let time=''
                                if (value === undefined){
                                  time = format(new Date() , 'yyyy-MM-dd hh:mm:ss a')
                                  }
                                else{
                                 time = format(value , 'yyyy-MM-dd hh:mm:ss a')
                                 setCustomtime(format(value , 'hh:mm a'))
                                 field.onChange(time)
                                }
                               }}
                               date={new Date(field.value)}
                               />
                             </PopoverContent>
                          </Popover>
                         </FormControl>
                         <FormMessage/>
                      </FormItem>
                    )}
                    />
                  </div>
                  </div>
                  <div className="flex md:flex-row flex-col md:items-center">
                    <h1 className="me-auto font-montserrat font-[600] text-[20px]">End</h1>
                    <div className="flex gap-x-2">
                    <FormField
                    control={form.control}
                    name="date"
                    render={({field}) => (
                     <FormItem>
                      <FormControl>
                       <Popover>
                           <PopoverTrigger asChild>
                               <Button
                                   variant={"outline"}
                                   className={cn(
                                   "justify-start text-left font-normal flex flex-row items-center h-[56px] md:max-w-[228px] max-w-[178px] rounded-[8px] ",
                                   !CustomDate && "text-muted-foreground"
                                    )}
                                 >
                                {CustomEndDate ? format(CustomEndDate, "PPP") : <span>Pick a date</span>}
                                <ChevronDownIcon className="mr-2 h-4 w-4 size-6 ms-auto" />
                              </Button>
                             </PopoverTrigger>
                             <PopoverContent className="w-auto p-0">
                               <Calendar
                                 mode="single"
                                 selected={new Date(field.value)}
                                 onSelect={(day : Date | undefined) => {
                                 let date = new Date()
                                if (day === undefined){
                                  date = new Date()
                                  }
                                else{
                                    date = day
                                    const formated_date = format(date , "yyyy-MM-dd")
                                    field.onChange(formated_date)
                                    setCustomEnddate(day)
                                    }
                                    }}
                                    disabled={(date) =>
                                     date < new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                     />
                                    </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage/>
                       </FormItem>
                      )}
                    />

                    <FormField 
                    control={form.control}
                    name="time"
                    render={({field}) => (
                      <FormItem>
                         <FormControl>
                         <Popover>
                           <PopoverTrigger asChild>
                               <Button
                                   variant={"outline"}
                                   className={cn(
                                   "justify-start text-left font-normal flex flex-row items-center h-[56px] md:max-w-[156px] max-w-[128px] rounded-[8px] ",
                                   !CustomEndtime && "text-muted-foreground"
                                    )}
                                 >
                                {CustomEndtime ? CustomEndtime: <span>Pick a time</span>}
                                <ChevronDownIcon className="mr-2 h-4 w-4 size-6 ms-auto" />
                              </Button>
                             </PopoverTrigger>
                             <PopoverContent className="w-auto p-4">
                            
                               <TimePicker setDate={(value) => {
                                let time=''
                                if (value === undefined){
                                  time = format(new Date() , 'yyyy-MM-dd hh:mm:ss a')
                                  }
                                else{
                                 time = format(value , 'yyyy-MM-dd hh:mm:ss a')
                                 setCustomEndtime(format(value , 'hh:mm a'))
                                 field.onChange(time)
                                }
                               }}
                               date={new Date(field.value)}
                               />
                             </PopoverContent>
                          </Popover>
                         </FormControl>
                         <FormMessage/>
                      </FormItem>
                    )}
                    />
                  </div>
                  </div>
                </div>
                {/* End of Date and time */}
                
                <FormField
                control={form.control}
                name="price"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="font-montserrat font-[600] md:text-[20px] text-[16px]">Price</FormLabel>
                    <FormControl>
                      <Input 
                      {...field} 
                      type="number"
                      onChange={(e : React.ChangeEvent<HTMLInputElement>)=> {
                        const {value} = e.target
                        field.onChange(Number(value))
                      }} 
                      className="h-[56px] border-[#EBEBEB] border-[1px]"
                      disabled={loading}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="location"
                render={({field})=> (
                  <FormItem>
                    <FormLabel className="font-montserrat font-[600] md:text-[20px] text-[16px]">Location</FormLabel>
                    <FormControl>
                      <Input {...field} name="location" className="h-[56px]" disabled={loading}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />

                {/* End of form beginning */}
                </motion.div>
                {/* Beginning of middle form */}
                <motion.div 
                className={`flex flex-col gap-y-7 absolute top-4 right-0 left-0 md:p-10 p-3 ${candisplay? '': 'opacity-0'}`}
                animate={{translateX : `${150- formstepstate *150}%` }}
                >
                <h1 className="font-montserrat font-[600] md:text-[32px] text-[20px]">Hey Pal, youre almost done!</h1>
                
                <FormField
                control={form.control}
                name="event_image"
                render = {({field}) => (
                  <FormItem>
                     <div 
                         className="h-[278px] border-[#EBEBEB] border-[1px] rounded-[8px] shadow-[#0000000A] shadow-lg" 
                         onDrop={(e : React.DragEvent<HTMLDivElement>)=> {
                          e.preventDefault()
                          const files = e.dataTransfer.files
                          if(files && files.length > 0 && !loading) {
                            const file = files[0]
                            field.onChange(file)
                            const preview = URL.createObjectURL(file)
                            setPreviewUrl(preview)
                          }
                          
                        }}
                        onDragOver={(e : React.SyntheticEvent) => e.preventDefault()}>
                       {field.value === undefined ? <div className="w-full flex flex-col gap-y-5 text-center items-center-center p-2">
                        <div className="flex justify-center">
                         <Image src={dropicon} height={64} width={64} alt="dragimg"/>
                         </div>
                         <h1 className="font-nunito font-[700] md:text-[20px] text-[16px]">Drag to upload</h1>
                         <p className="font-[400] font-nunito md:text-[14px] text-[12px] md:px-20 px-0">Dazzle the world, no magic wand needed. Just drag and drop  files right here. Formats accepted are JPG, PNG, or SVG.</p>
                         <div className="flex justify-center">
                         <FormLabel htmlFor="event-image" className="text-white bg-[#E0580C] hover:bg-white hover:text-[#E0580C] rounded-[8px] hover:border-[#E0580C] hover:border-[1px] max-w-[172px] p-3">Browse to Upload</FormLabel>
                         </div>
                       </div> : <div className="w-full h-full relative">
                        <img className="w-full h-full" src={previewUrl as string}  alt="image_enetred"/>
                        <Image src={updatePreview} 
                        className="absolute bottom-3 right-3"
                        height={54}
                        width={54} 
                        alt="editimg" 
                        onClick={()=> {
                          field.onChange(undefined)
                          setPreviewUrl(null)
                        }}/>
                        </div>}
                     </div>

                     <FormControl>
                        <Input 
                        type="file" 
                        onChange={(e : React.ChangeEvent<HTMLInputElement>)=> {
                          const files = e.target.files
                          if(files && files.length > 0){
                            const file = files[0]
                            field.onChange(file)
                            const preview = URL.createObjectURL(file)
                            setPreviewUrl(preview)
                          }
                        }} 
                        id="event-image" 
                        className="hidden" 
                        disabled={loading}
                        />
                        
                     </FormControl>

                     <FormMessage/>
                  </FormItem>
                )}
                />

                <FormField
                 name="event_category"
                 control={form.control}
                 render={({field}) => (
                  <FormItem>
                    <FormLabel className="font-montserrat md:text-[20px] text-[16px] font-[600]">
                        Select event category
                    </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                <FormControl>
                  <SelectTrigger className="h-[56px]  border-[#EBEBEB] border-[1px]">
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Popular">Popular</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Buisness">Buisness</SelectItem>
                  <SelectItem value="Science & Nature">Science & Nature</SelectItem>
                  <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                  <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Travel & Adventure">Travel & Adventure</SelectItem>
                </SelectContent>
              </Select>
               <FormMessage/>
                  </FormItem>
                 )}
                />

               <FormField
                control={form.control}
                name="capacity"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="font-montserrat font-[600] md:text-[20px] text-[16px]">Capacity</FormLabel>
                    <FormControl>
                      <Input 
                      type="number"
                      {...field} 
                      onChange={(e : React.ChangeEvent<HTMLInputElement>)=> {
                        const {value} = e.target
                        field.onChange(Number(value))
                      }} 
                      className="h-[56px] border-[#EBEBEB] border-[1px]"
                      disabled={loading}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />
             

                </motion.div>

              {/* End of middle form */}
              
              <div className="space-y-3 w-full">
                <Button 
                type="button" 
              className={`text-white bg-[#E0580C] hover:bg-white hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px] w-full h-[56px] ${formstepstate === 1 ? 'hidden' : ''}`}
                onClick={async()=>{
                  const isValid = await form.trigger(['event_name', 'date' , 'date_start','time', 'time_start', 'description', 'price', 'location'])
                  if(isValid){
                    setprogress(75)
                  setformstepstate(1)
                  }
                  
                }}
                disabled={loading}
                >
                Next
                </Button>
                <Button 
                type="button" 
                className={`bg-white text-[#E0580C] border-[#E0580C] border-[1px] hover:bg-white ]  w-full h-[56px] ${formstepstate === 1 ? '' : 'hidden'}`} 
                onClick={()=> {
                  setprogress(30)
                  setformstepstate(0)
                }}
                disabled={loading}
                >
                Go Back
                </Button>
                <Button type="submit" className={`text-white bg-[#E0580C] hover:bg-white hover:text-[#E0580C] hover:border-[#E0580C] hover:border-[1px] w-full h-[56px] ${formstepstate === 1 ? '' : 'hidden'}`} disabled={loading}>{loading? <Spinner/> : 'Submit'}</Button>
              </div>
            </form>
          </Form>
        </>
    )
}