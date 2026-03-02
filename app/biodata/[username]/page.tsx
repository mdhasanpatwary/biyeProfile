import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"
import { BiodataContent } from "@/components/BiodataContent"
import { type BiodataFormValues } from "@/lib/validations/biodata"

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await props.params

  const user = await prisma.user.findUnique({
    where: { username },
    include: { biodata: true }
  })

  if (!user || !user.biodata || !user.biodata.isPublic) {
    return {
      title: 'Profile Not Found | BiyeProfile',
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

  const user = await prisma.user.findUnique({
    where: { username },
    include: { biodata: true }
  })

  if (!user || !user.biodata) {
    notFound()
  }

  if (!user.biodata.isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center border">
          <h1 className="text-2xl font-bold mb-2">Profile Private</h1>
          <p className="text-gray-600">This user has made their biodata private.</p>
        </div>
      </div>
    )
  }


  const data = user.biodata.data as unknown as BiodataFormValues

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-12 px-0 sm:px-6 lg:px-8 print:py-0 print:bg-white print:px-0">
      <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none p-4 sm:p-10 print:p-0 sm:rounded-[2.5rem] border border-gray-100/50">
        <BiodataContent data={data} />

        <div className="mt-12 pt-8 border-t border-gray-100 print:hidden flex justify-center items-center px-4">
          <DownloadPDFButton />
        </div>
      </div>

      {/* Floating Sticky Download Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/60 backdrop-blur-xl border-t border-gray-100/50 sm:hidden flex justify-center z-50 print:hidden transition-all duration-300">
        <DownloadPDFButton />
      </div>

      {/* Spacer for mobile to prevent content being hidden by sticky bar */}
      <div className="h-28 sm:hidden print:hidden" />
    </div>
  )
}

