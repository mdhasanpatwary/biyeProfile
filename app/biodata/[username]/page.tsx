import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"
import { BiodataContent } from "@/components/BiodataContent"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ReportButton } from "@/components/ReportButton"

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
  const religion = data?.basicInfo?.religion
  const occupation = data?.profession?.occupation
  const descParts = [religion, occupation].filter(Boolean).join(" · ")

  return {
    title: `${name}'s Marriage Biodata | BiyeProfile`,
    description: `View ${name}'s complete marriage biodata on BiyeProfile.${descParts ? ` ${descParts}.` : ""}`,
    robots: { index: true, follow: true },
    openGraph: {
      type: "profile",
      title: `${name} — Marriage Biodata`,
      description: `View ${name}'s complete marriage biodata on BiyeProfile.${descParts ? ` ${descParts}.` : ""}`,
      url: `https://biyeprofile.com/biodata/${username}`,
      siteName: "BiyeProfile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Marriage Biodata`,
      description: `View ${name}'s complete marriage biodata on BiyeProfile.${descParts ? ` ${descParts}.` : ""}`,
    },
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
  const isAdmin = session?.user?.role === "admin"

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
    <div className="bg-background py-12 md:py-16 px-0 sm:px-6 lg:px-8 print:py-0 print:bg-background print:px-0">
      <div className="max-w-4xl mx-auto bg-background print:shadow-none p-6 print:p-0 sm:rounded-none border border-border-muted relative">
        {(isOwner || isAdmin) && (
          <div className="print:hidden flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex gap-4">
              {isOwner && (
                <Link href="/dashboard/edit">
                  <Button variant="outline" size="sm" className="font-black">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Biodata
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="font-black border-blue-500/50 text-blue-600 hover:bg-blue-50">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Admin Menu
                  </Button>
                </Link>
              )}
            </div>
            {!user.biodata.isPublic && (
              <span className="bg-accent text-foreground-muted text-[10px] font-mono font-black px-4 py-2 rounded-none uppercase tracking-[0.2em] border border-border-muted shadow-sm">
                Archive Mode / {isOwner ? "Owner" : "Admin"}
              </span>
            )}
          </div>
        )}
        <BiodataContent data={data} />

        <div className="mt-8 md:mt-12 pt-6 border-t border-border-muted print:hidden flex flex-wrap justify-center items-center gap-6 px-4">
          <DownloadPDFButton filename={`${data?.basicInfo?.fullName || username}_biyeprofile`} />
          {!isOwner && <ReportButton biodataId={user.biodata.id} />}
        </div>
      </div>

      {/* Floating Sticky Download Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border-muted sm:hidden flex items-center justify-center gap-3 z-50 print:hidden transition-all duration-300">
        {isOwner && (
          <Link href="/dashboard/edit" className="flex-1">
            <Button variant="outline" size="lg" className="w-full text-[10px] sm:text-[12px]">
              Edit
            </Button>
          </Link>
        )}
        <div className={isOwner ? "flex-1" : "w-full flex justify-center"}>
          <DownloadPDFButton filename={`${data?.basicInfo?.fullName || username}_biyeprofile`} />
        </div>
      </div>
    </div>
  )
}
