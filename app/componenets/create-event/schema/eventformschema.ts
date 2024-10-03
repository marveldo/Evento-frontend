import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

const currenttime = today.toLocaleTimeString([],{
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
})

export const eventformschema = z.object({
    "event_name" : z.string().min(1),
    'description': z.string().min(1),
    'date_start' : z.string().min(10).max(10),
    'time_start': z.string().min(5).refine((time)=>time >= currenttime,{
        message : 'Time cannot be earilier than normal time'
    }),
    'date' : z.string().min(10).max(10),
    'time': z.string().min(5).refine((time)=>time >= currenttime,{
        message : 'Time cannot be earilier than normal time'
    }),
    'location': z.string().min(5),
    'event_category': z.string().min(7),
    'event_image': z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {  // 2MB size limit
      message: "File size must be less than 2MB",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPEG or PNG files are allowed",
    }) ,
    'capacity' : z.number()
    .min(1, { message: "Price must be greater than or equal to 1" })
    .refine((value) => value >= 0, { message: "Price must be non-negative" }),
     price : z.number()
     .min(0, { message: "Price must be greater than or equal to 0" })
     .refine((value) => value >= 0, { message: "Price must be non-negative" }),

})
   



