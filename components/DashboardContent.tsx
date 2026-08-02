"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/CopyButton"
import { VisibilityToggle } from "@/components/VisibilityToggle"
import { ProfileStrengthMeter } from "@/components/ProfileStrengthMeter"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { getCloudinaryUrl } from "@/lib/cloudinary"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/LanguageContext"

interface DashboardContentProps {
  username: string
  publicUrl: string
  isPublic: boolean
  biodataContent: Partial<BiodataFormValues>
}

export function DashboardContent({
  username,
  publicUrl,
  isPublic,
  biodataContent,
}: DashboardContentProps) {
  const { t, language } = useLanguage()

  const calcAge = () => {
    if (!biodataContent.basicInfo?.dateOfBirth) return null
    const birthDate = new Date(biodataContent.basicInfo.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    return `${age} ${language === "bn" ? "বছর" : "Years"}`
  }

  const ageText = calcAge()

  return (
    <Container className="max-w-5xl py-6 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-muted pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-serif text-foreground mb-4 tracking-tighter text-center md:text-left">
            {t.dashboard.title}
          </h1>
          <p className="text-foreground-muted font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-black text-center md:text-left">
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/biodata/${username}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full px-8">
              {t.common.viewBiodata}
            </Button>
          </Link>
          <Link href="/dashboard/edit" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full px-8 flex items-center justify-center">
              {t.common.editBiodata}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details Card */}
        <Card className="md:col-span-2 p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <Avatar
              src={biodataContent.basicInfo?.photoUrl ? getCloudinaryUrl(biodataContent.basicInfo.photoUrl, "thumb") : undefined}
              alt={biodataContent.basicInfo?.fullName || "User"}
              className="w-32 h-32 rounded-none grayscale transition-transform duration-500 hover:scale-105"
              fallback={
                <svg className="w-16 h-16 text-foreground-muted/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              }
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-4xl font-serif text-foreground mb-4 italic tracking-tight">
                {biodataContent.basicInfo?.fullName || username}
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-8">
                {[
                  ageText,
                  biodataContent.basicInfo?.height,
                  biodataContent.basicInfo?.maritalStatus,
                ].filter(Boolean).map((stat, i) => (
                  <Badge key={i} variant="outline" className="text-foreground-muted font-mono text-[10px] uppercase tracking-[0.3em] font-black px-5 py-3">
                    {stat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-accent/30 border border-border-muted rounded-none flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-mono text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] mb-4">
                {language === "bn" ? "বায়োডাটা লিঙ্ক" : "Public Access"}
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground border-b-2 border-border-muted pb-1 font-mono tracking-tight break-all">
                {publicUrl}
              </span>
            </div>
            <CopyButton text={`https://${publicUrl}`} />
          </div>
        </Card>

        {/* Visibility & Insights */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="font-mono text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] block mb-4 px-6 pt-6">
              {language === "bn" ? "প্রোফাইল স্ট্যাটাস" : "Profile Control"}
            </span>
            <VisibilityToggle initialIsPublic={isPublic} />
          </div>

          <ProfileStrengthMeter data={biodataContent} />
        </div>
      </div>
    </Container>
  )
}
