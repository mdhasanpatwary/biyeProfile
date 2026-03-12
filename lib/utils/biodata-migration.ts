import { type BiodataFormValues } from "@/lib/validations/biodata"

// Migration function to handle old data structure
export function migrateBiodataData(data: Record<string, unknown>): Partial<BiodataFormValues> {
  const migrated = { ...data } as Partial<BiodataFormValues>

  // Handle old structure: photoUrl at root level -> basicInfo.photoUrl
  if (migrated.basicInfo && typeof migrated.basicInfo === 'object') {
    const basicInfo = migrated.basicInfo as Record<string, unknown>
    // If basicInfo.photoUrl is empty but root photoUrl exists, migrate it
    if (!basicInfo.photoUrl && data.photoUrl) {
      basicInfo.photoUrl = data.photoUrl as string
    }
    // Migrate other root-level fields to basicInfo if needed
    if (!basicInfo.fullName && data.fullName) {
      basicInfo.fullName = data.fullName as string
    }
    if (!basicInfo.dateOfBirth && data.dateOfBirth) {
      basicInfo.dateOfBirth = data.dateOfBirth as string
    }
    if (!basicInfo.age && data.age !== undefined) {
      basicInfo.age = data.age as number | ""
    }
    if (!basicInfo.height && data.height) {
      basicInfo.height = data.height as string
    }
    if (!basicInfo.weight && data.weight) {
      basicInfo.weight = data.weight as string
    }
    if (!basicInfo.bloodGroup && data.bloodGroup) {
      basicInfo.bloodGroup = data.bloodGroup as string
    }
    if (!basicInfo.religion && data.religion) {
      basicInfo.religion = data.religion as string
    }
    if (!basicInfo.maritalStatus && data.maritalStatus) {
      basicInfo.maritalStatus = data.maritalStatus as string
    }
    if (!basicInfo.nationality && data.nationality) {
      basicInfo.nationality = data.nationality as string
    }
  }

  // Migrate personalInfo: old address -> presentAddress/permanentAddress
  if (migrated.personalInfo && typeof migrated.personalInfo === 'object') {
    const personalInfo = migrated.personalInfo as Record<string, unknown>
    if (!personalInfo.presentAddress && data.address) {
      personalInfo.presentAddress = data.address
      personalInfo.permanentAddress = data.address
    }
  }

  // Migrate simple string fields to objects
  if (typeof migrated.education === 'string') {
    migrated.education = {
      qualifications: [{ degree: "", institution: "", passingYear: "", result: "" }],
      additionalQualifications: migrated.education as string
    }
  }
  if (typeof migrated.profession === 'string') {
    migrated.profession = {
      occupation: migrated.profession as string,
      organizationName: "",
      employmentType: "",
      monthlyIncome: "",
      workplaceLocation: "",
      extraFields: []
    }
  }
  if (typeof migrated.expectations === 'string') {
    migrated.expectations = {
      expectedAgeRange: "",
      expectedHeight: "",
      expectedEducation: "",
      expectedProfession: "",
      expectedLocation: "",
      additionalExpectations: migrated.expectations as string,
      extraFields: []
    }
  }
  if (typeof migrated.contactInfo === 'string') {
    migrated.contactInfo = {
      contactNumber: migrated.contactInfo as string,
      whatsAppNumber: "",
      emailAddress: "",
      guardianContact: "",
      extraFields: []
    }
  }

  return migrated
}
