import Image from "next/image"
import { type BiodataFormValues } from "@/lib/validations/biodata"

interface CustomField {
  label: string;
  value: string;
}

interface Qualification {
  degree: string;
  institution: string;
  passingYear: string | number;
  result?: string;
}

interface CustomSection {
  title: string;
  fields: CustomField[];
}

function hasContent(val: unknown): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (typeof val === 'number') return true;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') {
    return Object.values(val as object).some(v => hasContent(v));
  }
  return false;
}

const LABELS: Record<string, Record<string, string>> = {
  en: {
    title: "Biodata",
    basic: "Basic Information",
    personal: "Personal Information",
    education: "Education Information",
    profession: "Profession Information",
    family: "Family Information",
    expectations: "Marriage Expectations",
    contact: "Contact Information",
    fullName: "Full Name",
    dob: "Date of Birth",
    age: "Age",
    height: "Height",
    weight: "Weight",
    bloodGroup: "Blood Group",
    religion: "Religion",
    maritalStatus: "Marital Status",
    nationality: "Nationality",
    presentAddress: "Present Address",
    permanentAddress: "Permanent Address",
    district: "District",
    division: "Division",
    nativeVillage: "Native Village",
    complexion: "Complexion",
    physicalStatus: "Physical Status",
    hobby: "Hobby / Interests",
    highestQualification: "Highest Qualification",
    institution: "Institution",
    passingYear: "Passing Year",
    additionalQualifications: "Additional Qualifications",
    occupation: "Occupation / Job Title",
    organization: "Organization Name",
    employmentType: "Employment Type",
    monthlyIncome: "Monthly Income",
    workplace: "Workplace Location",
    fatherName: "Father's Name",
    fatherProfession: "Father's Profession",
    motherName: "Mother's Name",
    motherProfession: "Mother's Profession",
    brothers: "Number of Brothers",
    sisters: "Number of Sisters",
    familyStatus: "Family Status",
    expectedAge: "Expected Age Range",
    expectedHeight: "Expected Height",
    expectedEducation: "Expected Education",
    expectedProfession: "Expected Profession",
    expectedLocation: "Expected Location",
    additionalExpectations: "Additional Expectations",
    contactNumber: "Contact Number",
    whatsApp: "WhatsApp Number",
    email: "Email Address",
    guardianContact: "Guardian Contact Info"
  },
  bn: {
    title: "জীবনবৃত্তান্ত",
    basic: "প্রাথমিক তথ্য",
    personal: "ব্যক্তিগত তথ্য",
    education: "শিক্ষাগত তথ্য",
    profession: "পেশাগত তথ্য",
    family: "পারিবারিক তথ্য",
    expectations: "বিয়ে সংক্রান্ত প্রত্যাশা",
    contact: "যোগাযোগের তথ্য",
    fullName: "পূর্ণ নাম",
    dob: "জন্ম তারিখ",
    age: "বয়স",
    height: "উচ্চতা",
    weight: "ওজন",
    bloodGroup: "রক্তের গ্রুপ",
    religion: "ধর্ম",
    maritalStatus: "বৈবাহিক অবস্থা",
    nationality: "জাতীয়তা",
    presentAddress: "বর্তমান ঠিকানা",
    permanentAddress: "স্থায়ী ঠিকানা",
    district: "জেলা",
    division: "বিভাগ",
    nativeVillage: "গ্রামের নাম",
    complexion: "শারীরিক বর্ণ",
    physicalStatus: "শারীরিক অবস্থা",
    hobby: "শখ",
    highestQualification: "সর্বোচ্চ শিক্ষাগত যোগ্যতা",
    institution: "শিক্ষা প্রতিষ্ঠানের নাম",
    passingYear: "পাসের সাল",
    additionalQualifications: "অন্যান্য শিক্ষাগত যোগ্যতা",
    occupation: "পেশা",
    organization: "প্রতিষ্ঠানের নাম",
    employmentType: "চাকরির ধরণ",
    monthlyIncome: "মাসিক আয়",
    workplace: "কর্মস্থল",
    fatherName: "পিতার নাম",
    fatherProfession: "পিতার পেশা",
    motherName: "মাতার নাম",
    motherProfession: "মাতার পেশা",
    brothers: "ভাইয়ের সংখ্যা",
    sisters: "বোনের সংখ্যা",
    familyStatus: "পারিবারিক অবস্থা",
    expectedAge: "প্রত্যাশিত বয়সের সীমা",
    expectedHeight: "প্রত্যাশিত উচ্চতা",
    expectedEducation: "প্রত্যাশিত শিক্ষাগত যোগ্যতা",
    expectedProfession: "প্রত্যাশিত পেশা",
    expectedLocation: "প্রত্যাশিত অবস্থান",
    additionalExpectations: "অন্যান্য প্রত্যাশা",
    contactNumber: "যোগাযোগের নম্বর",
    whatsApp: "হোয়াটসঅ্যাপ নম্বর",
    email: "ইমেইল",
    guardianContact: "গার্ডিয়ানের যোগাযোগের তথ্য"
  }
};

