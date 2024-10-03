import NextAuth,{DefaultSession,} from "next-auth";
import { CustomUser } from "@/lib/authOptions";
import { JWT } from "next-auth/jwt";
declare module "next-auth"{
    interface Session {
        access_token : string | undefined,
        refresh_token : string | undefined,
        user? : CustomUser,
    
    } 
    interface User {
        access_token : string | null,
        refresh_token : string | null,
        user : CustomUser
       
    }

   
}
declare module "next-auth/jwt"{
    interface JWT {
        access_token?: string ;
        refresh_token?: string ; 
        userId?: string;
        user?: CustomUser;
      }
}


