"use server"
import z from "zod"
import axios from "axios"
import formSchema from "../componenets/login/loginschema/login"

export const LoginAction = async(values : z.infer<typeof formSchema>) => {
    const validated_fields = formSchema.safeParse(values)
    if(!validated_fields.success){
        return {
            'status_code':400,
            'error' : 'Invalid Form'
        }
    }
    const {email , password} = validated_fields.data
    const data = {
        email : email, 
        password : password
    } 
    try {
        const response = await axios.post(`${process.env.BACKEND_URL}/auth/login/`,data )
        if (response.status == 200){
            return {
                'status_code':200,
                'message': 'Login Successful',
                'data' : response.data
            }
        }
        
    }catch (error) {
        return axios.isAxiosError(error) && error.response
          ? {
              error: error.response.data.message || "Login failed.",
              status: error.response.status,
            }
          : {
              error: "An unexpected error occurred.",
            };
      }
}