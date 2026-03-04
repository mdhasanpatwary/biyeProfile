import Image from "next/image"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { getCloudinaryUrl } from "@/lib/cloudinary"

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
    title: "Document: Biodata",
    basic: "Basic Information",
    personal: "Personal Information",
    education: "Academic History",
    profession: "Professional Status",
    family: "Family Context",
    expectations: "Marriage Expectations",
    contact: "Communication",
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
    nativeVillage: "Origin",
    complexion: "Complexion",
    physicalStatus: "Physical Status",
    hobby: "Interests",
    highestQualification: "Education",
    institution: "Institution",
    passingYear: "Year",
    additionalQualifications: "Additional Credits",
    occupation: "Current Role",
    organization: "Organization",
    employmentType: "Employment",
    monthlyIncome: "Monthly Income",
    workplace: "Location",
    fatherName: "Father",
    fatherProfession: "Father's Profession",
    motherName: "Mother",
    motherProfession: "Mother's Profession",
    brothers: "Brothers",
    sisters: "Sisters",
    familyStatus: "Social Status",
    expectedAge: "Age Range",
    expectedHeight: "Height",
    expectedEducation: "Education",
    expectedProfession: "Profession",
    expectedLocation: "Location",
    additionalExpectations: "Note",
    contactNumber: "Phone",
    whatsApp: "WhatsApp",
    email: "Email",
    guardianContact: "Guardian Contact"
  },
  bn: {
    title: "ডকুমেন্ট: জীবনবৃত্তান্ত",
    basic: "প্রাথমিক তথ্য",
    personal: "ব্যক্তিগত তথ্য",
    education: "শিক্ষাগত তথ্য",
    profession: "পেশাগত তথ্য",
    family: "পারিবারিক তথ্য",
    expectations: "বিয়ে সংক্রান্ত প্রত্যাশা",
    contact: "যোগাযোগ",
    fullName: "পূর্ণ নাম",
    dob: "জন্ম তারিখ",
    age: "বয়স",
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
    nativeVillage: "উৎপত্তি",
    complexion: "শারীরিক বর্ণ",
    physicalStatus: "শারীরিক অবস্থা",
    hobby: "শখ",
    highestQualification: "শিক্ষা",
    institution: "শিক্ষা প্রতিষ্ঠান",
    passingYear: "সাল",
    additionalQualifications: "অন্যান্য যোগ্যতা",
    occupation: "পেশা",
    organization: "প্রতিষ্ঠান",
    employmentType: "চাকরির ধরণ",
    monthlyIncome: "মাসিক আয়",
    workplace: "কর্মস্থল",
    fatherName: "পিতা",
    fatherProfession: "পিতার পেশা",
    motherName: "মাতা",
    motherProfession: "মাতার পেশা",
    brothers: "ভাইয়ের সংখ্যা",
    sisters: "বোনের সংখ্যা",
    familyStatus: "পারিবারিক অবস্থা",
    expectedAge: "প্রত্যাশিত বয়স",
    expectedHeight: "প্রত্যাশিত উচ্চতা",
    expectedEducation: "পছন্দসই শিক্ষা",
    expectedProfession: "পছন্দসই পেশা",
    expectedLocation: "প্রত্যাশিত অবস্থান",
    additionalExpectations: "বিশেষ দ্রষ্টব্য",
    contactNumber: "ফোন নম্বর",
    whatsApp: "হোয়াটসঅ্যাপ",
    email: "ইমেইল",
    guardianContact: "গার্ডিয়ান"
  }
};

// Reusable section title with subtle underline rule
function SectionTitle({ label }: { label: string }) {
  return (
    <div className="sticky top-8">
      <h2 className="font-mono text-[11px] font-semibold tracking-[0.35em] text-black/50 uppercase">
        {label}
      </h2>
      <div className="w-6 h-px bg-black/20 mt-2" />
    </div>
  );
}

