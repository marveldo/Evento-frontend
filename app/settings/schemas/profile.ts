import z from 'zod'

const Profileschema = z.object({
    'profile_pic' : z.
                    instanceof(File)
                    .refine((file)=> file.size  <=  2 * 1024 * 1024 , {
                        message : "File size must not be greater than 2mb in size"
                    })
                    .refine((file) => ["image/jpeg", "image/png"].includes(file.type) , {
                        message : 'File size must be jpeg or png'
                    })
                    .nullable(),

    'full_name' : z.string().min(2, {
        message : 'Cannot be less than 2 letters'
    }),

    'bio' : z.string().min(2, {
        message : 'Cannot be less than 2 letters'
    }),

})

const socialmediaSchema = z.object({
    'website': z.string().min(2, {
        message: 'Link be less than 2 letters'
    }).refine((value) => /^https:\/\/.+$/.test(value), {
        message: "URL must start with https://",
    }),

    'twitter': z.string().min(2, {
        message: 'Link be less than 2 letters'
    }).refine((value) => /^https:\/\/.+$/.test(value), {
        message: "URL must start with https://",
    }),

    'facebook': z.string().min(2, {
        message: 'Link be less than 2 letters'
    }).refine((value) => /^https:\/\/.+$/.test(value), {
        message: "URL must start with https://",
    }),

    'instagram': z.string().min(2, {
        message: 'Link be less than 2 letters'
    }).refine((value) => /^https:\/\/.+$/.test(value), {
        message: "URL must start with https://",
    }),
})
export const Profilepicschema = Profileschema.partial().transform((data) => {
    // Remove undefined keys
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    )
  })
export const SocialSchema = socialmediaSchema.partial().transform((data) => {
    // Remove undefined keys
   return Object.fromEntries(
     Object.entries(data).filter(([_, value]) => value !== undefined)
   )
 })