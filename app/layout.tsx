import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">

        {/* NAVBAR */}
         <header className="relative z-30 flex items-start justify-between px-8 py-8 md:px-20">
          <Link href="/" className="block">
            <h1 className="text-4xl font-black uppercase tracking-[0.34em] md:text-6xl">
              MacroLab
            </h1>
            <p className="mt-1 text-lg tracking-[0.42em] text-black/70 md:text-2xl">
              Healthy Protein
            </p>
          </Link>
          

          <nav className="hidden items-center gap-12 pt-4 text-sm font-black uppercase tracking-[0.22em] md:flex">
            <Link href="../" className="hover:text-[#0a7898]">
              Home
            </Link>
            <Link href="/recipes" className="hover:text-[#0a7898]">
              All Recipes
            </Link>
            <Link href="#about" className="hover:text-[#0a7898]">
              About
            </Link>
            <Link href="/admin" className="hover:text-[#0a7898]">
              Admin
            </Link>
          </nav>
        </header>

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