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

export const metadata: Metadata = {
  title: "Event application",
  description: "An event app where events are scheduled and users can register for events",
  keywords : ["events", 'evento' , 'evento-frontend', 'evented', 'Event'],
  authors: [{ name: 'Utibeabasi Uboh', url: 'https://marvelous85.pythonanywhere.com/' }],
  viewport: 'width=device-width, initial-scale=1',
  applicationName: 'Evento App',
  generator: 'Evento',
  creator: 'Uboh Utibeabasi',
  publisher: 'Uboh Utibeabsi',
  openGraph : {
    title : 'Evento',
    description : 'An Event App for planning Events and registering for Events',
    url : 'https://evento-frontend.vercel.app/',
    images : [
      {
        url: "/favicon.ico",
        width: 32,
        height: 32,
        alt: "Event Platform",
      },
    ]
  },
  twitter : {
    card: "summary_large_image",
    title: "Evento",
    description: "An Event App for planning Events and registering for Events",
    images: ["/favicon.ico"],
  },
  verification : {
    google  : "google-site-verification=o7EehIE30F2m_yKJkhcyD5zd1KaAmf_00vVieX43t0I"
  }
  
};


export default async function RootLayout({children}:Readonly<{children: React.ReactNode;}>) {
  const session = await getServerSession(authOptions)
  
  return (
    <SessionWrapper session={session} >
      <Websockethook>
      <html lang="en">
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
