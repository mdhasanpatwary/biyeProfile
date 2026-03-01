import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { BiodataEditor } from "@/components/BiodataEditor"
import { type BiodataFormValues } from "@/lib/validations/biodata"

export default async function EditBiodataPage() {
  const session = await auth()
  if (!session?.user?.email) return redirect("/api/auth/signin")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { biodata: true }
  })

  if (!user || !user.biodata) {
    redirect("/dashboard")
  }

  const biodataData = user.biodata.data as unknown as Partial<BiodataFormValues>

  return (
    <BiodataEditor
      initialData={biodataData}
      username={user.username!}
    />
  )
}
