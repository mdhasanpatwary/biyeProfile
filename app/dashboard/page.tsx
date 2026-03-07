import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreateBiodataButton } from "@/components/CreateBiodataButton"
import { CopyButton } from "@/components/CopyButton"
import { VisibilityToggle } from "@/components/VisibilityToggle"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { getCloudinaryUrl } from "@/lib/cloudinary"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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
      <Container className="max-w-4xl my-10">
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-10 bg-foreground text-background flex flex-col justify-center">
              <div className="w-12 h-12 bg-background/10 rounded-none border border-background/10 flex items-center justify-center mb-8">
                <svg className="w-6 h-6 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-4xl font-serif mb-6 tracking-tight italic">The Registry.</h2>
              <p className="text-background/40 text-lg leading-relaxed mb-0 font-medium">
                Your journey to finding a meaningful connection starts with a refined, professional document.
              </p>
            </div>
            <div className="md:w-1/2 p-10 flex flex-col justify-center items-start bg-background">
              <div className="space-y-8 mb-10 w-full">
                <div className="flex items-start gap-4 pb-8 border-b border-border-muted w-full">
                  <div className="w-5 h-5 rounded-none bg-foreground text-background flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 010 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted mb-2 font-black">Standard</p>
                    <p className="text-[17px] font-bold text-foreground font-serif italic">Editorial Design</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 w-full">
                  <div className="w-5 h-5 rounded-none bg-foreground text-background flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 010 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted mb-2 font-black">Utility</p>
                    <p className="text-[17px] font-bold text-foreground font-serif italic">Instant PDF Generation</p>
                  </div>
                </div>
              </div>
              <CreateBiodataButton />
            </div>
          </div>
        </Card>
      </Container>
    )
  }

  // If biodata exists, show the summary dashboard
  const publicUrl = `biyeprofile.com/biodata/${session.user.username}`
  const biodataContent = user.biodata.data as unknown as Partial<BiodataFormValues>

  return (
    <Container className="max-w-5xl py-10 md:py-10 space-y-8 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border-muted pb-8 md:pb-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-3 tracking-tighter text-center md:text-left">My Dashboard</h1>
          <p className="text-foreground-muted font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-black text-center md:text-left">Manage your private documentation</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/biodata/${session.user.username}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full px-8">View Profile</Button>
          </Link>
          <Link href="/dashboard/edit" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full px-8 flex items-center justify-center gap-2">Edit Biodata</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-10">
        {/* Profile Details Card */}
        <Card className="md:col-span-2 p-6 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-10">
            <Avatar
              src={biodataContent.basicInfo?.photoUrl ? getCloudinaryUrl(biodataContent.basicInfo.photoUrl, "thumb") : undefined}
              alt={biodataContent.basicInfo?.fullName || "User"}
              className="w-32 h-32 rounded-none grayscale transition-transform duration-500 hover:scale-105"
              fallback={
                <svg className="w-16 h-16 text-foreground-muted/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              }
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-4xl font-serif text-foreground mb-3 italic tracking-tight">{biodataContent.basicInfo?.fullName}</h2>
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
                  <Badge key={i} variant="outline" className="text-foreground-muted font-mono text-[10px] uppercase tracking-[0.3em] font-black px-5 py-3">
                    {stat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-10 p-6 sm:p-10 bg-accent/30 border border-border-muted rounded-none flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-mono text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] mb-3">Public Access</span>
              <span className="text-xs sm:text-sm font-bold text-foreground border-b-2 border-border-muted pb-1 font-mono tracking-tight break-all">{publicUrl}</span>
            </div>
            <CopyButton text={`https://${publicUrl}`} />
          </div>
        </Card>

        {/* Visibility & Insights */}
        <div className="flex flex-col gap-10">
          <Card className="p-8 sm:p-10">
            <span className="font-mono text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] block mb-6">Profile Control</span>
            <VisibilityToggle initialIsPublic={user.biodata.isPublic} />
          </Card>

          <Card className="bg-accent/40 border-border-muted p-8 sm:p-10 flex flex-col justify-between group h-full hover:bg-accent/60 transition-colors">
            <div>
              <div className="w-12 h-12 bg-foreground/5 rounded-none border border-foreground/5 flex items-center justify-center mb-10 mx-auto md:mx-0">
                <svg className="w-6 h-6 text-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-4xl md:text-6xl font-serif mb-3 leading-none italic tracking-tighter text-foreground text-center md:text-left">Soon</h3>
              <p className="text-foreground-muted font-mono text-[11px] uppercase tracking-[0.4em] font-black text-center md:text-left">Analytics</p>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
