import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"
import { BiodataContent } from "@/components/BiodataContent"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { auth } from "@/lib/auth"

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await props.params

  const user = await prisma.user.findUnique({
    where: { username },
    include: { biodata: true }
  })

  // SEO: Only index if public
  if (!user || !user.biodata || !user.biodata.isPublic) {
    return {
      title: 'Biodata | BiyeProfile',
      robots: { index: false, follow: false }
    }
  }

  const data = user.biodata.data as unknown as BiodataFormValues
  const name = data?.basicInfo?.fullName || user.username

  return {
    title: `${name}'s Marriage Biodata | BiyeProfile`,
    description: `View ${name}'s complete marriage biodata on BiyeProfile.`,
    robots: { index: true, follow: true }
  }
}

export default async function PublicBiodataPage(props: { params: Promise<{ username: string }> }) {
  const { username } = await props.params
  const session = await auth()

  const user = await prisma.user.findUnique({
    where: { username },
    include: { biodata: true }
  })

  if (!user || !user.biodata) {
    notFound()
  }

  const isOwner = session?.user?.username === username

  if (!user.biodata.isPublic && !isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center border">
          <h1 className="text-2xl font-bold mb-2">Profile Private</h1>
          <p className="text-black">This user has made their biodata private.</p>
        </div>
      </div>
    )
  }

  const data = user.biodata.data as unknown as BiodataFormValues

  return (
    <div className="bg-white py-12 sm:py-24 px-0 sm:px-6 lg:px-8 print:py-0 print:bg-white print:px-0">
      <div className="max-w-4xl mx-auto bg-white print:shadow-none p-4 sm:p-16 print:p-0 sm:rounded-md border border-black/5 relative">
        {isOwner && !user.biodata.isPublic && (
          <div className="absolute top-8 right-8 print:hidden">
            <span className="bg-gray-100 text-black/40 text-[10px] font-mono font-black px-3 py-1.5 rounded-sm uppercase tracking-[0.2em] border border-black/5">
              Private View / Owner
            </span>
          </div>
        )}
        <BiodataContent data={data} />

        <div className="mt-24 pt-12 border-t border-black/5 print:hidden flex justify-center items-center px-4">
          <DownloadPDFButton filename={`${data?.basicInfo?.fullName || username}_biyeprofile`} />
        </div>
      </div>

      {/* Floating Sticky Download Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-xl border-t border-black/5 sm:hidden flex justify-center z-50 print:hidden transition-all duration-300">
        <DownloadPDFButton filename={`${data?.basicInfo?.fullName || username}_biyeprofile`} />
      </div>

      {/* Spacer for mobile to prevent content being hidden by sticky bar */}
      <div className="h-32 sm:hidden print:hidden" />
    </div>
  )
}