// Reusable key-value field cell
function Field({
  label,
  value,
  className = "",
  valueClassName = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-mono text-[9px] font-bold text-black/45 uppercase tracking-[0.22em]">
        {label}
      </span>
      <span className={`text-base font-medium text-black leading-snug ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}

export function BiodataContent({ data }: { data: Partial<BiodataFormValues> }) {
  if (!data) return null;
  const lang = data.language || "en";
  const t = LABELS[lang];

  return (
    <div id="biodata-content" className="relative bg-white text-black font-sans selection:bg-black selection:text-white p-8 sm:p-16 min-h-screen overflow-hidden">
      {/* Texture Layer */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-5"></div>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Document Meta */}
        <div className="flex justify-between items-baseline mb-16 font-mono text-[10px] tracking-[0.35em] text-black/40 uppercase">
          <span>{t.title}</span>
          <span>{new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short' })}</span>
        </div>

        {/* ─── Header Block ─── */}
        <header className="flex flex-col md:flex-row items-center gap-14 mb-24 border-b border-black/8 pb-12">
          {data.basicInfo?.photoUrl && (
            <div className="relative group shrink-0">
              <div className="w-44 h-44 bg-gray-50 overflow-hidden grayscale contrast-[1.1] ring-1 ring-black/8 rounded-none shadow-sm">
                <Image
                  src={getCloudinaryUrl(data.basicInfo.photoUrl, "full")}
                  alt="Profile photo"
                  fill
                  sizes="176px"
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Corner accent */}
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-[1.5px] border-b-[1.5px] border-black/25" />
            </div>
          )}

          <div className="flex-1 w-full text-left">
            <p className="font-mono text-[11px] tracking-[0.4em] text-black/40 uppercase mb-3">
              {data.basicInfo?.religion || 'Profile'}
            </p>
            <h1 className="text-5xl sm:text-6xl font-serif leading-none tracking-tighter mb-3 text-black">
              {data?.basicInfo?.fullName || 'Full Member'}
            </h1>
            <p className="text-base text-black/55 tracking-wide">
              {data.profession?.occupation || (lang === 'en' ? 'Personal Profile' : 'ব্যক্তিগত তথ্য')}
            </p>
          </div>
        </header>

        {/* ─── Content Sections ─── */}
        <div className="space-y-24">

          {/* Section: Basic Info */}
          {hasContent(data.basicInfo) && (
            <section className="group">
              <div className="flex flex-col md:flex-row border-t border-black/10 pt-8">
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={t.basic} />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
                  {[
                    { label: t.dob, value: data.basicInfo?.dateOfBirth },
                    { label: t.age, value: data.basicInfo?.age ? `${data.basicInfo?.age} ${lang === 'en' ? 'Years' : 'বছর'}` : null },
                    { label: t.height, value: data.basicInfo?.height },
                    { label: t.weight, value: data.basicInfo?.weight },
                    { label: t.bloodGroup, value: data.basicInfo?.bloodGroup },
                    { label: t.maritalStatus, value: data.basicInfo?.maritalStatus },
                    { label: t.nationality, value: data.basicInfo?.nationality },
                  ].map((item, i) => hasContent(item.value) && (
                    <Field key={i} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section: Personal Info */}
          {hasContent(data.personalInfo) && (
            <section>
              <div className="flex flex-col md:flex-row border-t border-black/10 pt-8">
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={t.personal} />
                </div>
                <div className="w-full md:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
                    {[
                      { label: t.presentAddress, value: data.personalInfo?.presentAddress, full: true, address: true },
                      { label: t.permanentAddress, value: data.personalInfo?.permanentAddress, full: true, address: true },
                      { label: t.district, value: data.personalInfo?.district },
                      { label: t.nativeVillage, value: data.personalInfo?.nativeVillage },
                      { label: t.complexion, value: data.personalInfo?.complexion },
                      { label: t.hobby, value: data.personalInfo?.hobby, full: true, italic: true },
                    ].map((item, i) => hasContent(item.value) && (
                      <Field
                        key={i}
                        label={item.label}
                        value={item.value}
                        className={item.full ? 'sm:col-span-2' : ''}
                        valueClassName={
                          item.address
                            ? 'text-sm font-normal leading-relaxed text-black/75 max-w-sm'
                            : item.italic
                              ? 'italic font-light text-black/70'
                              : ''
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section: Education */}
          {hasContent(data.education) && (
            <section>
              <div className="flex flex-col md:flex-row border-t border-black/10 pt-8">
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={t.education} />
                </div>
                <div className="w-full md:w-2/3 space-y-8">
                  {data.education?.qualifications?.map((edu: Qualification, idx: number) => {
                    const isLast = idx === (data.education?.qualifications?.length ?? 0) - 1;
                    return (
                      <div
                        key={idx}
                        className={`group relative ${!isLast ? 'border-b border-black/8 pb-8' : ''}`}
                      >
                        <p className="font-mono text-[10px] text-black/35 mb-1.5 tracking-[0.2em] uppercase">
                          {edu.passingYear || '—'}
                        </p>
                        <h3 className="text-xl font-serif text-black mb-2 leading-snug italic">
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-black/60 font-medium tracking-wide border-l border-black/15 pl-4">
                          {edu.institution}
                        </p>
                        {edu.result && (
                          <p className="text-xs font-mono text-black/35 mt-2 pl-4 tracking-wide">
                            Result — {edu.result}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {hasContent(data.education?.additionalQualifications) && (
                    <div className="bg-gray-50/70 p-6 border-l-2 border-black">
                      <span className="font-mono text-[9px] font-bold text-black/45 uppercase tracking-widest block mb-2">
                        {t.additionalQualifications}
                      </span>
                      <p className="text-sm leading-relaxed text-black/75 whitespace-pre-wrap">
                        {data.education?.additionalQualifications}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section: Professional */}
          {hasContent(data.profession) && (
            <section>
              <div className="flex flex-col md:flex-row border-t border-black/10 pt-8">
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={t.profession} />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
                  {[
                    { label: t.occupation, value: data.profession?.occupation },
                    { label: t.organization, value: data.profession?.organizationName },
                    { label: t.employmentType, value: data.profession?.employmentType },
                    { label: t.monthlyIncome, value: data.profession?.monthlyIncome },
                    { label: t.workplace, value: data.profession?.workplaceLocation },
                  ].map((item, i) => hasContent(item.value) && (
                    <Field key={i} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section: Family */}
          {hasContent(data.familyInfo) && (
            <section>
              <div className="flex flex-col md:flex-row border-t border-black/10 pt-8">
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={t.family} />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
                  {[
                    { label: t.fatherName, value: data.familyInfo?.fatherName },
                    { label: t.fatherProfession, value: data.familyInfo?.fatherProfession },
                    { label: t.motherName, value: data.familyInfo?.motherName },
                    { label: t.motherProfession, value: data.familyInfo?.motherProfession },
                    { label: t.brothers, value: data.familyInfo?.numberOfBrothers?.toString() },
                    { label: t.sisters, value: data.familyInfo?.numberOfSisters?.toString() },
                    { label: t.familyStatus, value: data.familyInfo?.familyStatus, full: true },
                  ].map((item, i) => hasContent(item.value) && item.value !== "NaN" && (
                    <Field
                      key={i}
                      label={item.label}
                      value={item.value}
                      className={item.full ? 'sm:col-span-2' : ''}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section: Marriage Expectations (Black Card) */}
          {hasContent(data.expectations) && (
            <section>
              <div className="flex flex-col md:flex-row border-t border-black/10 pt-8">
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={t.expectations} />
                </div>
                <div className="w-full md:w-2/3 bg-black text-white p-8 sm:p-12 relative overflow-hidden">
                  {/* Texture overlay */}
                  <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />
                  {/* Fields grid */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-0">
                    {[
                      { label: t.expectedAge, value: data.expectations?.expectedAgeRange },
                      { label: t.expectedHeight, value: data.expectations?.expectedHeight },
                      { label: t.expectedEducation, value: data.expectations?.expectedEducation },
                      { label: t.expectedProfession, value: data.expectations?.expectedProfession },
                    ].map((item, i) => hasContent(item.value) && (
                      <div key={i} className="flex flex-col gap-1.5 border-b border-white/15 py-6">
                        <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.22em]">
                          {item.label}
                        </span>
                        <span className="text-lg font-serif italic leading-snug text-white">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {hasContent(data.expectations?.additionalExpectations) && (
                    <div className="relative z-10 border-t border-white/10 pt-8 mt-8">
                      <p className="text-base font-light italic leading-relaxed text-white/85">
                        &ldquo;{data.expectations?.additionalExpectations}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section: Custom Sections */}
          {hasContent(data.customSections) && (data.customSections as CustomSection[])?.map((section: CustomSection, sIdx: number) => (
            <section key={sIdx}>
              <div className="flex flex-col md:flex-row border-t border-black/10 pt-8">
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={section.title} />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
                  {section.fields?.map((field: CustomField, fIdx: number) => hasContent(field.value) && (
                    <Field key={fIdx} label={field.label} value={field.value} />
                  ))}
                </div>
              </div>
            </section>
          ))}

        </div>

        {/* ─── Contact Footer ─── */}
        {hasContent(data.contactInfo) && (
          <footer className="mt-24 pt-12 border-t-4 border-black border-double">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">

              {/* Left: Contact hierarchy */}
              <div className="space-y-6">
                {/* Section label */}
                <p className="font-mono text-[10px] font-bold tracking-[0.35em] uppercase text-black/45">
                  {t.contact}
                </p>

                {/* Primary — Email */}
                <p className="text-2xl font-serif tracking-tight text-black underline decoration-black/15 underline-offset-8">
                  {data.contactInfo?.emailAddress || 'Not Provided'}
                </p>

                {/* Secondary — Phone + WhatsApp */}
                <div className="flex gap-8">
                  {hasContent(data.contactInfo?.contactNumber) && (
                    <div>
                      <p className="font-mono text-[9px] text-black/45 uppercase tracking-widest mb-1.5">
                        {t.contactNumber}
                      </p>
                      <p className="text-base font-semibold text-black">
                        {data.contactInfo?.contactNumber}
                      </p>
                    </div>
                  )}
                  {hasContent(data.contactInfo?.whatsAppNumber) && (
                    <div>
                      <p className="font-mono text-[9px] text-black/45 uppercase tracking-widest mb-1.5">
                        {t.whatsApp}
                      </p>
                      <p className="text-base font-semibold text-black">
                        {data.contactInfo?.whatsAppNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Guardian */}
              {hasContent(data.contactInfo?.guardianContact) && (
                <div className="text-left md:text-right bg-gray-50 p-6 border-l-2 md:border-l-0 md:border-r-2 border-black/10 rounded-none">
                  <p className="font-mono text-[9px] text-black/45 uppercase tracking-widest mb-1.5">
                    {t.guardianContact}
                  </p>
                  <p className="text-sm font-bold text-black/80">
                    {data.contactInfo?.guardianContact}
                  </p>
                </div>
              )}
            </div>

            {/* Footer bar */}
            <div className="mt-24 pt-6 border-t border-black/8 flex justify-between items-center text-[9px] font-mono text-black/35 uppercase tracking-[0.4em]">
              <span>BiyeProfile 2026</span>
              <span>·</span>
              <span>All Rights Reserved</span>
            </div>
          </footer>
        )}

      </div>
    </div>
  );
}
