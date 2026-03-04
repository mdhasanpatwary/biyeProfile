import { Logo } from "@/components/Logo"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-24 border-t border-black/5 bg-white print:hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Logo />
          <p className="font-mono text-[9px] font-black text-black/30 uppercase tracking-[0.4em]">
            Premium Marriage Biodata Builder
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] font-black text-black uppercase tracking-[0.2em] mb-1.5">Navigation</span>
            <Link href="/biodata" className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors uppercase">Directory</Link>
            <Link href="/dashboard" className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors uppercase">Dashboard</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] font-black text-black uppercase tracking-[0.2em] mb-1.5">Legal</span>
            <Link href="#" className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors uppercase">Privacy</Link>
            <Link href="#" className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors uppercase">Terms</Link>
          </div>
        </div>

        <div className="pt-8 md:pt-0 text-[10px] font-mono text-black/30 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} BiyeProfile.
        </div>
      </div>
    </footer>
  )
}
