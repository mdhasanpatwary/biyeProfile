import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreateBiodataButton } from "@/components/CreateBiodataButton"
import { CopyButton } from "@/components/CopyButton"
import { VisibilityToggle } from "@/components/VisibilityToggle"
import Image from "next/image"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { getCloudinaryUrl } from "@/lib/cloudinary"

export const dynamic = "force-dynamic"

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
      <div className="max-w-4xl mx-auto mt-24 px-4 pb-32">
        <div className="bg-white rounded-md border border-black/5 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-16 bg-black text-white flex flex-col justify-center">
              <div className="w-12 h-12 bg-white/10 rounded-sm border border-white/10 flex items-center justify-center mb-8">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-4xl font-serif mb-6 tracking-tight italic">The Registry.</h2>
              <p className="text-white/40 text-lg leading-relaxed mb-0 font-medium">
                Your journey to finding a meaningful connection starts with a refined, professional document.
              </p>
            </div>
            <div className="md:w-1/2 p-16 flex flex-col justify-center items-start bg-white">
              <div className="space-y-8 mb-12 w-full">
                <div className="flex items-start gap-4 pb-8 border-b border-black/5 w-full">
                  <div className="w-5 h-5 rounded-sm bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 010 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-black/30 mb-1.5 font-black">Standard</p>
                    <p className="text-[17px] font-bold text-black font-serif italic">Editorial Design</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 w-full">
                  <div className="w-5 h-5 rounded-sm bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 010 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-black/30 mb-1.5 font-black">Utility</p>
                    <p className="text-[17px] font-bold text-black font-serif italic">Instant PDF Generation</p>
                  </div>
                </div>
              </div>
              <CreateBiodataButton />
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
    <div className="max-w-5xl mx-auto py-32 space-y-16 px-6 pb-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-12 border-b border-black/5">
        <div>
          <h1 className="text-6xl font-serif text-black mb-3 tracking-tighter">My Dashboard</h1>
          <p className="text-black/30 font-mono text-[11px] uppercase tracking-[0.4em] font-black">Manage your private documentation</p>
        </div>
        <div className="flex gap-4">
          <Link href={`/biodata/${session.user.username}`}>
            <Button variant="outline" className="px-8">View Profile</Button>
          </Link>
          <Link href="/dashboard/edit">
            <Button className="px-8">Edit Biodata</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Profile Details Card */}
        <div className="md:col-span-2 bg-white rounded-md border border-black/5 p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-12">
            <div className="w-32 h-32 rounded-sm bg-gray-50 border border-black/5 flex items-center justify-center overflow-hidden shrink-0 relative grayscale">
              {biodataContent.basicInfo?.photoUrl ? (
                <Image
                  src={getCloudinaryUrl(biodataContent.basicInfo.photoUrl, "thumb")}
                  alt={biodataContent.basicInfo?.fullName || "User"}
                  fill
                  sizes="128px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <svg className="w-16 h-16 text-black/5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-4xl font-serif text-black mb-3 italic tracking-tight">{biodataContent.basicInfo?.fullName}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-8">
                {[
                  (() => {
                    if (!biodataContent.basicInfo?.dateOfBirth) return null;
                    const birthDate = new Date(biodataContent.basicInfo.dateOfBirth);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                    return `${age} Years`;
                  })(),
                  biodataContent.basicInfo?.height,
                  biodataContent.basicInfo?.maritalStatus
                ].filter(Boolean).map((stat, i) => (
                  <span key={i} className="text-black/40 font-mono text-[10px] uppercase tracking-[0.3em] font-black px-5 py-2.5 border border-black/5 rounded-sm">
                    {stat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 p-10 bg-gray-50/30 border border-black/5 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-black text-black/20 uppercase tracking-[0.4em] mb-3">Public Access</span>
              <span className="text-sm font-bold text-black border-b-2 border-black/5 pb-1 font-mono tracking-tight">{publicUrl}</span>
            </div>
            <CopyButton text={`https://${publicUrl}`} />
          </div>
        </div>

        {/* Visibility & Insights */}
        <div className="flex flex-col gap-12">
          <div className="p-10 border border-black/5 rounded-md bg-white">
            <span className="font-mono text-[10px] font-black text-black/20 uppercase tracking-[0.4em] block mb-6">Profile Control</span>
            <VisibilityToggle initialIsPublic={user.biodata.isPublic} />
          </div>

          <div className="bg-black text-white p-12 rounded-md flex flex-col justify-between group h-full">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-sm border border-white/5 flex items-center justify-center mb-12">
                <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-6xl font-serif mb-3 leading-none italic tracking-tighter">Soon</h3>
              <p className="text-white/30 font-mono text-[11px] uppercase tracking-[0.4em] font-black">Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
