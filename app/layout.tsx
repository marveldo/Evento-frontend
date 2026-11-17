import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/providers/Providers";
import { getSession } from "@/lib/server/session";

export const metadata: Metadata = {
  metadataBase: new URL("https://evento-frontend.vercel.app"),
  title: "Event application",
  description: "An event app where events are scheduled and users can register for events",
  keywords : ["events", 'evento' , 'evento-frontend', 'evented', 'Event'],
  authors: [{ name: 'Utibeabasi Uboh', url: 'https://marvelous85.pythonanywhere.com/' }],
  applicationName: 'Evento App',
  generator: 'Evento',
  creator: 'Uboh Utibeabasi',
  publisher: 'Uboh Utibeabasi',
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
    google  : "o7EehIE30F2m_yKJkhcyD5zd1KaAmf_00vVieX43t0I"
  }
  
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-work">
        <NextTopLoader color="#E0580C" height={3} showSpinner={false} zIndex={1600} />
        <Providers session={getSession()}>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
