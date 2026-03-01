import Link from "next/link"
import { auth } from "@/lib/auth"
import { DevLoginButton } from "@/components/DevLoginButton"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-10">
        <div className="text-2xl font-bold text-indigo-700 tracking-tight">BiyeProfile</div>
        <div>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex gap-4 items-center">
              {process.env.NODE_ENV === "development" && <DevLoginButton />}
              <Link
                href="/api/auth/signin"
                className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-full transition-all border border-indigo-200"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-20 pb-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 -ml-20 mt-32 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Perfect</span> <br className="hidden md:block"/> Marriage Biodata
          </h1>

          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto mb-10 leading-relaxed">
            Beautiful, printable, and private. Generate your professional marriage biodata link in seconds and share it securely.
          </p>

          <div className="flex justify-center flex-col sm:flex-row gap-4">
            <Link
              href={session?.user ? "/dashboard" : "/api/auth/signin"}
              className="px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg px-10 shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
            >
              Create Free Biodata
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
            <div key={i} className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
