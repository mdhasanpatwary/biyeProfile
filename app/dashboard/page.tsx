import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CreateBiodataButton } from "@/components/CreateBiodataButton"
import { CopyButton } from "@/components/CopyButton"
import { VisibilityToggle } from "@/components/VisibilityToggle"
import Image from "next/image"
import { type BiodataFormValues } from "@/lib/validations/biodata"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.email) return redirect("/api/auth/signin")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { biodata: true }
  })

  // If no biodata, show the "Create" welcome screen
  if (!user?.biodata) {
    return (
      <div className="max-w-4xl mx-auto mt-16 px-4 pb-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-12 bg-black text-white flex flex-col justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Create your legacy.</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-0">
                Your journey to finding the perfect match starts with a beautiful, professional biodata. Let&apos;s make it happen.
              </p>
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center items-start">
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-black flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Premium Design</p>
                    <p className="text-sm text-gray-500">Professional A4 layout matches top marriage standards.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-black flex items-center justify-center shrink-0 mt-1">
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

  // If biodata exists, show the summary dashboard
  const publicUrl = `biyeprofile.com/${session.user.username}`
  const biodataContent = user.biodata.data as unknown as Partial<BiodataFormValues>

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10 px-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tight mb-2">My Dashboard</h1>
          <p className="text-gray-500 font-medium uppercase text-xs tracking-[0.2em]">Manage your profile and visibility</p>
        </div>
        <div className="flex gap-4">
           <a
            href={`/biodata/${session.user.username}`}
            className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-black/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            View Profile
          </a>
          <a
            href="/dashboard/edit"
            className="px-6 py-3 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Biodata
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-gray-100 transition-colors"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-gray-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative">
               {user.image ? (
                  <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
               ) : (
                  <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
               )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-black text-black mb-2">{biodataContent.basicInfo?.fullName}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                <span className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-100">
                   {/* Calculate age accurately */}
                   {(() => {
                      if (!biodataContent.basicInfo?.dateOfBirth) return 'N/A';
                      const birthDate = new Date(biodataContent.basicInfo.dateOfBirth);
                      const today = new Date();
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                      return `${age} Years`;
                   })()}
                </span>
                <span className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-100">
                   {biodataContent.basicInfo?.height}
                </span>
                <span className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-100">
                   {biodataContent.basicInfo?.maritalStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Your Public Link</span>
                <span className="text-sm font-bold text-black group-hover:text-black transition-colors underline underline-offset-4 decoration-gray-200">{publicUrl}</span>
             </div>
             <CopyButton text={`https://${publicUrl}`} />
          </div>
        </div>

        {/* Stats & Controls */}
         <div className="flex flex-col gap-6">
            <VisibilityToggle initialIsPublic={user.biodata.isPublic} />

            <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl shadow-black/20 flex flex-col justify-between group transition-all hover:scale-[1.02]">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h3 className="text-4xl font-black mb-1">Live</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Analytics (Coming Soon)</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-gray-400">
                Track who views your profile
              </div>
            </div>
         </div>
      </div>
    </div>
  )
}
