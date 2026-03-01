"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { biodataSchema, type BiodataFormValues } from "@/lib/validations/biodata"
import { useEffect, useState, useCallback, useRef } from "react"
import { PhotoUpload } from "@/components/PhotoUpload"
import { toast } from "sonner"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<T extends (...args: any[]) => any>(cb: T, delay: number) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useCallback((...args: any[]) => {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      cb(...args);
    }, delay);
    setTimer(newTimer);
  }, [cb, delay, timer]);
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
const FAMILY_STATUS_OPTIONS = ["Middle Class", "Upper Middle Class", "Affluent"];
const MARITAL_STATUS_OPTIONS = ["Unmarried", "Divorced", "Widow/Widower"];

export function BiodataForm({ initialData, onDataChange }: { initialData: Partial<BiodataFormValues>, onDataChange?: (data: BiodataFormValues) => void }) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [formLoading, setFormLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const tabsRef = useRef<HTMLDivElement>(null)

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
        highestQualification: initialData?.education?.highestQualification || "",
        institution: initialData?.education?.institution || "",
        passingYear: initialData?.education?.passingYear || "",
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

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 150;
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  // Set up autosave
  const debouncedSave = useDebounce(async (data: BiodataFormValues) => {
    setSaveState("saving")
    try {
      const res = await fetch("/api/biodata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      })
      if (res.ok) {
        setSaveState("saved")
        toast.success("Changes autosaved", { duration: 1500 })
        setTimeout(() => setSaveState("idle"), 2000)
      } else {
        setSaveState("error")
      }
    } catch {
      setSaveState("error")
    }
  }, 2000)

  useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange?.(value as BiodataFormValues)
      debouncedSave(value as BiodataFormValues)
    })
    return () => subscription.unsubscribe()
  }, [form, debouncedSave, onDataChange])

  const handleManualSave = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    const data = form.getValues()
    setSaveState("saving")
    setFormLoading(true)
    try {
      const res = await fetch("/api/biodata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      })
      if (res.ok) {
        setSaveState("saved")
        toast.success("Biodata saved successfully!")
        setTimeout(() => setSaveState("idle"), 2000)
      } else {
        setSaveState("error")
      }
    } catch {
      setSaveState("error")
    } finally {
      setFormLoading(false)
    }
  }

  const lang = form.watch("language");

  return (
    <div>
      <div className="flex justify-between items-center mb-6 bg-indigo-50/50 p-2 sm:p-4 rounded-xl border border-indigo-100/50 backdrop-blur-sm sticky top-0 z-10 transition-all duration-300">
        <div className="flex items-center gap-1 flex-1 overflow-hidden relative group/tabs min-w-0">
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            className="absolute left-0 z-20 h-8 w-6 bg-gradient-to-r from-indigo-50 to-transparent flex items-center justify-start text-indigo-400 opacity-0 group-hover/tabs:opacity-100 transition-opacity lg:hidden"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div
            ref={tabsRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 overflow-y-hidden w-full select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 border ${currentStep === idx + 1 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                  onClick={() => setCurrentStep(idx + 1)}
                >
                  <span className="text-base sm:text-lg">{step.icon}</span>
                  <span className={currentStep === idx + 1 ? 'block' : 'hidden md:block'}>{step.title}</span>
                </div>
              ))}
            </div>

            <div className="ml-2 sm:ml-4 flex items-center shrink-0 min-w-[70px] sm:min-w-[100px]">
              {saveState === "saving" && <span className="text-[9px] sm:text-[10px] font-bold text-indigo-600 animate-pulse flex items-center gap-1 sm:gap-2 uppercase tracking-tight"><div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-600 rounded-full animate-ping"></div> Saving</span>}
              {saveState === "saved" && <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 flex items-center gap-1 uppercase tracking-tight">✓ Saved</span>}
              {saveState === "error" && <span className="text-[9px] sm:text-[10px] font-bold text-red-600 uppercase tracking-tight">⚠ Error</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollTabs('right')}
            className="absolute right-0 z-20 h-8 w-6 bg-gradient-to-l from-indigo-50 to-transparent flex items-center justify-end text-indigo-400 opacity-0 group-hover/tabs:opacity-100 transition-opacity lg:hidden"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-2">
          <select
            {...form.register("language")}
            className="text-xs font-bold bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
          <button
            type="button"
            onClick={handleManualSave}
            disabled={formLoading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 shrink-0"
          >
            Save
          </button>
        </div>
      </div>

      <form className="space-y-12 pb-20">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              {lang === 'en' ? 'Basic Information' : 'প্রাথমিক তথ্য'}
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {lang === 'en' ? 'Profile Photo' : 'প্রোফাইল ফটো'}
                </label>
                <PhotoUpload
                  value={form.watch("basicInfo.photoUrl") || ""}
                  onChange={(url) => form.setValue("basicInfo.photoUrl", url)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" {...form.register("basicInfo.fullName")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.basicInfo?.fullName && <p className="mt-1 text-xs text-red-600">{form.formState.errors.basicInfo.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" {...form.register("basicInfo.dateOfBirth")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.basicInfo?.dateOfBirth && <p className="mt-1 text-xs text-red-600">{form.formState.errors.basicInfo.dateOfBirth.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age (Auto Calculated)</label>
                <input type="number" readOnly {...form.register("basicInfo.age")} className="mt-1 block w-full rounded-lg bg-gray-50 border-gray-200 shadow-sm sm:text-sm p-2.5 border text-gray-500 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <select {...form.register("basicInfo.height")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900">
                  <option value="">Select Height</option>
                  {HEIGHT_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                {form.formState.errors.basicInfo?.height && <p className="mt-1 text-xs text-red-600">{form.formState.errors.basicInfo.height.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (Optional)</label>
                <input type="text" {...form.register("basicInfo.weight")} placeholder="e.g. 70kg" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select {...form.register("basicInfo.bloodGroup")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900">
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                {form.formState.errors.basicInfo?.bloodGroup && <p className="mt-1 text-xs text-red-600">{form.formState.errors.basicInfo.bloodGroup.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <input type="text" {...form.register("basicInfo.religion")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.basicInfo?.religion && <p className="mt-1 text-xs text-red-600">{form.formState.errors.basicInfo.religion.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <select {...form.register("basicInfo.maritalStatus")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900">
                  <option value="">Select Status</option>
                  {MARITAL_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                {form.formState.errors.basicInfo?.maritalStatus && <p className="mt-1 text-xs text-red-600">{form.formState.errors.basicInfo.maritalStatus.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <input type="text" {...form.register("basicInfo.nationality")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Personal Information */}
        {currentStep === 2 && (
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              {lang === 'en' ? 'Personal Information' : 'ব্যক্তিগত তথ্য'}
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Present Address</label>
                <textarea {...form.register("personalInfo.presentAddress")} rows={3} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.personalInfo?.presentAddress && <p className="mt-1 text-xs text-red-600">{form.formState.errors.personalInfo.presentAddress.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
                <textarea {...form.register("personalInfo.permanentAddress")} rows={3} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.personalInfo?.permanentAddress && <p className="mt-1 text-xs text-red-600">{form.formState.errors.personalInfo.permanentAddress.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input type="text" {...form.register("personalInfo.district")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.personalInfo?.district && <p className="mt-1 text-xs text-red-600">{form.formState.errors.personalInfo.district.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Division (Optional)</label>
                <input type="text" {...form.register("personalInfo.division")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Native Village (Optional)</label>
                <input type="text" {...form.register("personalInfo.nativeVillage")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Complexion (Optional)</label>
                <select {...form.register("personalInfo.complexion")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900">
                  <option value="">Select Complexion</option>
                  {COMPLEXION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Physical Status (Optional)</label>
                <input type="text" {...form.register("personalInfo.physicalStatus")} placeholder="e.g. Healthy" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hobby / Interests (Optional)</label>
                <textarea {...form.register("personalInfo.hobby")} rows={2} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Education Information */}
        {currentStep === 3 && (
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              {lang === 'en' ? 'Education Information' : 'শিক্ষাগত তথ্য'}
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                <input type="text" {...form.register("education.highestQualification")} placeholder="e.g. B.Sc in CSE" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.education?.highestQualification && <p className="mt-1 text-xs text-red-600">{form.formState.errors.education.highestQualification.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Institution Name (Optional)</label>
                <input type="text" {...form.register("education.institution")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Passing Year (Optional)</label>
                <input type="number" {...form.register("education.passingYear", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Additional Qualifications (Optional)</label>
                <textarea {...form.register("education.additionalQualifications")} rows={3} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>
            </div>
          </section>
        )}

        {/* Step 4: Profession Information */}
        {currentStep === 4 && (
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              {lang === 'en' ? 'Profession Information' : 'পেশাগত তথ্য'}
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation / Job Title</label>
                <input type="text" {...form.register("profession.occupation")} placeholder="e.g. Software Engineer" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.profession?.occupation && <p className="mt-1 text-xs text-red-600">{form.formState.errors.profession.occupation.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Organization Name (Optional)</label>
                <input type="text" {...form.register("profession.organizationName")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Type (Optional)</label>
                <select {...form.register("profession.employmentType")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900">
                  <option value="">Select Type</option>
                  {EMPLOYMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Income (Optional)</label>
                <input type="text" {...form.register("profession.monthlyIncome")} placeholder="e.g. 50,000 BDT" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Workplace Location (Optional)</label>
                <input type="text" {...form.register("profession.workplaceLocation")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>
            </div>
          </section>
        )}

        {/* Step 5: Family Information */}
        {currentStep === 5 && (
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              {lang === 'en' ? 'Family Information' : 'পারিবারিক তথ্য'}
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Father&apos;s Name</label>
                <input type="text" {...form.register("familyInfo.fatherName")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.familyInfo?.fatherName && <p className="mt-1 text-xs text-red-600">{form.formState.errors.familyInfo.fatherName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Father&apos;s Profession (Optional)</label>
                <input type="text" {...form.register("familyInfo.fatherProfession")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mother&apos;s Name</label>
                <input type="text" {...form.register("familyInfo.motherName")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.familyInfo?.motherName && <p className="mt-1 text-xs text-red-600">{form.formState.errors.familyInfo.motherName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mother&apos;s Profession (Optional)</label>
                <input type="text" {...form.register("familyInfo.motherProfession")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Brothers (Optional)</label>
                <input type="number" {...form.register("familyInfo.numberOfBrothers", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Sisters (Optional)</label>
                <input type="number" {...form.register("familyInfo.numberOfSisters", { valueAsNumber: true })} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Family Status (Optional)</label>
                <select {...form.register("familyInfo.familyStatus")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900">
                  <option value="">Select Family Status</option>
                  {FAMILY_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Step 6: Marriage Expectations */}
        {currentStep === 6 && (
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              {lang === 'en' ? 'Marriage Expectations' : 'বিয়ে সংক্রান্ত প্রত্যাশা'}
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Age Range (Optional)</label>
                <input type="text" {...form.register("expectations.expectedAgeRange")} placeholder="e.g. 22-26" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Height (Optional)</label>
                <input type="text" {...form.register("expectations.expectedHeight")} placeholder={`e.g. 5'2" - 5'6"`} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Education (Optional)</label>
                <input type="text" {...form.register("expectations.expectedEducation")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Profession (Optional)</label>
                <input type="text" {...form.register("expectations.expectedProfession")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Location (Optional)</label>
                <input type="text" {...form.register("expectations.expectedLocation")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Additional Expectations (Optional)</label>
                <textarea {...form.register("expectations.additionalExpectations")} rows={4} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>
            </div>
          </section>
        )}

        {/* Step 7: Contact Information */}
        {currentStep === 7 && (
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              {lang === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য'}
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="text" {...form.register("contactInfo.contactNumber")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.contactInfo?.contactNumber && <p className="mt-1 text-xs text-red-600">{form.formState.errors.contactInfo.contactNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">WhatsApp Number (Optional)</label>
                <input type="text" {...form.register("contactInfo.whatsAppNumber")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address (Optional)</label>
                <input type="email" {...form.register("contactInfo.emailAddress")} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
                {form.formState.errors.contactInfo?.emailAddress && <p className="mt-1 text-xs text-red-600">{form.formState.errors.contactInfo.emailAddress.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Guardian Contact Info (Optional)</label>
                <input type="text" {...form.register("contactInfo.guardianContact")} placeholder="e.g. Father: 017..." className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border text-gray-900" />
              </div>
            </div>
          </section>
        )}

        {/* Step 8: Custom Sections */}
        {currentStep === 8 && (
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                Custom Sections
              </h3>
              <button
                type="button"
                onClick={() => appendSection({ title: "", fields: [{ label: "", value: "" }] })}
                className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-8">
              {customSectionsFields.map((section, sectionIdx) => (
                <div key={section.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIdx)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 hidden group-hover/tabs:block"
                  >
                    Remove
                  </button>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Section Title</label>
                    <input type="text" {...form.register(`customSections.${sectionIdx}.title`)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white" />
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-indigo-100">
                    {form.watch(`customSections.${sectionIdx}.fields`)?.map((_, fieldIdx) => (
                      <div key={fieldIdx} className="flex gap-2 items-center">
                        <input type="text" {...form.register(`customSections.${sectionIdx}.fields.${fieldIdx}.label`)} placeholder="Label" className="flex-1 rounded-md border-gray-300 sm:text-xs p-2 border bg-white" />
                        <input type="text" {...form.register(`customSections.${sectionIdx}.fields.${fieldIdx}.value`)} placeholder="Value" className="flex-[2] rounded-md border-gray-300 sm:text-xs p-2 border bg-white" />
                        <button type="button" onClick={() => {
                          const f = form.getValues(`customSections.${sectionIdx}.fields`);
                          form.setValue(`customSections.${sectionIdx}.fields`, f.filter((_, i) => i !== fieldIdx));
                        }} className="text-red-400 hover:text-red-600">×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const f = form.getValues(`customSections.${sectionIdx}.fields`) || [];
                      form.setValue(`customSections.${sectionIdx}.fields`, [...f, { label: "", value: "" }]);
                    }} className="text-xs font-bold text-indigo-600">+ Add Field</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Navigation (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:hidden flex justify-between gap-4 z-50">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl text-sm"
            >
              ← Back
            </button>
          )}
          {currentStep < 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleManualSave}
              disabled={formLoading}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm"
            >
              Save Biodata
            </button>
          )}
        </div>

        {/* Footer Navigation (Desktop) */}
        <div className="hidden lg:flex justify-between mt-8 pt-6 border-t">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          ) : <div />}
          {currentStep < 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              Next Phase
            </button>
          ) : (
            <button
              type="button"
              onClick={handleManualSave}
              disabled={formLoading}
              className="px-8 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-95"
            >
              Finalize & Save
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
