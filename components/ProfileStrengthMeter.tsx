"use client"

import Link from "next/link"
import { type BiodataFormValues } from "@/lib/validations/biodata"

interface Section {
  label: string
  score: number
  max: number
}

function computeStrength(data: Partial<BiodataFormValues>): { sections: Section[]; total: number; max: number } {
  const sections: Section[] = [
    {
      label: "Basic Info",
      score: [
        data.basicInfo?.fullName,
        data.basicInfo?.photoUrl,
        data.basicInfo?.dateOfBirth,
        data.basicInfo?.height,
        data.basicInfo?.religion,
        data.basicInfo?.maritalStatus,
        data.basicInfo?.bloodGroup,
      ].filter(Boolean).length,
      max: 7,
    },
    {
      label: "Personal Info",
      score: [
        data.personalInfo?.presentAddress,
        data.personalInfo?.district,
        data.personalInfo?.division,
        data.personalInfo?.hobby,
        data.personalInfo?.complexion,
      ].filter(Boolean).length,
      max: 5,
    },
    {
      label: "Education",
      score: (data.education?.qualifications?.length ?? 0) > 0 ? 3 : 0,
      max: 3,
    },
    {
      label: "Profession",
      score: [
        data.profession?.occupation,
        data.profession?.monthlyIncome,
        data.profession?.employmentType,
      ].filter(Boolean).length,
      max: 3,
    },
    {
      label: "Family Info",
      score: [
        data.familyInfo?.fatherName,
        data.familyInfo?.motherName,
        data.familyInfo?.familyStatus,
        data.familyInfo?.numberOfBrothers !== "" ? data.familyInfo?.numberOfBrothers : null,
        data.familyInfo?.numberOfSisters !== "" ? data.familyInfo?.numberOfSisters : null,
      ].filter((v) => v != null && v !== "").length,
      max: 5,
    },
    {
      label: "Expectations",
      score: [
        data.expectations?.expectedAgeRange,
        data.expectations?.expectedEducation,
        data.expectations?.expectedProfession,
        data.expectations?.additionalExpectations,
      ].filter(Boolean).length,
      max: 4,
    },
    {
      label: "Contact Info",
      score: [
        data.contactInfo?.contactNumber,
        data.contactInfo?.whatsAppNumber,
      ].filter(Boolean).length,
      max: 2,
    },
    {
      label: "Custom Sections",
      score: (data.customSections?.length ?? 0) > 0 ? 1 : 0,
      max: 1,
    },
  ]

  const total = sections.reduce((sum, s) => sum + s.score, 0)
  const max = sections.reduce((sum, s) => sum + s.max, 0)
  return { sections, total, max }
}

function getLabel(pct: number): { text: string; color: string } {
  if (pct >= 90) return { text: "Excellent", color: "#16a34a" }
  if (pct >= 70) return { text: "Good", color: "#2563eb" }
  if (pct >= 50) return { text: "Fair", color: "#d97706" }
  return { text: "Incomplete", color: "#dc2626" }
}

export function ProfileStrengthMeter({ data }: { data: Partial<BiodataFormValues> }) {
  const { sections, total, max } = computeStrength(data)
  const pct = Math.round((total / max) * 100)
  const { text: label, color } = getLabel(pct)

  return (
    <div className="p-6 border border-border-muted bg-background flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em]">
          Profile Strength
        </span>
        <Link
          href="/dashboard/edit"
          className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted border-b border-border-muted pb-0.5 hover:text-foreground hover:border-foreground transition-all"
        >
          Improve →
        </Link>
      </div>

      {/* Score + Label */}
      <div className="flex items-end gap-3">
        <span className="text-5xl font-serif tracking-tight" style={{ color }}>
          {pct}
          <span className="text-2xl">%</span>
        </span>
        <span
          className="font-mono text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ color }}
        >
          {label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-border-muted/40 overflow-hidden">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      {/* Section breakdown */}
      <div className="space-y-2 pt-2">
        {sections.map((s) => {
          const sPct = s.max > 0 ? (s.score / s.max) * 100 : 0
          const complete = s.score >= s.max
          return (
            <div key={s.label} className="flex items-center gap-3">
              {/* Dot indicator */}
              <div
                className="w-1.5 h-1.5 shrink-0"
                style={{ background: complete ? "#16a34a" : sPct > 0 ? "#d97706" : "#e5e7eb" }}
              />
              <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                <span className="font-mono text-[10px] text-foreground-muted truncate">
                  {s.label}
                </span>
                <span className="font-mono text-[10px] font-black text-foreground-muted shrink-0">
                  {s.score}/{s.max}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
