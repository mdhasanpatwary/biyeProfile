import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-20 pb-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 left-0 -ml-20 mt-32 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-black tracking-tight mb-8 leading-tight">
            Create Your <span className="underline decoration-gray-300 decoration-8 underline-offset-8">Perfect</span> <br className="hidden md:block" /> Marriage Biodata
          </h1>

          <p className="mt-4 max-w-2xl text-xl text-black mx-auto mb-10 leading-relaxed">
            Beautiful, printable, and private. Generate your professional marriage biodata link in seconds and share it securely.
          </p>

          <div className="flex justify-center flex-col sm:flex-row gap-4">
            <Link
              href={session?.user ? "/dashboard" : "/create"}
              className="px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-black hover:bg-gray-800 md:py-4 md:text-lg px-10 shadow-xl hover:shadow-black/10 transition-all transform hover:-translate-y-1"
            >
              Create Free Biodata
            </Link>
            <Link
              href="/biodata"
              className="px-8 py-4 border border-black/10 text-lg font-medium rounded-full text-black bg-white hover:bg-gray-50 md:py-4 md:text-lg px-10 shadow-sm transition-all transform hover:-translate-y-1"
            >
              Browse Profiles
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { title: "Beautiful Templates", desc: "Minimal, elegant designs that look great on any device and print perfectly to A4 PDF." },
            { title: "Custom Link", desc: "Get a personalized biodata link (biyeprofile.com/yourname) to easily share via WhatsApp." },
            { title: "Privacy First", desc: "Toggle your profile visibility on or off instantly. Only share when you're actively searching." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 text-black">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
              <p className="text-black leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
