"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { biodataSchema, type BiodataFormValues } from "@/lib/validations/biodata"
import { useEffect, useState, useCallback, useRef } from "react"
import { PhotoUpload } from "@/components/PhotoUpload"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

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
const FAMILY_STATUS_OPTIONS = ["Nuclear Family", "Joint Family", "Middle Class", "Upper Middle Class", "Affluent"];
const MARITAL_STATUS_OPTIONS = ["Unmarried", "Divorced", "Widow/Widower"];

export function BiodataForm({
  initialData,
  onDataChange,
  language: externalLanguage,
  mobileView,
  onViewChange
}: {
  initialData: Partial<BiodataFormValues>,
  onDataChange?: (data: BiodataFormValues) => void,
  language?: "en" | "bn",
  mobileView?: "edit" | "preview",
  onViewChange?: (view: "edit" | "preview") => void
}) {
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

  // Auto-center active tab
  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.children[0].children[currentStep - 1] as HTMLElement;
      if (activeTab) {
        const containerWidth = tabsRef.current.offsetWidth;
        const tabWidth = activeTab.offsetWidth;
        const scrollLeft = activeTab.offsetLeft - (containerWidth / 2) + (tabWidth / 2);

        tabsRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentStep]);

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
    try {
      const res = await fetch("/api/biodata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      })
      if (res.ok) {
        toast.success("Changes autosaved", { duration: 1500 })
      }
    } catch {
      // Silence background errors
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

      <div className="flex items-center justify-between gap-3 mb-8 bg-white/95 p-1.5 rounded-2xl border border-gray-100 backdrop-blur-xl sticky top-4 z-50 transition-all duration-300 shadow-xl shadow-indigo-500/5">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {/* Prev Button */}
          <Button
            type="button"
            disabled={currentStep === 1}
            onClick={() => {
              setCurrentStep(prev => prev - 1);
              scrollTabs('left');
            }}
            variant="outline"
            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-gray-100 bg-white text-indigo-600 transition-all enabled:hover:bg-indigo-50 disabled:opacity-30 disabled:grayscale group p-0"
          >
            <svg className="min-w-3.5 w-3.5 h-3.5 group-enabled:group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </Button>

          {/* Tabs Scroll Area */}
          <div
            ref={tabsRef}
            className="flex-1 overflow-x-auto no-scrollbar scroll-smooth py-0.5 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center gap-1 px-0.5">
              {steps.map((step, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant={currentStep === idx + 1 ? "default" : "ghost"}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 border h-auto ${currentStep === idx + 1 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-1 ring-indigo-200' : 'bg-transparent text-slate-500 border-transparent hover:text-indigo-600 hover:bg-indigo-50/50'}`}
                  onClick={() => setCurrentStep(idx + 1)}
                >
                  <span className={`text-sm sm:text-base transition-all duration-300 ${currentStep === idx + 1 ? 'scale-110 opacity-100' : 'opacity-70 grayscale'}`}>{step.icon}</span>
                  <span className={`text-[10px] sm:text-[11px] uppercase tracking-wider transition-all duration-300 ${currentStep === idx + 1 ? 'block font-black text-white' : 'hidden sm:block font-bold text-slate-500 hover:text-indigo-600'}`}>{step.title}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <Button
            type="button"
            disabled={currentStep === steps.length}
            onClick={() => {
              setCurrentStep(prev => prev + 1);
              scrollTabs('right');
            }}
            variant="outline"
            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-gray-100 bg-white text-indigo-600 transition-all enabled:hover:bg-indigo-50 disabled:opacity-30 disabled:grayscale group p-0"
          >
            <svg className="min-w-3.5 w-3.5 h-3.5 group-enabled:group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </Button>
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
                <Label className="block text-sm font-medium text-gray-700">
                  {lang === 'en' ? 'Profile Photo' : 'প্রোফাইল ফটো'}
                </Label>
                <PhotoUpload
                  value={form.watch("basicInfo.photoUrl") || ""}
                  onChange={(url) => form.setValue("basicInfo.photoUrl", url)}
                />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</Label>
                <Input type="text" {...form.register("basicInfo.fullName")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.basicInfo?.fullName?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.basicInfo.fullName.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Date of Birth</Label>
                <Input type="date" {...form.register("basicInfo.dateOfBirth")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.basicInfo?.dateOfBirth?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.basicInfo.dateOfBirth.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Age (Auto Calculated)</Label>
                <Input type="number" readOnly {...form.register("basicInfo.age")} className="block w-full rounded-2xl border-gray-100 bg-gray-100/50 shadow-sm sm:text-sm p-3 border text-gray-400 cursor-not-allowed outline-none font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Height</Label>
                <Select {...form.register("basicInfo.height")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium cursor-pointer">
                  <option value="">Select Height</option>
                  {HEIGHT_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                </Select>
                {form.formState.errors.basicInfo?.height?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.basicInfo.height.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Weight (Optional)</Label>
                <Input type="text" {...form.register("basicInfo.weight")} placeholder="e.g. 70kg" className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Blood Group</Label>
                <Select {...form.register("basicInfo.bloodGroup")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium cursor-pointer">
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </Select>
                {form.formState.errors.basicInfo?.bloodGroup?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.basicInfo.bloodGroup.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Religion</Label>
                <Input type="text" {...form.register("basicInfo.religion")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.basicInfo?.religion?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.basicInfo.religion.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Marital Status</Label>
                <Select {...form.register("basicInfo.maritalStatus")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium cursor-pointer">
                  <option value="">Select Status</option>
                  {MARITAL_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                </Select>
                {form.formState.errors.basicInfo?.maritalStatus?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.basicInfo.maritalStatus.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nationality</Label>
                <Input type="text" {...form.register("basicInfo.nationality")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
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
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Present Address</Label>
                <Textarea {...form.register("personalInfo.presentAddress")} rows={3} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.personalInfo?.presentAddress?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.personalInfo.presentAddress.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Permanent Address</Label>
                <Textarea {...form.register("personalInfo.permanentAddress")} rows={3} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.personalInfo?.permanentAddress?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.personalInfo.permanentAddress.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">District</Label>
                <Input type="text" {...form.register("personalInfo.district")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.personalInfo?.district?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.personalInfo.district.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Division (Optional)</Label>
                <Input type="text" {...form.register("personalInfo.division")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Native Village (Optional)</Label>
                <Input type="text" {...form.register("personalInfo.nativeVillage")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Complexion (Optional)</Label>
                <Select {...form.register("personalInfo.complexion")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium cursor-pointer">
                  <option value="">Select Complexion</option>
                  {COMPLEXION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Physical Status (Optional)</Label>
                <Input type="text" {...form.register("personalInfo.physicalStatus")} placeholder="e.g. Healthy" className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Hobby / Interests (Optional)</Label>
                <Textarea {...form.register("personalInfo.hobby")} rows={2} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
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

            <div className="space-y-8">
              {educationFields.map((field, index) => (
                <div key={field.id} className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 relative group/edu">
                  {educationFields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full shadow-md border border-red-50 flex items-center justify-center opacity-0 group-hover/edu:opacity-100 transition-all hover:bg-red-50 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                  )}

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Degree / Level</Label>
                      <Input
                        type="text"
                        {...form.register(`education.qualifications.${index}.degree` as const)}
                        placeholder="e.g. SSC / Graduation"
                        className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-white transition-all outline-none text-gray-900 font-medium"
                      />
                      {form.formState.errors.education?.qualifications?.[index]?.degree?.message && (
                        <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
                          {form.formState.errors.education.qualifications[index].degree.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Passing Year</Label>
                      <Input
                        type="text"
                        {...form.register(`education.qualifications.${index}.passingYear` as const)}
                        className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-white transition-all outline-none text-gray-900 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Institution Name</Label>
                      <Input
                        type="text"
                        {...form.register(`education.qualifications.${index}.institution` as const)}
                        className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-white transition-all outline-none text-gray-900 font-medium"
                      />
                      {form.formState.errors.education?.qualifications?.[index]?.institution?.message && (
                        <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
                          {form.formState.errors.education.qualifications[index].institution.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Result (Optional)</Label>
                      <Input
                        type="text"
                        {...form.register(`education.qualifications.${index}.result` as const)}
                        placeholder="e.g. GPA 5.00 / 1st Class"
                        className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-white transition-all outline-none text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={() => appendEducation({ degree: "", institution: "", passingYear: "", result: "" })}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                Add Another Qualification
              </Button>

              <div className="sm:col-span-2">
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Additional Educational Details (Optional)</Label>
                <Textarea {...form.register("education.additionalQualifications")} rows={3} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
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
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Occupation / Job Title</Label>
                <Input type="text" {...form.register("profession.occupation")} placeholder="e.g. Software Engineer" className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.profession?.occupation?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.profession.occupation.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Organization Name (Optional)</Label>
                <Input type="text" {...form.register("profession.organizationName")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Employment Type (Optional)</Label>
                <Select {...form.register("profession.employmentType")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium cursor-pointer">
                  <option value="">Select Type</option>
                  {EMPLOYMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </Select>
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Monthly Income (Optional)</Label>
                <Input type="text" {...form.register("profession.monthlyIncome")} placeholder="e.g. 50,000 BDT" className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div className="sm:col-span-2">
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Workplace Location (Optional)</Label>
                <Input type="text" {...form.register("profession.workplaceLocation")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
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
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Father&apos;s Name</Label>
                <Input type="text" {...form.register("familyInfo.fatherName")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.familyInfo?.fatherName?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.familyInfo.fatherName.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Father&apos;s Profession (Optional)</Label>
                <Input type="text" {...form.register("familyInfo.fatherProfession")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Mother&apos;s Name</Label>
                <Input type="text" {...form.register("familyInfo.motherName")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.familyInfo?.motherName?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.familyInfo.motherName.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Mother&apos;s Profession (Optional)</Label>
                <Input type="text" {...form.register("familyInfo.motherProfession")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Number of Brothers (Optional)</Label>
                <Input type="number" {...form.register("familyInfo.numberOfBrothers", { valueAsNumber: true })} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Number of Sisters (Optional)</Label>
                <Input type="number" {...form.register("familyInfo.numberOfSisters", { valueAsNumber: true })} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div className="sm:col-span-2">
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Family Status (Optional)</Label>
                <Select {...form.register("familyInfo.familyStatus")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium cursor-pointer">
                  <option value="">Select Family Status</option>
                  {FAMILY_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                </Select>
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
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Expected Age Range (Optional)</Label>
                <Input type="text" {...form.register("expectations.expectedAgeRange")} placeholder="e.g. 22-26" className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Expected Height (Optional)</Label>
                <Input type="text" {...form.register("expectations.expectedHeight")} placeholder={`e.g. 5'2" - 5'6"`} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Expected Education (Optional)</Label>
                <Input type="text" {...form.register("expectations.expectedEducation")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Expected Profession (Optional)</Label>
                <Input type="text" {...form.register("expectations.expectedProfession")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Expected Location (Optional)</Label>
                <Input type="text" {...form.register("expectations.expectedLocation")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div className="sm:col-span-2">
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Additional Expectations (Optional)</Label>
                <Textarea {...form.register("expectations.additionalExpectations")} rows={4} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
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
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Contact Number</Label>
                <Input type="text" {...form.register("contactInfo.contactNumber")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.contactInfo?.contactNumber?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.contactInfo.contactNumber.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">WhatsApp Number (Optional)</Label>
                <Input type="text" {...form.register("contactInfo.whatsAppNumber")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address (Optional)</Label>
                <Input type="email" {...form.register("contactInfo.emailAddress")} className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
                {form.formState.errors.contactInfo?.emailAddress?.message && <p className="mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{form.formState.errors.contactInfo.emailAddress.message}</p>}
              </div>

              <div>
                <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Guardian Contact Info (Optional)</Label>
                <Input type="text" {...form.register("contactInfo.guardianContact")} placeholder="e.g. Father: 017..." className="block w-full rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3 border bg-gray-50/30 transition-all outline-none text-gray-900 font-medium" />
              </div>
            </div>
          </section>
        )}

        {/* Step 8: Custom Sections */}
        {currentStep === 8 && (
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-50">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <div className="w-2.5 h-8 bg-indigo-600 rounded-full"></div>
                  Custom Sections
                </h3>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Add any extra information about yourself</p>
              </div>
              <Button
                type="button"
                onClick={() => appendSection({ title: "", fields: [{ label: "", value: "" }] })}
                className="text-xs font-black text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl hover:bg-indigo-100 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest border border-indigo-100/50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                Add Section
              </Button>
            </div>

            <div className="space-y-10">
              {customSectionsFields.map((section, sectionIdx) => (
                <div key={section.id} className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors"></div>
                  <Button
                    type="button"
                    onClick={() => removeSection(sectionIdx)}
                    className="absolute top-6 right-6 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-all border border-red-100/50"
                  >
                    Remove Section
                  </Button>

                  <div className="mb-8">
                    <Label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Section Title</Label>
                    <Input
                      type="text"
                      {...form.register(`customSections.${sectionIdx}.title`)}
                      placeholder="e.g., Religious Practice, Hobbies"
                      className="block w-full max-w-md rounded-2xl border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm p-3.5 border bg-white transition-all outline-none text-gray-900 font-bold"
                    />
                  </div>

                  <div className="space-y-4 pl-4 border-l-2 border-indigo-50">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Fields in this section</p>
                    {form.watch(`customSections.${sectionIdx}.fields`)?.map((_, fieldIdx) => (
                      <div key={fieldIdx} className="flex gap-3 items-center group/field">
                        <Input type="text" {...form.register(`customSections.${sectionIdx}.fields.${fieldIdx}.label`)} placeholder="Label (e.g., Prayer)" className="flex-1 rounded-xl border-gray-100 sm:text-xs p-3 border bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium" />
                        <Input type="text" {...form.register(`customSections.${sectionIdx}.fields.${fieldIdx}.value`)} placeholder="Value (e.g., Regular)" className="flex-[2] rounded-xl border-gray-100 sm:text-xs p-3 border bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium text-gray-900" />
                        <Button
                          type="button"
                          onClick={() => {
                            const f = form.getValues(`customSections.${sectionIdx}.fields`);
                            form.setValue(`customSections.${sectionIdx}.fields`, f.filter((_, i) => i !== fieldIdx));
                          }}
                          className="w-8 h-8 rounded-full border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all opacity-0 group-field-hover:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const f = form.getValues(`customSections.${sectionIdx}.fields`) || [];
                        form.setValue(`customSections.${sectionIdx}.fields`, [...f, { label: "", value: "" }]);
                      }}
                      className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1.5 mt-2 ml-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      Add Field
                    </Button>
                  </div>
                </div>
              ))}

              {customSectionsFields.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/20">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">No custom sections added yet.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer Navigation (Mobile) - Polished Floating bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-100 p-3 lg:hidden flex items-center justify-between gap-2 z-[90] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 flex-1">
            <Button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
              variant="outline"
              className="w-12 h-12 bg-gray-50 text-gray-900 rounded-2xl border-gray-100 flex items-center justify-center shrink-0 active:scale-90 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </Button>

            <div className="flex-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50 flex items-center gap-1">
              <button
                type="button"
                onClick={() => onViewChange?.("edit")}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${mobileView === "edit" ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onViewChange?.("preview")}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${mobileView === "preview" ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-[140px]">
            {currentStep < 8 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="w-full h-12 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Button>
            ) : (
              <a
                href="/dashboard"
                className="w-full h-12 bg-emerald-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2 text-center"
              >
                Finish
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* Footer Navigation (Desktop) - Premium styled buttons */}
        <div className="hidden lg:flex justify-between mt-12 pt-8 border-t border-gray-50">
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-8 py-3.5 border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95 flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Previous Section
            </Button>
          ) : <div />}
          {currentStep < 8 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-10 py-3.5 bg-gray-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95 flex items-center gap-3 group"
            >
              Next Phase
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Button>
          ) : (
            <a
              href="/dashboard"
              className="px-10 py-3.5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95 flex items-center gap-3"
            >
              Finish & Exit
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </a>
          )}
        </div>
      </form>
    </div>
  )
}
