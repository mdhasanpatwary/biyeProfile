import { z } from "zod"

const customFieldSchema = z.object({
  label: z.string().min(1, "Field label is required").max(100),
  value: z.string().min(1, "Field value is required").max(500),
})

const customSectionSchema = z.object({
  title: z.string().min(1, "Section title is required").max(100),
  fields: z.array(customFieldSchema).min(1, "At least one field is required"),
})

const educationQualificationSchema = z.object({
  degree: z.string().min(1, "Degree/Level is required").max(100),
  institution: z.string().min(1, "Institution is required").max(200),
  passingYear: z.union([z.number(), z.literal(""), z.string()]),
  result: z.string().optional(),
  extraFields: z.array(customFieldSchema).optional(),
})

export const biodataSchema = z.object({
  language: z.enum(["en", "bn"]),
  basicInfo: z.object({
    fullName: z.string().min(2, "Full name is required").max(100),
    photoUrl: z.string(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    age: z.union([z.number(), z.literal("")]),
    height: z.string().min(1, "Height is required").max(50),
    weight: z.string(),
    bloodGroup: z.string().min(1, "Blood group is required").max(10),
    religion: z.string().min(1, "Religion is required").max(50),
    maritalStatus: z.string().min(1, "Marital status is required").max(50),
    nationality: z.string().min(2, "Nationality is required"),
    extraFields: z.array(customFieldSchema),
  }),
  personalInfo: z.object({
    presentAddress: z.string().min(5, "Present address is required").max(500),
    permanentAddress: z.string().min(5, "Permanent address is required").max(500),
    district: z.string().min(2, "District is required").max(50),
    division: z.string(),
    nativeVillage: z.string(),
    complexion: z.string(),
    physicalStatus: z.string(),
    hobby: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  education: z.object({
    qualifications: z.array(educationQualificationSchema).min(1, "At least one qualification is required"),
    additionalQualifications: z.string(),
  }),
  profession: z.object({
    occupation: z.string().min(2, "Occupation is required").max(200),
    organizationName: z.string(),
    employmentType: z.string(),
    monthlyIncome: z.string(),
    workplaceLocation: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  familyInfo: z.object({
    fatherName: z.string().min(2, "Father's name is required").max(100),
    fatherProfession: z.string(),
    motherName: z.string().min(2, "Mother's name is required").max(100),
    motherProfession: z.string(),
    numberOfBrothers: z.union([z.number(), z.literal("")]),
    numberOfSisters: z.union([z.number(), z.literal("")]),
    familyStatus: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  expectations: z.object({
    expectedAgeRange: z.string(),
    expectedHeight: z.string(),
    expectedEducation: z.string(),
    expectedProfession: z.string(),
    expectedLocation: z.string(),
    additionalExpectations: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  contactInfo: z.object({
    contactNumber: z.string().min(10, "Valid contact number is required").max(20),
    whatsAppNumber: z.string(),
    emailAddress: z.union([z.string().email("Invalid email address"), z.literal("")]),
    guardianContact: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  customSections: z.array(customSectionSchema),
})

export type BiodataFormValues = z.infer<typeof biodataSchema>
