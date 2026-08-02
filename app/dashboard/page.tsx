import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { CreateBiodataButton } from "@/components/CreateBiodataButton"
import { DashboardContent } from "@/components/DashboardContent"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"

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
            <div className="md:w-1/2 p-12 bg-foreground text-background flex flex-col justify-center">
              <div className="w-12 h-12 bg-background/10 rounded-none border border-background/10 flex items-center justify-center mb-10">
                <svg className="w-6 h-6 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-4xl font-serif mb-6 tracking-tight italic">The Registry.</h2>
              <p className="text-background/40 text-lg leading-relaxed mb-0 font-medium">
                Your journey to finding a meaningful connection starts with a refined, professional document.
              </p>
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center items-start bg-background">
              <div className="space-y-10 mb-12 w-full">
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
  const headersList = await headers()
  const host = headersList.get("host") || "biye-profile.vercel.app"
  const publicUrl = `${host}/biodata/${session.user.username}`
  const biodataContent = user.biodata.data as unknown as Partial<BiodataFormValues>

  return (
    <DashboardContent
      username={session.user.username!}
      publicUrl={publicUrl}
      isPublic={user.biodata.isPublic}
      biodataContent={biodataContent}
    />
  )
}
