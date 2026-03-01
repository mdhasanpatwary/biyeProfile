import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CreateBiodataButton } from "@/components/CreateBiodataButton"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.email) return redirect("/api/auth/signin")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { biodata: true }
  })

  // Redirect edit mode directly if biodata exists
  if (user?.biodata) {
    redirect("/dashboard/edit")
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
            </div>
            <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Create your legacy.</h2>
            <p className="text-indigo-100 text-lg leading-relaxed mb-0">
              Your journey to finding the perfect match starts with a beautiful, professional biodata. Let&apos;s make it happen.
            </p>
          </div>
          <div className="md:w-1/2 p-12 flex flex-col justify-center items-start">
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <div>
                   <p className="font-bold text-gray-900">Premium Design</p>
                   <p className="text-sm text-gray-500">Professional A4 layout matches top marriage standards.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <div>
                   <p className="font-bold text-gray-900">Instant PDF</p>
                   <p className="text-sm text-gray-500">Download high-quality PDF to share via WhatsApp.</p>
                </div>
              </div>
            </div>
            <CreateBiodataButton />
            <p className="mt-4 text-[10px] text-gray-400 font-medium">Takes less than 5 minutes to complete.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
