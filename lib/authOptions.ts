import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials";
import { Profile,Account,TokenSet,User,Session, } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios"
import { LoginAction } from "@/app/actions/login";
import { Refreshtoken } from "@/app/actions/refreshtoken";
import * as jwtDecode from "jwt-decode"
import dayjs from "dayjs";
import { cookies } from "next/headers";


export interface CustomUser {
    userId?: string | null;
    name?: string | null;
    email?: string | null;
    image? : string ,
    device_id : string
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
                password: { label: "Password", type: "password" },
                userAgent: { label: "User-Agent", type: "text" }
              },

            async authorize(credentials){
                if (!credentials || !credentials.email || !credentials.password) {
                    return null; // Return null if required fields are missing
                }
               const {email, password , userAgent} = credentials
               const response = await LoginAction({email, password} , userAgent)
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
                         email : response.data.data.email,
                         device_id : response.data.data.device_id
                        } as CustomUser
                } as User

               return user 
               
            }
        })
       ],
 
  
    callbacks : {
       
        async signIn({profile , account }){
          
            if (account?.id_token){
             try{
              const token = account?.id_token
              const cookieStore = cookies();

              // Retrieve the `userAgent` cookie
              const userAgent = cookieStore.get('userAgent')?.value;
              const response = await axios.post(`${process.env.BACKEND_URL}/auth/google/`,{
                access_token : token
              }, {
                headers :{
                    'User-Agent': `${userAgent}`
                }
              })
              const data = response.data
              if(data.access && data.refresh){
                account.access_token = data.access
                account.refresh_token = data.refresh
                account.user = {
                    userId : data.data.id,
                    name : data.data.full_name,
                    email : data.data.email,
                    image : data.data.profile_img,
                    device_id : data.data.device_id
                    
                  }  as CustomUser
              }

              cookieStore.set({
                name: 'userAgent',
                value: '',
                expires: new Date(0),
                path: '/',
              });
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
                   userId : user.user.userId,
                   device_id : user.user.device_id
              } as CustomUser
            }
            if(account?.provider == 'google'){
                token.access_token = account.access_token,
                token.refresh_token = account.refresh_token,
                token.user = account.user as CustomUser
                
            }

           const decodedtoken = jwtDecode.jwtDecode(token.access_token as string)
           const isExpired = dayjs.unix(decodedtoken.exp as number).diff(dayjs()) < 1
           
            if(isExpired){
                
                const refreshed = await Refreshtoken(token.refresh_token as string, token.user?.device_id as string)
              
                if (refreshed){
                    token = refreshed as JWT
                    return token
                }
                else{
                   return token
                }
            }

            
             return token
            
            
        },
        async session({session, token}:{session : Session, token : JWT}){
        
            session.access_token = token.access_token
            session.refresh_token = token.refresh_token
            session.user = token.user as CustomUser
            return session
          
        }

    }, 
    session: {
        strategy: 'jwt',
      },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET, // Ensure this is set properly
      },
    pages : {
        signIn : '/login',
    }
}