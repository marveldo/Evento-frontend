import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials";
import { Profile,Account,TokenSet,User,Session, } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios"
import { LoginAction } from "@/app/actions/login";

import formSchema from "@/app/componenets/login/loginschema/login";
import { encryptToken } from "@/app/utils/token_encryption";
import * as jwtDecode from "jwt-decode"
import dayjs from "dayjs";


export interface CustomUser {
    userId?: string | null;
    name?: string | null;
    email?: string | null;
    image? : string 
}




export const authOptions : NextAuthOptions = {
    providers : [
        GoogleProvider({
           clientId : process.env.GOOGLE_CLIENT_ID as string,
           clientSecret : process.env.GOOGLE_CLIENT_SECRET as string
        }),
        
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" }
              },

            async authorize(credentials){
               const validated = formSchema.safeParse(credentials)
               if(!validated.success){
                return  null ;
               }
               const {email, password} = validated.data
               const response = await LoginAction({email, password})
               if (!response){
                return null ;
               }
               const user = {
                   access_token : response.data.access,
                   refresh_token : response.data.refresh,
                   user:{
                         userId : response.data.data.id,
                         image : response.data.data.profile_img,
                         name : response.data.data.full_name,
                         email : response.data.data.email
                        } as CustomUser
                } as User

               return user 
               
            }
        })
       ],
      
    callbacks : {
        async redirect({ url, baseUrl }) {
            
            if (url === baseUrl || url.startsWith(baseUrl)) {
              return `${baseUrl}/home`; // Redirect to the home page
            }
            return baseUrl;
          },
        async signIn({profile , account}){
          
            if (account?.id_token){
             try{
              const token = account?.id_token
              const response = await axios.post(`${process.env.BACKEND_URL}/auth/google/`,{
                access_token : token
              })
              const data = response.data
              if(data.access && data.refresh){
                account.access_token = data.access
                account.refresh_token = data.refresh
                account.user = {
                    userId : data.data.id,
                    name : data.data.full_name,
                    email : data.data.email,
                    image : data.data.profile_img
                    
                  }  as CustomUser
              }
              return true
             }
             catch(error){
               
                return false
             }
            
            }

            return true
        },
        async jwt({token , account, user }:{token : JWT , account? : Account | null, user? : User }){
            if(user?.access_token && user.refresh_token){
              token.access_token = user.access_token,
              token.refresh_token = user.refresh_token,
              token.user = {
                   name : user.user.name,
                   email : user.user.email,
                   image : user.user.image,
                   userId : user.user.userId
              } as CustomUser
            }
            if(account?.provider == 'google'){
                token.access_token = account.access_token,
                token.refresh_token = account.refresh_token,
                token.user = account.user as CustomUser
                
            }
            
             return token
            
            
        },
        async session({session, token}:{session : Session, token : JWT}){
        
            session.access_token = encryptToken(token.access_token)
            session.refresh_token = encryptToken(token.refresh_token)
            session.user = token.user as CustomUser
            return session
          
        }

    }, 
    
    secret: process.env.NEXTAUTH_SECRET,
    

  
}