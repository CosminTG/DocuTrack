import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "../components/Navbar" // 👈 importa el navbar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "DocuTrack",
  description: "Gestor de certificados",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar /> {/* 👈 navbar siempre visible */}
        <main className="p-4">{children}</main>
      </body>
    </html>
  )
}