export function BiodataContent({ data }: { data: Partial<BiodataFormValues> }) {
  if (!data) return null;
  const lang = data.language || "en";
  const t = LABELS[lang];

  return (
    <div className="space-y-6 sm:space-y-12 text-gray-800 print:space-y-8 max-w-4xl mx-auto">
      {/* Header with watermark-like background */}
      <div className="text-center mb-8 sm:mb-12 pb-6 sm:pb-8 border-b-4 border-double border-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-gray-900 mb-3 uppercase tracking-tighter">
          {t.title}
        </h1>
        {hasContent(data?.basicInfo?.fullName) && (
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 inline-block">
            {data?.basicInfo?.fullName}
          </h2>
        )}
      </div>

      {data.basicInfo?.photoUrl && (
        <div className="flex justify-center mb-10">
          <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-8 border-white shadow-2xl ring-1 ring-gray-100">
            <Image
              src={data.basicInfo.photoUrl}
              alt="Profile photo"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Grid for sections - A4 optimized */}
      <div className="space-y-8 sm:space-y-10">
        {/* 1. Basic Information */}
        {hasContent(data?.basicInfo) && (
          <section className="print:break-inside-avoid animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-sm font-black text-indigo-600 mb-4 px-4 py-2 bg-indigo-50 rounded-xl inline-block uppercase tracking-[0.2em]">
              {t.basic}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm border-l-2 border-indigo-100 pl-6 ml-2">
              {[
                { label: t.fullName, value: data.basicInfo?.fullName },
                { label: t.dob, value: data.basicInfo?.dateOfBirth },
                { label: t.age, value: data.basicInfo?.age ? `${data.basicInfo?.age} ${lang === 'en' ? 'Years' : 'বছর'}` : null },
                { label: t.height, value: data.basicInfo?.height },
                { label: t.bloodGroup, value: data.basicInfo?.bloodGroup },
                { label: t.religion, value: data.basicInfo?.religion },
                { label: t.maritalStatus, value: data.basicInfo?.maritalStatus },
                { label: t.nationality, value: data.basicInfo?.nationality },
                { label: t.weight, value: data.basicInfo?.weight },
                ...(data.basicInfo?.extraFields || []).map((f: CustomField) => ({ label: f.label, value: f.value }))
              ].map((item, i) => hasContent(item.value) && (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Personal Information */}
        {hasContent(data?.personalInfo) && (
          <section className="print:break-inside-avoid animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-sm font-black text-indigo-600 mb-4 px-4 py-2 bg-indigo-50 rounded-xl inline-block uppercase tracking-[0.2em]">
              {t.personal}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-sm border-l-2 border-indigo-100 pl-6 ml-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {[
                  { label: t.presentAddress, value: data.personalInfo?.presentAddress, fullWidth: true },
                  { label: t.permanentAddress, value: data.personalInfo?.permanentAddress, fullWidth: true },
                  { label: t.district, value: data.personalInfo?.district },
                  { label: t.division, value: data.personalInfo?.division },
                  { label: t.nativeVillage, value: data.personalInfo?.nativeVillage },
                  { label: t.complexion, value: data.personalInfo?.complexion },
                  { label: t.physicalStatus, value: data.personalInfo?.physicalStatus },
                ].map((item, i) => hasContent(item.value) && (
                  <div key={i} className={`flex flex-col gap-0.5 ${item.fullWidth ? 'col-span-2' : ''}`}>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                    <span className="font-semibold text-gray-900 leading-relaxed">{item.value}</span>
                  </div>
                ))}
              </div>
              {hasContent(data.personalInfo?.hobby) && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                  <span className="text-indigo-600 font-bold not-italic mr-2"># {t.hobby}:</span>
                  {data.personalInfo?.hobby}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. Education Information */}
        {hasContent(data?.education) && (
          <section className="print:break-inside-avoid animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-sm font-black text-indigo-600 mb-4 px-4 py-2 bg-indigo-50 rounded-xl inline-block uppercase tracking-[0.2em]">
              {t.education}
            </h3>
            <div className="space-y-6 ml-2">
              {data.education && data.education.qualifications?.map((edu: Qualification, index: number) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50/30 to-indigo-50/30 p-6 rounded-[2rem] border border-indigo-100/50 relative">
                  <div className="text-xl font-black text-indigo-900 mb-4 uppercase tracking-tight">
                    {edu.degree}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t.institution}</span>
                      <span className="font-bold text-gray-800">{edu.institution}</span>
                    </div>
                    {edu.passingYear && (
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t.passingYear}</span>
                        <span className="font-bold text-gray-800">{edu.passingYear}</span>
                      </div>
                    )}
                    {edu.result && (
                      <div className="flex flex-col sm:col-span-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Result</span>
                        <span className="font-bold text-gray-800">{edu.result}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {hasContent(data.education?.additionalQualifications) && (
                <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 ml-0 mt-4">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.additionalQualifications}</span>
                   <p className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium text-sm">
                     {data.education?.additionalQualifications}
                   </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Profession Information */}
        {hasContent(data?.profession) && (
          <section className="print:break-inside-avoid animate-fade-in-up" style={{ animationDelay: '400ms' }}>
             <h3 className="text-sm font-black text-indigo-600 mb-4 px-4 py-2 bg-indigo-50 rounded-xl inline-block uppercase tracking-[0.2em]">
              {t.profession}
            </h3>
            <div className="bg-indigo-50/20 p-6 rounded-[2rem] border border-indigo-100/50 shadow-sm ml-2">
              <div className="grid grid-cols-1 gap-y-4 text-sm">
                {hasContent(data.profession?.occupation) && (
                  <div className="text-xl font-black text-indigo-900 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    {data.profession?.occupation}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                  {[
                    { label: t.organization, value: data.profession?.organizationName },
                    { label: t.employmentType, value: data.profession?.employmentType },
                    { label: t.monthlyIncome, value: data.profession?.monthlyIncome },
                    { label: t.workplace, value: data.profession?.workplaceLocation },
                  ].map((item, i) => hasContent(item.value) && (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase">{item.label}</span>
                      <span className="font-bold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. Family Information */}
        {hasContent(data?.familyInfo) && (
          <section className="print:break-inside-avoid animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-sm font-black text-indigo-600 mb-4 px-4 py-2 bg-indigo-50 rounded-xl inline-block uppercase tracking-[0.2em]">
              {t.family}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-sm border-l-2 border-indigo-100 pl-6 ml-2">
              {[
                { label: t.fatherName, value: data.familyInfo?.fatherName },
                { label: t.fatherProfession, value: data.familyInfo?.fatherProfession },
                { label: t.motherName, value: data.familyInfo?.motherName },
                { label: t.motherProfession, value: data.familyInfo?.motherProfession },
                { label: t.brothers, value: data.familyInfo?.numberOfBrothers?.toString() },
                { label: t.sisters, value: data.familyInfo?.numberOfSisters?.toString() },
              ].map((item, i) => hasContent(item.value) && item.value !== "NaN" && (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase">{item.label}</span>
                  <span className="font-bold text-gray-800">{item.value}</span>
                </div>
              ))}
              {hasContent(data.familyInfo?.familyStatus) && (
                <div className="col-span-2 mt-2 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50">
                   <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest block mb-1">{t.familyStatus}</span>
                   <p className="font-bold text-gray-800">{data.familyInfo?.familyStatus}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. Marriage Expectations */}
        {hasContent(data?.expectations) && (
          <section className="print:break-inside-avoid animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <h3 className="text-sm font-black text-indigo-600 mb-4 px-4 py-2 bg-indigo-50 rounded-xl inline-block uppercase tracking-[0.2em]">
              {t.expectations}
            </h3>
            <div className="bg-indigo-50/20 p-6 sm:p-8 rounded-[2.5rem] border-2 border-indigo-100 items-center justify-center text-center ml-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-sm mb-8">
                {[
                  { label: t.expectedAge, value: data.expectations?.expectedAgeRange },
                  { label: t.expectedHeight, value: data.expectations?.expectedHeight },
                  { label: t.expectedEducation, value: data.expectations?.expectedEducation },
                  { label: t.expectedProfession, value: data.expectations?.expectedProfession },
                  { label: t.expectedLocation, value: data.expectations?.expectedLocation },
                ].map((item, i) => hasContent(item.value) && (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">{item.label}</span>
                    <span className="font-black text-gray-900 underline decoration-indigo-200 underline-offset-4 decoration-2">{item.value}</span>
                  </div>
                ))}
              </div>
              {hasContent(data.expectations?.additionalExpectations) && (
                <div className="relative pt-6">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-indigo-200"></div>
                  <p className="italic text-gray-700 leading-relaxed px-4 text-sm font-medium">
                    &quot;{data.expectations?.additionalExpectations}&quot;
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {data?.customSections?.map((section: CustomSection, idx: number) => (
          hasContent(section.fields) && (
            <section key={idx} className="print:break-inside-avoid">
               <h3 className="text-sm font-black text-indigo-600 mb-4 px-4 py-2 bg-indigo-50 rounded-xl inline-block uppercase tracking-[0.2em]">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm border-l-2 border-indigo-200 pl-6 ml-2">
                {section.fields.map((f: CustomField, fIdx: number) => (
                  <div key={fIdx} className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{f.label}</span>
                    <span className="font-semibold text-gray-900">{f.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )
        ))}

        {/* 7. Contact Information */}
        {hasContent(data?.contactInfo) && (
          <section className="mt-20 pt-12 border-t-8 border-double border-indigo-100 text-center print:mt-10 print:pt-8 bg-gray-50/50 rounded-[3rem] p-10">
            <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-widest">{t.contact}</h3>
            <div className="flex flex-wrap justify-center gap-10">
              {[
                { label: t.contactNumber, value: data.contactInfo?.contactNumber, color: 'text-indigo-600' },
                { label: t.whatsApp, value: data.contactInfo?.whatsAppNumber, color: 'text-indigo-600' },
                { label: t.email, value: data.contactInfo?.emailAddress, color: 'text-gray-900' },
              ].map((item, i) => hasContent(item.value) && (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</span>
                  <span className={`text-lg font-black ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            {hasContent(data.contactInfo?.guardianContact) && (
              <div className="mt-8 pt-6 border-t border-gray-200/50 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                {t.guardianContact}: <span className="text-gray-600 ml-2">{data.contactInfo?.guardianContact}</span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
