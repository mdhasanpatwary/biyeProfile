import { Logo } from "@/components/Logo"

export function Footer() {
  return (
    <footer className="border-t border-black/5 py-24 bg-gray-50/30 print:hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <Logo />
        <p className="mt-8 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-gray-300">
          Premium Marriage Biodata Builder
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Terms of Service</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Contact Us</a>
        </div>
        <p className="mt-12 text-[10px] font-medium text-gray-300">
          © {new Date().getFullYear()} BiyeProfile. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
