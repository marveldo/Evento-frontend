import z from "zod"


const formSchema = z.object({
    "email": z.string().email({
        message : "This is not a valid email"
    }),
    "password" : z.string().min(8).max(20)
})

export default formSchema

