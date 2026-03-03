"use client"
import { Button } from "@/components/ui/button"

export function DownloadPDFButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="group flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 hover:shadow-black/20 print:hidden cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:translate-y-0.5 transition-transform duration-300"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
      <span className="tracking-tight">Download Professional PDF</span>
    </Button>
  )
}
