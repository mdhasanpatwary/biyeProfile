import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanitizeDeep } from "@/lib/security/sanitize"
import { RateLimiter } from "@/lib/rateLimiter"

// 20 requests per minute
const limiter = new RateLimiter(20, 60 * 1000)

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for")
  return forwardedFor ? forwardedFor.split(",")[0] : "unknown"
}

const defaultBiodata = {
  language: "bn",
  basicInfo: {
    fullName: "",
    dateOfBirth: "",
    age: "",
    height: "",
    weight: "",
    bloodGroup: "",
    religion: "",
    maritalStatus: "",
    nationality: "Bangladeshi",
    photoUrl: "",
    extraFields: []
  },
  personalInfo: {
    presentAddress: "",
    permanentAddress: "",
    district: "",
    division: "",
    nativeVillage: "",
    complexion: "",
    physicalStatus: "",
    hobby: "",
    extraFields: []
  },
  education: {
    qualifications: [{ degree: "", institution: "", passingYear: "", result: "" }],
    additionalQualifications: ""
  },
  profession: {
    occupation: "",
    organizationName: "",
    employmentType: "",
    monthlyIncome: "",
    workplaceLocation: "",
    extraFields: []
  },
  familyInfo: {
    fatherName: "",
    fatherProfession: "",
    motherName: "",
    motherProfession: "",
    numberOfBrothers: "",
    numberOfSisters: "",
    familyStatus: "",
    extraFields: []
  },
  expectations: {
    expectedAgeRange: "",
    expectedHeight: "",
    expectedEducation: "",
    expectedProfession: "",
    expectedLocation: "",
    additionalExpectations: "",
    extraFields: []
  },
  contactInfo: {
    contactNumber: "",
    whatsAppNumber: "",
    emailAddress: "",
    guardianContact: "",
    extraFields: []
  },
  customSections: []
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const limitCheck = limiter.check(ip)

  if (!limitCheck.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
  }

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const existing = await prisma.biodata.findUnique({ where: { userId: session.user.id } })
    if (existing) {
      return NextResponse.json({ error: "Biodata already exists" }, { status: 400 })
    }

    const biodata = await prisma.biodata.create({
      data: {
        userId: session.user.id,
        data: defaultBiodata
      }
    })

    return NextResponse.json({ success: true, biodata })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const ip = getClientIp(req)
  const limitCheck = limiter.check(ip)

  if (!limitCheck.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
  }

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const sanitizedPayload = sanitizeDeep(body)

    // For autosave, we don't strictly enforce the full biodataSchema.
    // We only ensure the payload has the expected 'data' object structure.
    if (!sanitizedPayload.data || typeof sanitizedPayload.data !== 'object') {
      return NextResponse.json({ error: "Invalid payload: missing data object" }, { status: 400 })
    }

    // Try a partial parse if we want some safety, or just allow it as it's draft data.
    // The sanitizeDeep already handled HTML stripping.
    const biodataToSave = sanitizedPayload.data

    // Update the JSON field with the autosaved form values
    await prisma.biodata.update({
      where: { userId: session.user.id },
      data: { data: biodataToSave }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Biodata not found" }, { status: 404 })
    }
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
