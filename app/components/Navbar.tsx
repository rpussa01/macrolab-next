"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        {/* LOGO */}
        <Link href="/" className="leading-none" onClick={() => setOpen(false)}>
          <div className="text-2xl font-black tracking-[-0.06em] text-[#101010] md:text-3xl">
            MacroLab
          </div>
          <div className="mt-1 text-[10px] font-black uppercase tracking-[0.32em] text-[#08789b] md:text-xs">
            Performance Nutrition
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-10 text-sm font-black uppercase tracking-[0.18em] text-[#101010] md:flex">
          <Link className="transition hover:text-[#08789b]" href="/">
            Home
          </Link>
          <Link className="transition hover:text-[#08789b]" href="/recipes">
            Recipes
          </Link>
          <Link className="transition hover:text-[#08789b]" href="/#about">
            About
          </Link>
          <Link className="transition hover:text-[#08789b]" href="/order">
            Order
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full border border-black/20 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#101010] transition hover:border-[#08789b] hover:text-[#08789b] md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-black/10 bg-white px-6 py-8 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-black uppercase tracking-[0.2em] text-[#101010]">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/recipes" onClick={() => setOpen(false)}>
              Recipes
            </Link>
            <Link href="/#about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/order" onClick={() => setOpen(false)}>
              Order
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}