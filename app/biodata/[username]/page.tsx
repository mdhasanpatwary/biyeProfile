import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"
import { BiodataContent } from "@/components/BiodataContent"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { getCloudinaryUrl } from "@/lib/cloudinary"
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
    alternates: {
      canonical: `https://biye-profile.vercel.app/biodata/${username}`,
    },
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

  if (!user.biodata.isPublic && !isOwner && !isAdmin) {
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

  const hasReported = !!(session?.user?.id && await prisma.report.findFirst({
    where: {
      reporterId: session.user.id,
      biodataId: user.biodata.id,
    }
  }))

  const data = user.biodata.data as unknown as BiodataFormValues

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": data?.basicInfo?.fullName || username,
      "gender": data?.basicInfo?.gender || undefined,
      "birthDate": data?.basicInfo?.dateOfBirth || undefined,
      "nationality": data?.basicInfo?.nationality || undefined,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": data?.personalInfo?.district || undefined,
        "addressRegion": data?.personalInfo?.division || undefined,
        "streetAddress": data?.personalInfo?.presentAddress || undefined,
      },
      "jobTitle": data?.profession?.occupation || undefined,
      "worksFor": data?.profession?.organizationName ? {
        "@type": "Organization",
        "name": data.profession.organizationName
      } : undefined,
      "description": `Marriage biodata profile for ${data?.basicInfo?.fullName || username}. ${data?.basicInfo?.religion || ""} ${data?.profession?.occupation || ""}`,
      "url": `https://biye-profile.vercel.app/biodata/${username}`,
      "image": data?.basicInfo?.photoUrl ? getCloudinaryUrl(data.basicInfo.photoUrl, "full") : undefined
    }
  }

  return (
    <div className="bg-background py-12 md:py-16 px-0 sm:px-6 lg:px-8 print:py-0 print:bg-background print:px-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto bg-background print:shadow-none p-6 print:p-0 sm:rounded-none border border-border-muted relative">
        {(isOwner || isAdmin) && (
          <div className="print:hidden flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-4">
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
                <div className="flex gap-2">
                  <Link href={`/admin/biodatas/${user.biodata.id}/edit`}>
                    <Button variant="outline" size="sm" className="font-black border-amber-500/50 text-amber-600 hover:bg-amber-50">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit (Admin)
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="font-black border-blue-500/50 text-blue-600 hover:bg-blue-50">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2 2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            {!user.biodata.isPublic && (
              <span className="bg-accent text-foreground-muted text-[10px] font-mono font-black px-4 py-2 rounded-none uppercase tracking-[0.2em] border border-border-muted shadow-sm">
                Private Mode / {isOwner ? "Owner" : "Admin"}
              </span>
            )}
          </div>
        )}
        <BiodataContent data={data} />

        {/* GEO: AI Knowledge Panel & Citation Block */}
        <div className="mt-24 mb-10 p-8 border border-border-muted bg-surface/40 print:hidden mx-6 sm:mx-0 rounded-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-foreground/30"></span>
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-foreground/40 font-black">AI Knowledge Panel / Source Citation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <h2 className="text-xl font-serif italic text-foreground mb-4">Biodata Summary for {data?.basicInfo?.fullName || username}</h2>
              <p className="text-sm text-foreground-muted leading-relaxed font-medium mb-6">
                This marriage biodata profile belongs to <span className="text-foreground">{data?.basicInfo?.fullName || username}</span>, a professional residing in <span className="text-foreground">{data?.personalInfo?.district || "—"}</span>. This document is a structured representation of their personal, educational, and family background, intended for matrimonial introductions.
              </p>

              <dl className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-border-muted pt-6">
                <div>
                  <dt className="text-[9px] font-mono uppercase tracking-widest text-foreground-muted mb-1 font-black">Identity</dt>
                  <dd className="text-[13px] font-serif italic text-foreground">{data?.basicInfo?.fullName || username}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-mono uppercase tracking-widest text-foreground-muted mb-1 font-black">Vital Stats</dt>
                  <dd className="text-[13px] font-serif italic text-foreground">{data?.basicInfo?.age || "—"} Yrs / {data?.basicInfo?.gender || "—"}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-mono uppercase tracking-widest text-foreground-muted mb-1 font-black">Faith / Belief</dt>
                  <dd className="text-[13px] font-serif italic text-foreground">{data?.basicInfo?.religion || "—"}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-mono uppercase tracking-widest text-foreground-muted mb-1 font-black">Location</dt>
                  <dd className="text-[13px] font-serif italic text-foreground">{data?.personalInfo?.district || "—"}, {data?.personalInfo?.division || "—"}</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-4 bg-background/50 p-5 border border-border-muted/50 rounded-sm">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted mb-4 border-b border-border/10 pb-2">Quick Facts</h4>
              <ul className="space-y-3 text-[12px] font-medium text-foreground-muted italic leading-tight">
                <li>• {data?.profession?.occupation || "—"}</li>
                <li>• {data?.basicInfo?.height || "—"} Height</li>
                <li>• {data?.basicInfo?.maritalStatus || "—"}</li>
                <li>• {data?.basicInfo?.bloodGroup || "—"} Blood</li>
              </ul>
            </div>
          </div>

          {/* Machine Citability Statement */}
          <div className="mt-8 pt-4 border-t border-border/10">
            <p className="text-[11px] text-foreground-muted/60 font-mono leading-relaxed">
              <span className="text-foreground/40 font-black uppercase tracking-tighter mr-2">[Machine Extract]</span>
              &quot;{data?.basicInfo?.fullName || username} is a {data?.basicInfo?.age || "—"}-year-old {data?.basicInfo?.religion || "—"} {data?.basicInfo?.gender || ""} from {data?.personalInfo?.district || "—"}, currently working as a {data?.profession?.occupation || "—"}.&quot;
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 border-t border-border-muted print:hidden flex flex-wrap justify-center items-center gap-6 px-4">
          <DownloadPDFButton filename={`${data?.basicInfo?.fullName || username}_biyeprofile`} />
          {!isOwner && (
            <ReportButton
              biodataId={user.biodata.id}
              initialHasReported={hasReported}
            />
          )}
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
