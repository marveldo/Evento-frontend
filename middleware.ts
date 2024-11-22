import { NextRequest, NextResponse } from "next/server";
import {getToken } from "next-auth/jwt";



const secret = process.env.NEXTAUTH_SECRET


export default async function  middleware(req : NextRequest){
     const token = await getToken({req, secret})
     const {pathname} = req.nextUrl
     const protectedRoutes = ['/home','/dashboard','/create-event','/events/', '/settings/']
     const unprotectedRoutes = ["/login", "/signup"]
     
     let response = NextResponse.next()
     if (!token && protectedRoutes.some(route => pathname.startsWith(route)) ){
        return NextResponse.redirect(new URL(`/login?next=${pathname}`, req.url))
     }
     if (token && unprotectedRoutes.some(route => pathname.startsWith(route))){
       
        return NextResponse.redirect(new URL("/home", req.url))
     }
    
     
     
return NextResponse.next()
}

export const config = {
    matcher: [
      "/login/:path*",   
      "/signup/:path*",     
      "/home/:path*",
      "/dashboard/:path*",
      "/create-event/:path*",
      "/events/:path*",
      "/settings/:path*"
     ],
  };