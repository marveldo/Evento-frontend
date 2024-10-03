import z from "zod"

const signupschema = z.object({
    "fullname": z.string().min(1),
    "email": z.string().email({
        "message" : "This is not a valid email"
    }),
    "password":  z.string().min(8).max(20)
})

export default signupschema

