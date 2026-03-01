import Image from "next/image"
import { type BiodataFormValues } from "@/lib/validations/biodata"

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
    <div className="space-y-10 text-gray-800 print:space-y-6">
      <div className="text-center mb-8 pb-4 border-b border-gray-300">
        <h1 className="text-4xl font-serif font-black text-gray-900 mb-2 uppercase tracking-tight">{t.title}</h1>
        {hasContent(data?.basicInfo?.fullName) && (
          <h2 className="text-2xl font-bold text-indigo-600">{data?.basicInfo?.fullName}</h2>
        )}
      </div>

      {data.basicInfo?.photoUrl && (
        <div className="flex justify-center mb-6">
          <div className="relative w-36 h-36 rounded-xl overflow-hidden border-4 border-white shadow-md">
            <Image
              src={data.basicInfo.photoUrl}
              alt="Profile photo"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* 1. Basic Information */}
      {hasContent(data?.basicInfo) && (
        <section className="print:break-inside-avoid">
          <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b-2 border-indigo-50 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
            {t.basic}
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {hasContent(data.basicInfo?.fullName) && <div><span className="font-bold text-gray-600">{t.fullName}:</span> {data.basicInfo?.fullName}</div>}
            {hasContent(data.basicInfo?.dateOfBirth) && <div><span className="font-bold text-gray-600">{t.dob}:</span> {data.basicInfo?.dateOfBirth}</div>}
            {hasContent(data.basicInfo?.age) && <div><span className="font-bold text-gray-600">{t.age}:</span> {data.basicInfo?.age} {lang === 'en' ? 'Years' : 'বছর'}</div>}
            {hasContent(data.basicInfo?.height) && <div><span className="font-bold text-gray-600">{t.height}:</span> {data.basicInfo?.height}</div>}
            {hasContent(data.basicInfo?.bloodGroup) && <div><span className="font-bold text-gray-600">{t.bloodGroup}:</span> {data.basicInfo?.bloodGroup}</div>}
            {hasContent(data.basicInfo?.religion) && <div><span className="font-bold text-gray-600">{t.religion}:</span> {data.basicInfo?.religion}</div>}
            {hasContent(data.basicInfo?.maritalStatus) && <div><span className="font-bold text-gray-600">{t.maritalStatus}:</span> {data.basicInfo?.maritalStatus}</div>}
            {hasContent(data.basicInfo?.nationality) && <div><span className="font-bold text-gray-600">{t.nationality}:</span> {data.basicInfo?.nationality}</div>}
            {hasContent(data.basicInfo?.weight) && <div><span className="font-bold text-gray-600">{t.weight}:</span> {data.basicInfo?.weight}</div>}
            {data.basicInfo?.extraFields?.map((f: { label: string; value: string }, i: number) => (
              <div key={i}><span className="font-bold text-gray-600">{f.label}:</span> {f.value}</div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Personal Information */}
      {hasContent(data?.personalInfo) && (
        <section className="print:break-inside-avoid">
          <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b-2 border-indigo-50 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
            {t.personal}
          </h3>
          <div className="grid grid-cols-1 gap-y-2 text-sm">
            {hasContent(data.personalInfo?.presentAddress) && <div><span className="font-bold text-gray-600">{t.presentAddress}:</span> {data.personalInfo?.presentAddress}</div>}
            {hasContent(data.personalInfo?.permanentAddress) && <div><span className="font-bold text-gray-600">{t.permanentAddress}:</span> {data.personalInfo?.permanentAddress}</div>}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {hasContent(data.personalInfo?.district) && <div><span className="font-bold text-gray-600">{t.district}:</span> {data.personalInfo?.district}</div>}
              {hasContent(data.personalInfo?.division) && <div><span className="font-bold text-gray-600">{t.division}:</span> {data.personalInfo?.division}</div>}
              {hasContent(data.personalInfo?.nativeVillage) && <div><span className="font-bold text-gray-600">{t.nativeVillage}:</span> {data.personalInfo?.nativeVillage}</div>}
              {hasContent(data.personalInfo?.complexion) && <div><span className="font-bold text-gray-600">{t.complexion}:</span> {data.personalInfo?.complexion}</div>}
              {hasContent(data.personalInfo?.physicalStatus) && <div><span className="font-bold text-gray-600">{t.physicalStatus}:</span> {data.personalInfo?.physicalStatus}</div>}
            </div>
            {hasContent(data.personalInfo?.hobby) && <div><span className="font-bold text-gray-600">{t.hobby}:</span> {data.personalInfo?.hobby}</div>}
          </div>
        </section>
      )}

      {/* 3. Education Information */}
      {hasContent(data?.education) && (
        <section className="print:break-inside-avoid">
          <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b-2 border-indigo-50 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
            {t.education}
          </h3>
          <div className="grid grid-cols-1 gap-y-2 text-sm bg-gray-50/50 p-3 rounded-lg border border-gray-100">
            {hasContent(data.education?.highestQualification) && <div className="text-base font-bold text-indigo-700">{data.education?.highestQualification}</div>}
            {hasContent(data.education?.institution) && <div><span className="font-bold text-gray-600">{t.institution}:</span> {data.education?.institution}</div>}
            {hasContent(data.education?.passingYear) && <div><span className="font-bold text-gray-600">{t.passingYear}:</span> {data.education?.passingYear}</div>}
            {hasContent(data.education?.additionalQualifications) && (
              <div className="mt-1">
                <span className="font-bold text-gray-600 block mb-1">{t.additionalQualifications}:</span>
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{data.education?.additionalQualifications}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Profession Information */}
      {hasContent(data?.profession) && (
        <section className="print:break-inside-avoid">
          <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b-2 border-indigo-50 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
            {t.profession}
          </h3>
          <div className="grid grid-cols-1 gap-y-2 text-sm bg-gray-50/50 p-3 rounded-lg border border-gray-100">
            {hasContent(data.profession?.occupation) && <div className="text-base font-bold text-indigo-700">{data.profession?.occupation}</div>}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {hasContent(data.profession?.organizationName) && <div><span className="font-bold text-gray-600">{t.organization}:</span> {data.profession?.organizationName}</div>}
              {hasContent(data.profession?.employmentType) && <div><span className="font-bold text-gray-600">{t.employmentType}:</span> {data.profession?.employmentType}</div>}
              {hasContent(data.profession?.monthlyIncome) && <div><span className="font-bold text-gray-600">{t.monthlyIncome}:</span> {data.profession?.monthlyIncome}</div>}
              {hasContent(data.profession?.workplaceLocation) && <div><span className="font-bold text-gray-600">{t.workplace}:</span> {data.profession?.workplaceLocation}</div>}
            </div>
          </div>
        </section>
      )}

      {/* 5. Family Information */}
      {hasContent(data?.familyInfo) && (
        <section className="print:break-inside-avoid">
          <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b-2 border-indigo-50 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
            {t.family}
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {hasContent(data.familyInfo?.fatherName) && <div><span className="font-bold text-gray-600">{t.fatherName}:</span> {data.familyInfo?.fatherName}</div>}
            {hasContent(data.familyInfo?.fatherProfession) && <div><span className="font-bold text-gray-600">{t.fatherProfession}:</span> {data.familyInfo?.fatherProfession}</div>}
            {hasContent(data.familyInfo?.motherName) && <div><span className="font-bold text-gray-600">{t.motherName}:</span> {data.familyInfo?.motherName}</div>}
            {hasContent(data.familyInfo?.motherProfession) && <div><span className="font-bold text-gray-600">{t.motherProfession}:</span> {data.familyInfo?.motherProfession}</div>}
            {hasContent(data.familyInfo?.numberOfBrothers) && <div><span className="font-bold text-gray-600">{t.brothers}:</span> {data.familyInfo?.numberOfBrothers}</div>}
            {hasContent(data.familyInfo?.numberOfSisters) && <div><span className="font-bold text-gray-600">{t.sisters}:</span> {data.familyInfo?.numberOfSisters}</div>}
            {hasContent(data.familyInfo?.familyStatus) && <div className="col-span-2"><span className="font-bold text-gray-600">{t.familyStatus}:</span> {data.familyInfo?.familyStatus}</div>}
          </div>
        </section>
      )}

      {/* 6. Marriage Expectations */}
      {hasContent(data?.expectations) && (
        <section className="print:break-inside-avoid">
          <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b-2 border-indigo-50 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
            {t.expectations}
          </h3>
          <div className="grid grid-cols-1 gap-y-2 text-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {hasContent(data.expectations?.expectedAgeRange) && <div><span className="font-bold text-gray-600">{t.expectedAge}:</span> {data.expectations?.expectedAgeRange}</div>}
              {hasContent(data.expectations?.expectedHeight) && <div><span className="font-bold text-gray-600">{t.expectedHeight}:</span> {data.expectations?.expectedHeight}</div>}
              {hasContent(data.expectations?.expectedEducation) && <div><span className="font-bold text-gray-600">{t.expectedEducation}:</span> {data.expectations?.expectedEducation}</div>}
              {hasContent(data.expectations?.expectedProfession) && <div><span className="font-bold text-gray-600">{t.expectedProfession}:</span> {data.expectations?.expectedProfession}</div>}
              {hasContent(data.expectations?.expectedLocation) && <div><span className="font-bold text-gray-600">{t.expectedLocation}:</span> {data.expectations?.expectedLocation}</div>}
            </div>
            {hasContent(data.expectations?.additionalExpectations) && (
              <div className="mt-1 bg-indigo-50/30 p-3 rounded-lg border border-indigo-100/50">
                <span className="font-bold text-indigo-700 block mb-1 text-xs uppercase tracking-wider">{t.additionalExpectations}:</span>
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed italic">&quot;{data.expectations?.additionalExpectations}&quot;</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7. Contact Information */}
      {hasContent(data?.contactInfo) && (
        <section className="mt-10 pt-8 border-t-2 border-dashed border-gray-200 text-center print:mt-6 print:pt-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t.contact}</h3>
          <div className="inline-flex flex-wrap justify-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm print:p-4 print:gap-4">
            {hasContent(data.contactInfo?.contactNumber) && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.contactNumber}</span>
                <span className="text-indigo-600 font-bold">{data.contactInfo?.contactNumber}</span>
              </div>
            )}
            {hasContent(data.contactInfo?.whatsAppNumber) && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.whatsApp}</span>
                <span className="text-emerald-600 font-bold">{data.contactInfo?.whatsAppNumber}</span>
              </div>
            )}
            {hasContent(data.contactInfo?.emailAddress) && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.email}</span>
                <span className="text-gray-700 font-semibold">{data.contactInfo?.emailAddress}</span>
              </div>
            )}
          </div>
          {hasContent(data.contactInfo?.guardianContact) && (
            <div className="mt-4 text-xs text-gray-500 italic">
              {t.guardianContact}: {data.contactInfo?.guardianContact}
            </div>
          )}
        </section>
      )}

      {/* Custom Sections */}
      {data?.customSections?.map((section: { title: string; fields: { label: string; value: string }[] }, idx: number) => (
        hasContent(section.fields) && (
          <section key={idx} className="print:break-inside-avoid mt-8">
            <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b-2 border-indigo-50 pb-1">{section.title}</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {section.fields.map((f: { label: string; value: string }, fIdx: number) => (
                <div key={fIdx}><span className="font-bold text-gray-600">{f.label}:</span> {f.value}</div>
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  )
}
