import z from 'zod'

export const Profilepicschema = z.object({
    'profile_pic' : z.
                    instanceof(File)
                    .refine((file)=> file.size  <=  2 * 1024 * 1024 , {
                        message : "File size must not be greater than 2mb in size"
                    })
                    .refine((file) => ["image/jpeg", "image/png"].includes(file.type) , {
                        message : 'File size must be jpeg or png'
                    } ),

    'full_name' : z.string({
        message : 'String cannot be empty'
    }).min(2, {
        message : 'Cannot be less than 2 letters'
    }),

    'bio' : z.string({
        message : 'String cannot be empty'
    }).min(2, {
        message : 'Cannot be less than 2 letters'
    }),

})