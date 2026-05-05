import "./globals.css"
import Link from "next/link"
import Navbar from "./components/Navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">

        <Navbar/>

        {/* MAIN CONTENT */}
        <main>{children}</main>

        {/* FOOTER */}
        <footer className="mt-20 border-t px-6 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MacroLab. All rights reserved.
        </footer>

      </body>
    </html>
  )
}