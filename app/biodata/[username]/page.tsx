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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-background p-10 rounded-none shadow-2xl text-center border border-border-muted max-w-md mx-6">
          <div className="w-16 h-16 bg-accent rounded-none border border-border-muted flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-foreground mb-4 italic tracking-tight">Access Restricted.</h1>
          <p className="text-foreground-muted font-medium mb-0">This profile is currently set to private by the owner.</p>
        </div>
      </div>
    )
  }

  const data = user.biodata.data as unknown as BiodataFormValues

  return (
    <div className="bg-background py-10 md:py-16 px-0 sm:px-6 lg:px-8 print:py-0 print:bg-background print:px-0">
      <div className="max-w-4xl mx-auto bg-background print:shadow-none p-8 md:p-12 print:p-0 sm:rounded-none border border-border-muted relative">
        {isOwner && !user.biodata.isPublic && (
          <div className="absolute top-8 right-8 print:hidden">
            <span className="bg-accent text-foreground-muted text-[10px] font-mono font-black px-4 py-2 rounded-none uppercase tracking-[0.2em] border border-border-muted shadow-sm">
              Archive Mode / Owner
            </span>
          </div>
        )}
        <BiodataContent data={data} />

        <div className="mt-12 md:mt-12 pt-10 md:pt-12 border-t border-border-muted print:hidden flex justify-center items-center px-4">
          <DownloadPDFButton filename={`${data?.basicInfo?.fullName || username}_biyeprofile`} />
        </div>
      </div>

      {/* Floating Sticky Download Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border-muted sm:hidden flex justify-center z-50 print:hidden transition-all duration-300">
        <DownloadPDFButton filename={`${data?.basicInfo?.fullName || username}_biyeprofile`} />
      </div>

      {/* Spacer for mobile to prevent content being hidden by sticky bar */}
      <div className="h-24 sm:hidden print:hidden" />
    </div>
  )
}

