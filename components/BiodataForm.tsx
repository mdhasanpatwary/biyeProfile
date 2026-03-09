"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { biodataSchema, type BiodataFormValues } from "@/lib/validations/biodata"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { StepWizard } from "@/components/ui/step-wizard"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"
import { useRouter } from "next/navigation"

import { BasicInfoStep } from "./biodata-form/steps/BasicInfoStep"
import { PersonalInfoStep } from "./biodata-form/steps/PersonalInfoStep"
import { EducationStep } from "./biodata-form/steps/EducationStep"
import { ProfessionStep } from "./biodata-form/steps/ProfessionStep"
import { FamilyInfoStep } from "./biodata-form/steps/FamilyInfoStep"
import { ExpectationsStep } from "./biodata-form/steps/ExpectationsStep"
import { ContactInfoStep } from "./biodata-form/steps/ContactInfoStep"
import { CustomSectionsStep } from "./biodata-form/steps/CustomSectionsStep"

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
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [lastSavedData, setLastSavedData] = useState<Partial<BiodataFormValues>>(initialData)

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

  const stepKeys = [
    "basicInfo",
    "personalInfo",
    "education",
    "profession",
    "familyInfo",
    "expectations",
    "contactInfo",
    "customSections"
  ] as const;

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

  // Sync data changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((value) => {
      onDataChange?.(value as BiodataFormValues)
    })
    return () => subscription.unsubscribe()
  }, [form, onDataChange])

  const handleNextStep = async () => {
    const currentStepKey = stepKeys[currentStep - 1];
    const isStepValid = await form.trigger(currentStepKey);

    if (isStepValid) {
      if (!isGuest) {
        const currentData = form.getValues();
        // Check if data actually changed for this specific step by stringifying the chunk
        // If it's the "customSections" step, check the whole array.
        const currentChunk = currentStepKey ? currentData[currentStepKey as keyof BiodataFormValues] : null;
        const lastSavedChunk = currentStepKey ? lastSavedData[currentStepKey as keyof BiodataFormValues] : null;

        const hasChanged = JSON.stringify(currentChunk) !== JSON.stringify(lastSavedChunk);

        if (hasChanged) {
          try {
            const res = await fetch("/api/biodata", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: currentData })
            });
            if (res.ok) {
              setLastSavedData(currentData);
            } else {
              toast.error("Failed to save step");
              return;
            }
          } catch (error) {
            console.error("Save failed:", error);
            toast.error("Failed to save step");
            return;
          }
        }
      }
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinish = async () => {
    const currentStepKey = stepKeys[currentStep - 1];
    const isStepValid = await form.trigger(currentStepKey);

    if (isStepValid) {
      if (!isGuest) {
        const currentData = form.getValues();
        // Always save the full form on explicit finish — do not use the
        // diff-check here. Without this, edits made on earlier steps would be
        // silently skipped if the last step was untouched (its chunk would
        // compare equal to lastSavedData even though other steps changed).
        try {
          const res = await fetch("/api/biodata", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: currentData })
          });
          if (res.ok) {
            toast.success("Biodata saved successfully", { duration: 1500 });
          } else {
            toast.error("Failed to save biodata");
            return;
          }
        } catch (error) {
          console.error("Save failed:", error);
          toast.error("Failed to save biodata");
          return;
        }
      }
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  // Sync external language change
  useEffect(() => {
    if (externalLanguage) {
      form.setValue("language", externalLanguage as "en" | "bn");
    }
  }, [externalLanguage, form]);


  const lang = form.watch("language");

  return (
    <div className="relative">

      <div className="flex items-center justify-between gap-4 bg-background/90 backdrop-blur-md p-6 sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Button
            type="button"
            disabled={currentStep === 1}
            onClick={handlePrevStep}
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
            onClick={handleNextStep}
            variant="outline"
            size="icon"
            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 hover:border-foreground group relative z-10 mt-1"
          >
            <svg className="min-w-3.5 w-3.5 h-3.5 group-enabled:group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </Button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-10 pb-0">
        {currentStep === 1 && <BasicInfoStep form={form} lang={lang} />}
        {currentStep === 2 && <PersonalInfoStep form={form} lang={lang} />}
        {currentStep === 3 && <EducationStep form={form} lang={lang} />}
        {currentStep === 4 && <ProfessionStep form={form} lang={lang} />}
        {currentStep === 5 && <FamilyInfoStep form={form} lang={lang} />}
        {currentStep === 6 && <ExpectationsStep form={form} lang={lang} />}
        {currentStep === 7 && <ContactInfoStep form={form} lang={lang} />}
        {currentStep === 8 && <CustomSectionsStep form={form} />}

        {/* Footer Navigation (Mobile) - Polished Floating bar */}
        <div className="fixed bottom-0 mb-0 left-0 right-0 bg-background/95 backdrop-blur-2xl border-t border-border-muted p-4 lg:hidden flex items-center justify-between gap-3 z-[100] shadow-xl">
          <div className="flex items-center gap-3 flex-1">
            <Button
              type="button"
              disabled={currentStep === 1}
              onClick={handlePrevStep}
              variant="outline"
              className="w-12 h-12 bg-background text-foreground rounded-none border-border-muted flex items-center justify-center shrink-0 active:scale-90 transition-all gap-2"
            >
              <svg className="min-w-3.5 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </Button>

            <div className="flex-1 min-w-[140px] bg-accent p-1 rounded-none border border-border-muted flex items-center h-12 overflow-hidden">
              <button
                type="button"
                onClick={() => onViewChange?.("edit")}
                className={`flex-1 h-full rounded-none text-[10px] font-mono font-black uppercase tracking-widest transition-all ${mobileView === "edit" ? 'bg-foreground text-background shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onViewChange?.("preview")}
                className={`flex-1 h-full rounded-none text-[10px] font-mono font-black uppercase tracking-widest transition-all ${mobileView === "preview" ? 'bg-foreground text-background shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
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
                onClick={handleNextStep}
                className="w-full h-12 rounded-none active:scale-95 transition-all outline-none font-mono text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </Button>
            ) : isGuest ? (
              <DownloadPDFButton
                filename={`${form.getValues().basicInfo?.fullName || 'biodata'}_biyeprofile`}
                className="w-full h-12 bg-foreground text-background rounded-none active:scale-95 transition-all outline-none flex items-center justify-center gap-2"
              />
            ) : (
              <Button
                type="button"
                onClick={handleFinish}
                className="w-full h-12 bg-foreground text-background rounded-none active:scale-95 transition-all flex items-center justify-center text-center font-mono text-[10px] font-black uppercase tracking-widest gap-2"
              >
                Save & Finish
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </Button>
            )}
          </div>
        </div>

        {/* Footer Navigation (Desktop) - Premium styled buttons */}
        <div className="hidden lg:flex justify-between items-center pt-10 border-t border-border-muted">
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={handlePrevStep}
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
              onClick={handleNextStep}
              className="flex items-center gap-3 group"
            >
              Next Step
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Button>
          ) : isGuest ? (
            <DownloadPDFButton
              filename={`${form.getValues().basicInfo?.fullName || 'biodata'}_biyeprofile`}
              className="px-10 py-4 bg-foreground text-background font-mono text-[11px] font-black uppercase tracking-[0.3em] rounded-none hover:bg-foreground/90 transition-all active:scale-95 flex items-center gap-3"
            />
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleFinish}
              className="flex items-center gap-3 group"
            >
              Save & Finish
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
