"use server"

import z from "zod"
import axios from "axios"
import signupschema from "../componenets/signup/signupschema/singup"


export const SignupAction = async(values : z.infer<typeof signupschema>) => {
    const validated_fields = signupschema.safeParse(values)
    if(!validated_fields.success){
        return {
            "status_code" : 400,
            "message":"something is wrong with the data"
        }
    }
    const {email , password , fullname} = validated_fields.data
    const data = {
        full_name : fullname,
        email : email,
        password : password
    }
     try{
        const response = await axios.post(`${process.env.BACKEND_URL}/auth/register/`, data)
        if(response.status === 201){
            return {
                "status_code": 201,
                "message": "user has been created"
            }
        }
     }
     catch(error){
        return axios.isAxiosError(error) && error.response
        ? {
            error: error.response.data.message || "SignUp failed",
            status_code: error.response.status,
          }
        : {
            error: "An unexpected error occurred.",
          };
    }
  }
export async function Getaccess() {
    "use server"
     const res = await axios.get(`${process.env.NEXTAUTH_URL}api/token`)
     return res
}