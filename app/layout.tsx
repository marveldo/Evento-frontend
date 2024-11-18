import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./componenets/Navbar/Navbar";
import Footer from "./componenets/footer/Footer";
import SessionWrapper from "@/SessionWrapper/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
import ProgressProvider from "./componenets/progress/nextprogressbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Websockethook } from "@/SessionWrapper/WebsocketHook";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Event application",
  description: "An event app where events are scheduled and users can register for events",
};


export default async function RootLayout({children}:Readonly<{children: React.ReactNode;}>) {
  const session = await getServerSession(authOptions)
  
  return (
    <SessionWrapper session={session} >
      <Websockethook>
      <html lang="en">
      <Head>
        <title>Home - Evento</title>
        <meta name="description" content="An event app for registering for events and scheduling events" />
        <meta name="keywords" content="events, evento, evented" />
        <meta property="og:title" content="Home - Evento" />
        <meta property="og:description" content="An Event application." />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="https://evento-frontend.vercel.app/" />
        <link rel="canonical" href="https://evento-frontend.vercel.app/" />
      </Head>
      <body className="font-work flex flex-col min-h-screen bg-white">
      <Navbar/>
      <ProgressProvider>{children}</ProgressProvider>
      <Toaster/>
      <Footer/>
      </body>
    </html>
      </Websockethook>
     
    </SessionWrapper>
    
  );
}
