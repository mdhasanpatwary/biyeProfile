import { z } from "zod"

const customFieldSchema = z.object({
  label: z.string(),
  value: z.string(),
})

const customSectionSchema = z.object({
  title: z.string(),
  fields: z.array(customFieldSchema),
})

const educationQualificationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  passingYear: z.union([z.number(), z.literal(""), z.string()]),
  result: z.string().optional(),
  extraFields: z.array(customFieldSchema).optional(),
})

export const biodataSchema = z.object({
  language: z.enum(["en", "bn"]),
  basicInfo: z.object({
    fullName: z.string(),
    gender: z.enum(["Male", "Female"]).optional(),
    photoUrl: z.string(),
    dateOfBirth: z.string(),
    age: z.union([z.number(), z.literal("")]),
    height: z.string(),
    weight: z.string(),
    bloodGroup: z.string(),
    religion: z.string(),
    maritalStatus: z.string(),
    nationality: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  personalInfo: z.object({
    presentAddress: z.string(),
    permanentAddress: z.string(),
    district: z.string(),
    division: z.string(),
    nativeVillage: z.string(),
    complexion: z.string(),
    physicalStatus: z.string(),
    hobby: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  education: z.object({
    qualifications: z.array(educationQualificationSchema),
    additionalQualifications: z.string(),
  }),
  profession: z.object({
    occupation: z.string(),
    organizationName: z.string(),
    employmentType: z.string(),
    monthlyIncome: z.string(),
    workplaceLocation: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  familyInfo: z.object({
    fatherName: z.string(),
    fatherProfession: z.string(),
    motherName: z.string(),
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
    contactNumber: z.string(),
    whatsAppNumber: z.string(),
    emailAddress: z.union([z.string().email("Invalid email address"), z.literal("")]),
    guardianContact: z.string(),
    extraFields: z.array(customFieldSchema),
  }),
  customSections: z.array(customSectionSchema),
})

export type BiodataFormValues = z.infer<typeof biodataSchema>
