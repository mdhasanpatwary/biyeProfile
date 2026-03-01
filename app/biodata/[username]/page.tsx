import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"
import { ReportButton } from "@/components/ReportButton"
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

  if (user.biodata.isReported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center border">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Under Review</h1>
          <p className="text-gray-600">This profile is currently under review by administrators.</p>
        </div>
      </div>
    )
  }

  const data = user.biodata.data as unknown as BiodataFormValues

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 print:py-0 print:bg-white print:px-0">
      <div className="max-w-3xl mx-auto bg-white shadow-lg print:shadow-none p-10 print:p-0">
        <BiodataContent data={data} />

        <div className="mt-12 pt-8 border-t print:hidden flex justify-between items-center">
          <ReportButton username={user.username!} />
          <DownloadPDFButton />
        </div>
      </div>
    </div>
  )
}
