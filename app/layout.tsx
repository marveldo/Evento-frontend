import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./componenets/Navbar/Navbar";
import Footer from "./componenets/footer/Footer";
import SessionWrapper from "@/SessionWrapper/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
import ProgressProvider from "./componenets/progress/nextprogressbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({children}:Readonly<{children: React.ReactNode;}>) {
  const session = await getServerSession(authOptions)
  
  return (
    <SessionWrapper session={session} >
      <html lang="en">
      <body className="font-work flex flex-col min-h-screen bg-white">
      <Navbar/>
      <ProgressProvider>{children}</ProgressProvider>
      <Toaster/>
      <Footer/>
      </body>
    </html>
    </SessionWrapper>
    
  );
}
