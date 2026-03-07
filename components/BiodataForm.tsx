"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { biodataSchema, type BiodataFormValues } from "@/lib/validations/biodata"
import { useEffect, useState, useCallback, useRef } from "react"
import { FileUpload } from "@/components/ui/file-upload"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { StepWizard } from "@/components/ui/step-wizard"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<T extends (...args: any[]) => any>(cb: T, delay: number) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useCallback((...args: any[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      cb(...args);
    }, delay);
  }, [cb, delay]);
}

const HEIGHT_OPTIONS = Array.from({ length: 20 }, (_, i) => {
  const inches = 58 + i; // 4'10" is 58 inches
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
});

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const COMPLEXION_OPTIONS = ["Fair", "Medium", "Dark"];
const EMPLOYMENT_TYPES = ["Private", "Govt", "Business", "Freelancer", "Other"];
const FAMILY_STATUS_OPTIONS = ["Nuclear Family", "Joint Family", "Middle Class", "Upper Middle Class", "Affluent"];
const MARITAL_STATUS_OPTIONS = ["Unmarried", "Divorced", "Widow/Widower"];

export function BiodataForm({
  initialData,
  onDataChange,
  language: externalLanguage,
  mobileView,
  onViewChange,
  isGuest = false,
}: {
  initialData: Partial<BiodataFormValues>,
  onDataChange?: (data: BiodataFormValues) => void,
  language?: "en" | "bn",
  mobileView?: "edit" | "preview",
  onViewChange?: (view: "edit" | "preview") => void,
  isGuest?: boolean,
}) {
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { title: "Basic", icon: "👤" },
    { title: "Personal", icon: "🏠" },
    { title: "Education", icon: "📚" },
    { title: "Profession", icon: "💼" },
    { title: "Family", icon: "👨‍👩‍👧‍👦" },
    { title: "Expectations", icon: "💍" },
    { title: "Contact", icon: "📞" },
    { title: "Custom", icon: "➕" }
  ]

  const form = useForm<BiodataFormValues>({
    resolver: zodResolver(biodataSchema),
    defaultValues: {
      language: initialData?.language || "en",
      basicInfo: {
        fullName: initialData?.basicInfo?.fullName || "",
        dateOfBirth: initialData?.basicInfo?.dateOfBirth || "",
        age: initialData?.basicInfo?.age || "",
        height: initialData?.basicInfo?.height || "",
        weight: initialData?.basicInfo?.weight || "",
        bloodGroup: initialData?.basicInfo?.bloodGroup || "",
        religion: initialData?.basicInfo?.religion || "",
        maritalStatus: initialData?.basicInfo?.maritalStatus || "",
        nationality: initialData?.basicInfo?.nationality || "Bangladeshi",
        photoUrl: initialData?.basicInfo?.photoUrl || "",
        extraFields: initialData?.basicInfo?.extraFields || [],
      },
      personalInfo: {
        presentAddress: initialData?.personalInfo?.presentAddress || "",
        permanentAddress: initialData?.personalInfo?.permanentAddress || "",
        district: initialData?.personalInfo?.district || "",
        division: initialData?.personalInfo?.division || "",
        nativeVillage: initialData?.personalInfo?.nativeVillage || "",
        complexion: initialData?.personalInfo?.complexion || "",
        physicalStatus: initialData?.personalInfo?.physicalStatus || "",
        hobby: initialData?.personalInfo?.hobby || "",
        extraFields: initialData?.personalInfo?.extraFields || [],
      },
      education: {
        qualifications: initialData?.education?.qualifications || [
          { degree: "", institution: "", passingYear: "", result: "" }
        ],
        additionalQualifications: initialData?.education?.additionalQualifications || "",
        extraFields: initialData?.education?.extraFields || [],
      },
      profession: {
        occupation: initialData?.profession?.occupation || "",
        organizationName: initialData?.profession?.organizationName || "",
        employmentType: initialData?.profession?.employmentType || "",
        monthlyIncome: initialData?.profession?.monthlyIncome || "",
        workplaceLocation: initialData?.profession?.workplaceLocation || "",
        extraFields: initialData?.profession?.extraFields || [],
      },
      familyInfo: {
        fatherName: initialData?.familyInfo?.fatherName || "",
        fatherProfession: initialData?.familyInfo?.fatherProfession || "",
        motherName: initialData?.familyInfo?.motherName || "",
        motherProfession: initialData?.familyInfo?.motherProfession || "",
        numberOfBrothers: initialData?.familyInfo?.numberOfBrothers || "",
        numberOfSisters: initialData?.familyInfo?.numberOfSisters || "",
        familyStatus: initialData?.familyInfo?.familyStatus || "",
        extraFields: initialData?.familyInfo?.extraFields || [],
      },
      expectations: {
        expectedAgeRange: initialData?.expectations?.expectedAgeRange || "",
        expectedHeight: initialData?.expectations?.expectedHeight || "",
        expectedEducation: initialData?.expectations?.expectedEducation || "",
        expectedProfession: initialData?.expectations?.expectedProfession || "",
        expectedLocation: initialData?.expectations?.expectedLocation || "",
        additionalExpectations: initialData?.expectations?.additionalExpectations || "",
        extraFields: initialData?.expectations?.extraFields || [],
      },
      contactInfo: {
        contactNumber: initialData?.contactInfo?.contactNumber || "",
        whatsAppNumber: initialData?.contactInfo?.whatsAppNumber || "",
        emailAddress: initialData?.contactInfo?.emailAddress || "",
        guardianContact: initialData?.contactInfo?.guardianContact || "",
        extraFields: initialData?.contactInfo?.extraFields || [],
      },
      customSections: initialData?.customSections || [],
    }
  })

  // Age calculation
  const dob = form.watch("basicInfo.dateOfBirth");
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      form.setValue("basicInfo.age", age);
    }
  }, [dob, form]);

  // Field arrays for sections
  useFieldArray({
    control: form.control,
    name: "basicInfo.extraFields"
  })

  const { fields: customSectionsFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "customSections"
  })

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "education.qualifications"
  })


  // Conditional autosave — DISABLED for guest mode
  const debouncedSave = useDebounce(async (data: BiodataFormValues) => {
    if (isGuest) return; // Skip API save in guest mode
    try {
      const res = await fetch("/api/biodata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      })
      if (res.ok) {
        toast.success("Changes autosaved", { duration: 1500 })
      }
    } catch (error) {
      console.error("Autosave failed:", error);
    }
  }, 2000)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((value) => {
      onDataChange?.(value as BiodataFormValues)
      debouncedSave(value as BiodataFormValues)
    })
    return () => subscription.unsubscribe()
  }, [form, debouncedSave, onDataChange])

  // Sync external language change
  useEffect(() => {
    if (externalLanguage) {
      form.setValue("language", externalLanguage as "en" | "bn");
    }
  }, [externalLanguage, form]);


  const lang = form.watch("language");

  return (
    <div className="relative">

      <div className="flex items-center justify-between gap-3 mb-16 bg-background/90 backdrop-blur-md p-4 border-b border-border sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <Button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            variant="outline"
            size="icon"
            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 hover:border-foreground group mt-1"
          >
            <svg className="min-w-3.5 w-3.5 h-3.5 group-enabled:group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </Button>

          <StepWizard
            steps={steps.map(s => ({ id: s.title, label: s.title }))}
            currentStep={currentStep}
            className="flex-1 mb-0 pb-0"
          />

          <Button
            type="button"
            disabled={currentStep === steps.length}
            onClick={() => setCurrentStep(prev => prev + 1)}
            variant="outline"
            size="icon"
            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 hover:border-foreground group relative z-10 mt-1"
          >
            <svg className="min-w-3.5 w-3.5 h-3.5 group-enabled:group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-12 pb-20">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-border-muted pb-12 mb-16">
              <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 01</p>
              <CardTitle className="text-5xl font-serif text-foreground italic">
                {lang === 'en' ? 'Basic Information' : 'প্রাথমিক তথ্য'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2 mb-4">
                  <FormField label="Profile Photo (Optional)">
                    <FileUpload
                      value={form.watch("basicInfo.photoUrl") || ""}
                      onChange={(url: string) => form.setValue("basicInfo.photoUrl", url)}
                    />
                  </FormField>
                </div>

                <FormField label="Full Name" error={form.formState.errors.basicInfo?.fullName?.message}>
                  <Input type="text" {...form.register("basicInfo.fullName")} placeholder="e.g. John Doe" className="block w-full" />
                </FormField>

                <FormField label="Date of Birth" error={form.formState.errors.basicInfo?.dateOfBirth?.message}>
                  <Input type="date" {...form.register("basicInfo.dateOfBirth")} placeholder="e.g. 1995-08-25" className="block w-full" />
                </FormField>

                <FormField label="Age (Auto Calculated)">
                  <Input type="number" readOnly {...form.register("basicInfo.age")} placeholder="e.g. 28" className="block w-full rounded-none border-border-muted bg-accent shadow-sm md:text-sm p-4 border text-foreground/40 cursor-not-allowed outline-none font-medium placeholder:text-foreground/30" />
                </FormField>

                <FormField label="Height" error={form.formState.errors.basicInfo?.height?.message}>
                  <Select {...form.register("basicInfo.height")} className="cursor-pointer">
                    <option value="">Select Height</option>
                    {HEIGHT_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                  </Select>
                </FormField>

                <FormField label="Weight (Optional)">
                  <Input type="text" {...form.register("basicInfo.weight")} placeholder="e.g. 70kg / 154 lbs" className="block w-full" />
                </FormField>

                <FormField label="Blood Group" error={form.formState.errors.basicInfo?.bloodGroup?.message}>
                  <Select {...form.register("basicInfo.bloodGroup")} className="cursor-pointer">
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </Select>
                </FormField>

                <FormField label="Religion" error={form.formState.errors.basicInfo?.religion?.message}>
                  <Input type="text" {...form.register("basicInfo.religion")} placeholder="e.g. Islam / Hinduism" className="block w-full" />
                </FormField>

                <FormField label="Marital Status" error={form.formState.errors.basicInfo?.maritalStatus?.message}>
                  <Select {...form.register("basicInfo.maritalStatus")} className="cursor-pointer">
                    <option value="">Select Status</option>
                    {MARITAL_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                  </Select>
                </FormField>

                <FormField label="Nationality">
                  <Input type="text" {...form.register("basicInfo.nationality")} placeholder="e.g. Bangladeshi / American" className="block w-full" />
                </FormField>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal Information */}
        {currentStep === 2 && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-border-muted pb-12 mb-16">
              <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 02</p>
              <CardTitle className="text-5xl font-serif text-foreground italic">
                {lang === 'en' ? 'Personal Information' : 'ব্যক্তিগত তথ্য'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField label="Present Address" error={form.formState.errors.personalInfo?.presentAddress?.message}>
                    <Textarea {...form.register("personalInfo.presentAddress")} placeholder="e.g. House 12, Road 4, Banani, Dhaka" rows={3} className="block w-full" />
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField label="Permanent Address" error={form.formState.errors.personalInfo?.permanentAddress?.message}>
                    <Textarea {...form.register("personalInfo.permanentAddress")} placeholder="e.g. Village Name, Thana, District" rows={3} className="block w-full" />
                  </FormField>
                </div>

                <FormField label="District" error={form.formState.errors.personalInfo?.district?.message}>
                  <Input type="text" {...form.register("personalInfo.district")} placeholder="e.g. Dhaka / Sylhet" className="block w-full" />
                </FormField>

                <FormField label="Division (Optional)">
                  <Input type="text" {...form.register("personalInfo.division")} placeholder="e.g. Dhaka Division" className="block w-full" />
                </FormField>

                <FormField label="Native Village (Optional)">
                  <Input type="text" {...form.register("personalInfo.nativeVillage")} placeholder="e.g. Your Ancestral Village" className="block w-full" />
                </FormField>

                <FormField label="Complexion (Optional)">
                  <Select {...form.register("personalInfo.complexion")} className="cursor-pointer">
                    <option value="">Select Complexion</option>
                    {COMPLEXION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </FormField>

                <FormField label="Physical Status (Optional)">
                  <Input type="text" {...form.register("personalInfo.physicalStatus")} placeholder="e.g. Completely Healthy" className="block w-full" />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Hobby / Interests (Optional)">
                    <Textarea {...form.register("personalInfo.hobby")} placeholder="e.g. Reading, Traveling, Photography" rows={2} className="block w-full" />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Education Information */}
        {currentStep === 3 && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-border-muted pb-12 mb-16">
              <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 03</p>
              <CardTitle className="text-5xl font-serif text-foreground italic">
                {lang === 'en' ? 'Education Information' : 'শিক্ষাগত তথ্য'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-8">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="p-6 rounded-none bg-accent/50 border border-border-muted relative group/edu">
                    {educationFields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-background text-foreground-muted rounded-none shadow-md border border-border-muted flex items-center justify-center opacity-0 group-hover/edu:opacity-100 transition-all hover:bg-accent z-10"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </Button>
                    )}

                    <div className="grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <FormField label="Degree / Level" error={form.formState.errors.education?.qualifications?.[index]?.degree?.message}>
                          <Input
                            type="text"
                            {...form.register(`education.qualifications.${index}.degree` as const)}
                            placeholder="e.g. SSC / Graduation"
                            className="block w-full"
                          />
                        </FormField>
                      </div>

                      <div className="sm:col-span-1">
                        <FormField label="Passing Year" error={form.formState.errors.education?.qualifications?.[index]?.passingYear?.message}>
                          <Input
                            type="text"
                            {...form.register(`education.qualifications.${index}.passingYear` as const)}
                            placeholder="e.g. 2018"
                            className="block w-full"
                          />
                        </FormField>
                      </div>

                      <div className="sm:col-span-2">
                        <FormField label="Institution Name" error={form.formState.errors.education?.qualifications?.[index]?.institution?.message}>
                          <Input
                            type="text"
                            {...form.register(`education.qualifications.${index}.institution` as const)}
                            placeholder="e.g. Dhaka University"
                            className="block w-full"
                          />
                        </FormField>
                      </div>

                      <div className="sm:col-span-2">
                        <FormField label="Result (Optional)" error={form.formState.errors.education?.qualifications?.[index]?.result?.message}>
                          <Input
                            type="text"
                            {...form.register(`education.qualifications.${index}.result` as const)}
                            placeholder="e.g. GPA 5.00 / 1st Class"
                            className="block w-full"
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() => appendEducation({ degree: "", institution: "", passingYear: "", result: "" })}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 group border-dashed"
                >
                  <div className="w-6 h-6 rounded-none bg-accent group-hover:bg-border-muted flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  Add Another Qualification
                </Button>

                <div className="sm:col-span-2 mt-12 py-6 border-t border-border-muted">
                  <FormField label="Additional Educational Details (Optional)">
                    <Textarea {...form.register("education.additionalQualifications")} placeholder="e.g. Won national debate championship" rows={3} className="block w-full" />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Profession Information */}
        {currentStep === 4 && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-border-muted pb-12 mb-16">
              <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 04</p>
              <CardTitle className="text-5xl font-serif text-foreground italic">
                {lang === 'en' ? 'Profession Information' : 'পেশাগত তথ্য'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2">
                <FormField label="Occupation / Job Title" error={form.formState.errors.profession?.occupation?.message}>
                  <Input type="text" {...form.register("profession.occupation")} placeholder="e.g. Software Engineer" className="block w-full" />
                </FormField>

                <FormField label="Organization Name (Optional)">
                  <Input type="text" {...form.register("profession.organizationName")} placeholder="e.g. Tech Company Ltd." className="block w-full" />
                </FormField>

                <FormField label="Employment Type (Optional)">
                  <Select {...form.register("profession.employmentType")} className="cursor-pointer">
                    <option value="">Select Type</option>
                    {EMPLOYMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </Select>
                </FormField>

                <FormField label="Monthly Income (Optional)">
                  <Input type="text" {...form.register("profession.monthlyIncome")} placeholder="e.g. 50,000 BDT" className="block w-full" />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Workplace Location (Optional)">
                    <Input type="text" {...form.register("profession.workplaceLocation")} placeholder="e.g. Banani, Dhaka" className="block w-full" />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Family Information */}
        {currentStep === 5 && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-border-muted pb-12 mb-16">
              <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 05</p>
              <CardTitle className="text-5xl font-serif text-foreground italic">
                {lang === 'en' ? 'Family Information' : 'পারিবারিক তথ্য'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2">
                <FormField label="Father's Name" error={form.formState.errors.familyInfo?.fatherName?.message}>
                  <Input type="text" {...form.register("familyInfo.fatherName")} placeholder="e.g. Md. Rahman" className="block w-full" />
                </FormField>

                <FormField label="Father's Profession (Optional)">
                  <Input type="text" {...form.register("familyInfo.fatherProfession")} placeholder="e.g. Businessman / Retired Govt. Officer" className="block w-full" />
                </FormField>

                <FormField label="Mother's Name" error={form.formState.errors.familyInfo?.motherName?.message}>
                  <Input type="text" {...form.register("familyInfo.motherName")} placeholder="e.g. Mrs. Begum" className="block w-full" />
                </FormField>

                <FormField label="Mother's Profession (Optional)">
                  <Input type="text" {...form.register("familyInfo.motherProfession")} placeholder="e.g. Homemaker / Teacher" className="block w-full" />
                </FormField>

                <FormField label="Number of Brothers (Optional)">
                  <Input type="number" {...form.register("familyInfo.numberOfBrothers", { valueAsNumber: true })} placeholder="e.g. 1" className="block w-full" />
                </FormField>

                <FormField label="Number of Sisters (Optional)">
                  <Input type="number" {...form.register("familyInfo.numberOfSisters", { valueAsNumber: true })} placeholder="e.g. 2" className="block w-full" />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Family Status (Optional)">
                    <Select {...form.register("familyInfo.familyStatus")} className="cursor-pointer">
                      <option value="">Select Family Status</option>
                      {FAMILY_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                    </Select>
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Marriage Expectations */}
        {currentStep === 6 && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-border-muted pb-12 mb-16">
              <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 06</p>
              <CardTitle className="text-5xl font-serif text-foreground italic">
                {lang === 'en' ? 'Marriage Expectations' : 'বিয়ে সংক্রান্ত প্রত্যাশা'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2">
                <FormField label="Expected Age Range (Optional)">
                  <Input type="text" {...form.register("expectations.expectedAgeRange")} placeholder="e.g. 22-26" className="block w-full" />
                </FormField>

                <FormField label="Expected Height (Optional)">
                  <Input type="text" {...form.register("expectations.expectedHeight")} placeholder={`e.g. 5'2" - 5'6"`} className="block w-full" />
                </FormField>

                <FormField label="Expected Education (Optional)">
                  <Input type="text" {...form.register("expectations.expectedEducation")} placeholder="e.g. Graduate or Minimum Post Graduate" className="block w-full" />
                </FormField>

                <FormField label="Expected Profession (Optional)">
                  <Input type="text" {...form.register("expectations.expectedProfession")} placeholder="e.g. Doctor, Engineer, or Business" className="block w-full" />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Expected Location (Optional)">
                    <Input type="text" {...form.register("expectations.expectedLocation")} placeholder="e.g. Dhaka or Abroad" className="block w-full" />
                  </FormField>
                </div>

                <div className="sm:col-span-2 mt-6">
                  <FormField label="Additional Expectations (Optional)">
                    <Textarea {...form.register("expectations.additionalExpectations")} placeholder="e.g. Looking for someone with a good family background..." rows={4} className="block w-full" />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Contact Information */}
        {currentStep === 7 && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-border-muted pb-12 mb-16">
              <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 07</p>
              <CardTitle className="text-5xl font-serif text-foreground italic">
                {lang === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য'}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-y-12 gap-x-4 sm:grid-cols-2">
                <FormField label="Contact Number" error={form.formState.errors.contactInfo?.contactNumber?.message}>
                  <Input type="text" {...form.register("contactInfo.contactNumber")} placeholder="e.g. 01712345678" className="block w-full" />
                </FormField>

                <FormField label="WhatsApp Number (Optional)">
                  <Input type="text" {...form.register("contactInfo.whatsAppNumber")} placeholder="e.g. 01712345678" className="block w-full" />
                </FormField>

                <FormField label="Email Address (Optional)" error={form.formState.errors.contactInfo?.emailAddress?.message}>
                  <Input type="email" {...form.register("contactInfo.emailAddress")} placeholder="e.g. hello@example.com" className="block w-full" />
                </FormField>

                <FormField label="Guardian Contact Info (Optional)">
                  <Input type="text" {...form.register("contactInfo.guardianContact")} placeholder="e.g. Father: 017..." className="block w-full" />
                </FormField>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 8: Custom Sections */}
        {currentStep === 8 && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-row justify-between items-center mb-16 pb-12 border-b border-border-muted space-y-0">
              <div>
                <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 08</p>
                <CardTitle className="text-5xl font-serif text-foreground italic">
                  Custom Sections
                </CardTitle>
                <p className="text-foreground-muted font-mono text-[10px] uppercase tracking-widest mt-4 px-0">Describe your heritage and lifestyle in detail</p>
              </div>
              <Button
                type="button"
                onClick={() => appendSection({ title: "", fields: [{ label: "", value: "" }] })}
                variant="outline"
                className="flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                Add Section
              </Button>
            </CardHeader>

            <CardContent>
              <div className="space-y-12">
                {customSectionsFields.map((section, sectionIdx) => (
                  <div key={section.id} className="p-10 bg-background rounded-none border border-border-muted relative group transition-all overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-accent group-hover:bg-foreground transition-colors"></div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeSection(sectionIdx)}
                      className="absolute top-6 right-6"
                    >
                      Delete Section
                    </Button>

                    <div className="mb-12">
                      <FormField label="Section Title">
                        <Input
                          type="text"
                          {...form.register(`customSections.${sectionIdx}.title`)}
                          placeholder="e.g., Heritage, Personal Journey"
                          className="block w-full max-w-md"
                        />
                      </FormField>
                    </div>

                    <div className="space-y-6">
                      <p className="font-mono text-[9px] font-black text-foreground-muted uppercase tracking-[0.4em] mb-4">Entries</p>
                      {form.watch(`customSections.${sectionIdx}.fields`)?.map((_, fieldIdx) => (
                        <div key={fieldIdx} className="flex gap-12 items-end group/field pb-4 border-b border-border-muted/50">
                          <div className="flex-1">
                            <FormField label="Label">
                              <Input type="text" {...form.register(`customSections.${sectionIdx}.fields.${fieldIdx}.label`)} placeholder="e.g. Prayer" className="block w-full" />
                            </FormField>
                          </div>
                          <div className="flex-[2]">
                            <FormField label="Detail">
                              <Input type="text" {...form.register(`customSections.${sectionIdx}.fields.${fieldIdx}.value`)} placeholder="e.g. 5 Times Daily" className="block w-full" />
                            </FormField>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const f = form.getValues(`customSections.${sectionIdx}.fields`);
                              form.setValue(`customSections.${sectionIdx}.fields`, f.filter((_, i) => i !== fieldIdx));
                            }}
                            className="w-12 border border-transparent hover:border-border-muted opacity-0 group-hover/field:opacity-100"
                          >
                            <svg className="w-4 h-4 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" /></svg>
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const f = form.getValues(`customSections.${sectionIdx}.fields`) || [];
                          form.setValue(`customSections.${sectionIdx}.fields`, [...f, { label: "", value: "" }]);
                        }}
                        className="flex items-center gap-2 mt-4"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        Add Entry
                      </Button>
                    </div>
                  </div>
                ))}

                {customSectionsFields.length === 0 && (
                  <div className="text-center py-24 border-2 border-dashed border-border-muted rounded-none bg-accent/20">
                    <div className="w-16 h-16 bg-background border border-border-muted rounded-none flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-foreground-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-xs text-foreground-muted/40 font-mono uppercase tracking-widest">No custom sections added</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Navigation (Mobile) - Polished Floating bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-2xl border-t border-border-muted p-4 lg:hidden flex items-center justify-between gap-3 z-[100] shadow-xl">
          <div className="flex items-center gap-3 flex-1">
            <Button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
              variant="outline"
              className="w-12 h-12 bg-background text-foreground rounded-none border-border-muted flex items-center justify-center shrink-0 active:scale-90 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </Button>

            <div className="flex-1 bg-accent p-1 rounded-none border border-border-muted flex items-center h-12 overflow-hidden">
              <button
                type="button"
                onClick={() => onViewChange?.("edit")}
                className={`flex-1 h-full rounded-none text-[10px] font-mono font-black uppercase tracking-widest transition-all ${mobileView === "edit" ? 'bg-foreground text-background shadow-sm' : 'text-foreground-muted/30'}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onViewChange?.("preview")}
                className={`flex-1 h-full rounded-none text-[10px] font-mono font-black uppercase tracking-widest transition-all ${mobileView === "preview" ? 'bg-foreground text-background shadow-sm' : 'text-foreground-muted/30'}`}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-[140px]">
            {currentStep < 8 ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="w-full h-12 rounded-none active:scale-95 transition-all outline-none font-mono text-[10px] font-black uppercase tracking-widest"
              >
                Next
              </Button>
            ) : isGuest ? (
              <DownloadPDFButton
                filename={`${form.getValues().basicInfo?.fullName || 'biodata'}_biyeprofile`}
                className="w-full h-12 bg-foreground text-background rounded-none active:scale-95 transition-all outline-none"
              />
            ) : (
              <a
                href="/dashboard"
                className="w-full h-12 bg-foreground text-background rounded-none active:scale-95 transition-all flex items-center justify-center text-center font-mono text-[10px] font-black uppercase tracking-widest"
              >
                Finish
              </a>
            )}
          </div>
        </div>

        {/* Footer Navigation (Desktop) - Premium styled buttons */}
        <div className="hidden lg:flex justify-between items-center py-12 border-t border-border-muted mt-10">
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              variant="outline"
              className="flex items-center gap-3 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </Button>
          ) : <div />}
          {currentStep < 8 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex items-center gap-3 group"
            >
              Next Step
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Button>
          ) : isGuest ? (
            <DownloadPDFButton
              filename={`${form.getValues().basicInfo?.fullName || 'biodata'}_biyeprofile`}
              className="px-12 py-3.5 bg-foreground text-background font-mono text-[11px] font-black uppercase tracking-[0.3em] rounded-none hover:bg-foreground/90 transition-all active:scale-95 flex items-center gap-3"
            />
          ) : (
            <a
              href="/dashboard"
              className="px-12 py-3.5 bg-foreground text-background font-mono text-[11px] font-black uppercase tracking-[0.3em] rounded-none hover:bg-foreground/90 transition-all active:scale-95 flex items-center gap-3"
            >
              Finish Documentation
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </a>
          )}
        </div>
      </form>
    </div>
  )
}
