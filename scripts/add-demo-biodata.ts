import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import * as dotenv from "dotenv"

dotenv.config()

const url = new URL(process.env.DATABASE_URL!)
url.search = ""

const pool = new Pool({
  connectionString: url.toString(),
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 15000,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Adding demo 100% completed biodata...")

  const demoEmail = "demo@example.com"
  
  // 1. Create or get demo user
  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      name: "Demo User",
      username: "demouser",
      role: "user",
    },
  })

  console.log(`User created/found: ${user.id}`)

  // 2. Prepare 100% complete biodata
  // Based on computeStrength in components/ProfileStrengthMeter.tsx:
  // - Basic Info: 7 fields (fullName, photoUrl, dateOfBirth, height, religion, maritalStatus, bloodGroup)
  // - Personal Info: 5 fields (presentAddress, district, division, hobby, complexion)
  // - Education: at least 1 qualification
  // - Profession: 3 fields (occupation, monthlyIncome, employmentType)
  // - Family Info: 5 fields (fatherName, motherName, familyStatus, numberOfBrothers, numberOfSisters)
  // - Expectations: 4 fields (expectedAgeRange, expectedEducation, expectedProfession, additionalExpectations)
  // - Contact Info: 2 fields (contactNumber, whatsAppNumber)
  // - Custom Sections: at least 1 section

  const biodataData = {
    language: "en",
    basicInfo: {
      fullName: "Demo User",
      photoUrl: "https://res.cloudinary.com/demo/image/upload/v1612345678/sample.jpg",
      dateOfBirth: "1995-01-01",
      age: 31,
      height: "5'10\"",
      weight: "75 kg",
      bloodGroup: "O+",
      religion: "Islam",
      maritalStatus: "Single",
      nationality: "Bangladeshi",
      extraFields: []
    },
    personalInfo: {
      presentAddress: "123 Demo Street, Dhaka",
      permanentAddress: "456 Demo Road, Chittagong",
      district: "Dhaka",
      division: "Dhaka",
      nativeVillage: "Demo Village",
      complexion: "Fair",
      physicalStatus: "Healthy",
      hobby: "Reading, Coding",
      extraFields: []
    },
    education: {
      qualifications: [
        {
          degree: "B.Sc in Computer Science",
          institution: "Demo University",
          passingYear: 2017,
          result: "3.80",
          extraFields: []
        }
      ],
      additionalQualifications: "Web Development Certification"
    },
    profession: {
      occupation: "Software Engineer",
      organizationName: "Demo Tech Solutions",
      employmentType: "Full-time",
      monthlyIncome: "80,000 BDT",
      workplaceLocation: "Gulshan, Dhaka",
      extraFields: []
    },
    familyInfo: {
      fatherName: "John Doe Senior",
      fatherProfession: "Retired Teacher",
      motherName: "Jane Doe Senior",
      motherProfession: "Homemaker",
      numberOfBrothers: 1,
      numberOfSisters: 1,
      familyStatus: "Middle Class",
      extraFields: []
    },
    expectations: {
      expectedAgeRange: "22-26",
      expectedHeight: "5'2\" - 5'6\"",
      expectedEducation: "Bachelor's Degree",
      expectedProfession: "Any",
      expectedLocation: "Dhaka",
      additionalExpectations: "Religious and polite",
      extraFields: []
    },
    contactInfo: {
      contactNumber: "01712345678",
      whatsAppNumber: "01712345678",
      emailAddress: "demo@example.com",
      guardianContact: "01812345678",
      extraFields: []
    },
    customSections: [
      {
        title: "Other Information",
        fields: [
          { label: "References", value: "Available upon request" }
        ]
      }
    ]
  }

  // 3. Upsert biodata
  await prisma.biodata.upsert({
    where: { userId: user.id },
    update: {
      data: biodataData,
      isPublic: true,
    },
    create: {
      userId: user.id,
      data: biodataData,
      isPublic: true,
      language: "en",
    },
  })

  console.log(`Biodata created/updated for user: ${user.id}`)
  console.log("Process completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
