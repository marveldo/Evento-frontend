import React from "react";
import Login from "../componenets/login/login";
import { headers } from "next/headers";



export default function Loginpage (){
  const requestheaders = headers()
  const ip = requestheaders.get('x-forwarded-for') != '::1' ? requestheaders.get('x-forwarded-for') : '127.0.0.1'
  return (
    <main className="flex-grow mb-40">
       <Login ip={ip as string} />
    </main>
  )
}