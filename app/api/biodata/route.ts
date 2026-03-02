import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    additionalQualifications: "",
    extraFields: []
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

export async function POST() {
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
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    // Update the JSON field with the autosaved form values
    await prisma.biodata.update({
      where: { userId: session.user.id },
      data: { data: body.data }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
