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
  extraFields?: CustomField[];
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

/** Format a date string like "1994-12-05" → "5 December 1994" */
function formatDate(val: string | undefined | null, locale: string): string {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Ensure a space before trailing unit abbreviations, e.g. "70kg" → "70 kg" */
function formatUnit(val: string | undefined | null): string {
  if (!val) return '';
  return String(val).replace(/(\d)(kg|lbs?|cm|ft|"|')$/i, '$1 $2');
}

/** Format height beautifully (e.g., 5'6" -> 5′ 6″) */
function formatHeight(val: string | undefined | null): string {
  if (!val) return '';
  const s = String(val);
  // Match patterns like 5'6", 5' 6", 5'6, 5ft 6in
  const match = s.match(/(\d+)\s*(?:'|ft|foot|feet)\s*(\d*)\s*(?:"|in|inches)?/i);
  if (match) {
    const ft = match[1];
    const in_ = match[2];
    if (in_) {
      return `${ft}′ ${in_}″`;
    }
    return `${ft}′`;
  }
  return formatUnit(s);
}

/** Format currency with BDT ৳ and thousands separator */
function formatIncome(val: string | undefined | null): string {
  if (!val) return '';
  const num = parseInt(String(val).replace(/\D/g, ''), 10);
  if (isNaN(num)) return val;
  return `৳${num.toLocaleString('en-IN')}`;
}

/** Format phone number to add sensible spacing e.g., +880 1738 721411 */
function formatPhone(val: string | undefined | null): string {
  if (!val) return '';
  const s = String(val).trim();
  // +8801738721411 -> +880 1738 721411
  if (s.startsWith('+880') && s.length === 14) {
    return `+880 ${s.slice(4, 8)} ${s.slice(8)}`;
  }
  // 01738721411 -> 01738 721411
  if (s.length === 11 && s.startsWith('01')) {
    return `${s.slice(0, 5)} ${s.slice(5)}`;
  }
  return s;
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
    organization: "Company",
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

import { BiodataSectionTitle as SectionTitle, BiodataSectionField as Field } from "@/components/BiodataSection"

export function BiodataContent({ data }: { data: Partial<BiodataFormValues> }) {
  if (!data) return null;
  const lang = data.language || "en";
  const t = LABELS[lang];
  const locale = lang === 'bn' ? 'bn-BD' : 'en-GB';

  const generatedDate = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div
      id="biodata-content"
      className="relative bg-background text-foreground font-sans overflow-hidden p-8 md:p-12"
    >
      {/* Subtle texture */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.025]" />

      <div className="relative z-10 max-w-[680px] mx-auto">

        {/* ── Document Meta Bar ── */}
        <div
          className="flex justify-between items-baseline mb-10 font-mono uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--foreground-muted)', borderBottom: '0.5px solid var(--border-muted)', paddingBottom: '12px' }}
        >
          <span>{t.title}</span>
          <span>{generatedDate}</span>
        </div>

        {/* ── Header Block ── */}
        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12" style={{ borderBottom: '0.5px solid var(--border-muted)', paddingBottom: '40px' }}>
          {/* Profile photo — plain <img> so html2canvas can render it */}
          {data.basicInfo?.photoUrl ? (
            <div className="shrink-0 flex justify-center w-full sm:w-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getCloudinaryUrl(data.basicInfo.photoUrl, "full")}
                alt="Profile photo"
                crossOrigin="anonymous"
                style={{
                  width: '112px',
                  height: '112px',
                  objectFit: 'cover',
                  border: '1px solid var(--border-muted)',
                  borderRadius: '2px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  filter: 'grayscale(100%) contrast(1.05)',
                  display: 'block',
                }}
              />
            </div>
          ) : (
            /* Fallback initials block when no photo uploaded */
            <div
              className="shrink-0 flex items-center justify-center font-serif font-bold"
              style={{
                width: '112px',
                height: '112px',
                background: 'var(--accent)',
                border: '1px solid var(--border-muted)',
                borderRadius: '2px',
                fontSize: '36px',
                color: 'var(--foreground-muted)',
              }}
            >
              {data.basicInfo?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left pt-1">
            <h1
              className="font-serif leading-none tracking-tight mb-3 sm:mb-2 text-3xl sm:text-[38px]"
              style={{ color: 'var(--foreground)' }}
            >
              {data?.basicInfo?.fullName || 'Full Member'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', letterSpacing: '0.02em' }}>
              {data.profession?.occupation || (lang === 'en' ? 'Personal Profile' : 'ব্যক্তিগত তথ্য')}
            </p>
          </div>
        </header>

        {/* ── Content Sections ── */}
        <div className="space-y-12">

          {/* Section: Basic Info */}
          {hasContent(data.basicInfo) && (
            <section>
              <div className="flex flex-col md:flex-row" style={{ borderTop: '0.5px solid var(--border-muted)', paddingTop: '24px' }}>
                <div className="w-full md:w-1/3 mb-6 md:mb-0">
                  <SectionTitle label={t.basic} />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    { label: t.dob, value: formatDate(data.basicInfo?.dateOfBirth as string, lang) },
                    { label: t.age, value: data.basicInfo?.age ? `${data.basicInfo.age} ${lang === 'en' ? 'years' : 'বছর'}` : null },
                    { label: t.height, value: formatHeight(data.basicInfo?.height as string) },
                    { label: t.weight, value: formatUnit(data.basicInfo?.weight as string) },
                    { label: t.bloodGroup, value: data.basicInfo?.bloodGroup },
                    { label: t.maritalStatus, value: data.basicInfo?.maritalStatus },
                    { label: t.nationality, value: data.basicInfo?.nationality },
                    { label: t.religion, value: data.basicInfo?.religion },
                    ...((data.basicInfo?.extraFields || []).map(f => ({ label: f.label, value: f.value })))
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
              <div className="flex flex-col md:flex-row" style={{ borderTop: '0.5px solid var(--border-muted)', paddingTop: '24px' }}>
                <div className="w-full md:w-1/3 mb-6 md:mb-0">
                  <SectionTitle label={t.personal} />
                </div>
                <div className="w-full md:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                    {[
                      { label: t.presentAddress, value: data.personalInfo?.presentAddress, full: true, address: true },
                      { label: t.permanentAddress, value: data.personalInfo?.permanentAddress, full: true, address: true },
                      { label: t.district, value: data.personalInfo?.district },
                      { label: t.nativeVillage, value: data.personalInfo?.nativeVillage },
                      { label: t.complexion, value: data.personalInfo?.complexion },
                      { label: t.hobby, value: data.personalInfo?.hobby, full: true, italic: true },
                      ...((data.personalInfo?.extraFields || []).map(f => ({ label: f.label, value: f.value })))
                    ].map((item, i) => hasContent(item.value) && (
                      <Field
                        key={i}
                        label={item.label}
                        value={item.value}
                        className={item.full ? 'col-span-2' : ''}
                        valueClassName={
                          item.address
                            ? 'text-sm font-normal leading-relaxed text-foreground-muted max-w-sm'
                            : item.italic
                              ? 'italic font-light text-foreground-muted leading-relaxed'
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
              <div className="flex flex-col md:flex-row" style={{ borderTop: '0.5px solid var(--border-muted)', paddingTop: '24px' }}>
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={t.education} />
                </div>
                <div className="w-full md:w-2/3 space-y-6">
                  {data.education?.qualifications?.map((edu: Qualification, idx: number) => {
                    const isLast = idx === (data.education?.qualifications?.length ?? 0) - 1;
                    return (
                      <div
                        key={idx}
                        className="relative"
                        style={!isLast ? { borderBottom: '0.5px solid var(--accent)', paddingBottom: '24px' } : {}}
                      >
                        <h3 className="font-serif italic mb-1" style={{ fontSize: '16.5px', color: 'var(--foreground)' }}>
                          <span className="font-mono not-italic uppercase mr-3" style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--foreground-muted)' }}>{edu.passingYear || '—'}</span>
                          {edu.degree}
                        </h3>
                        <p
                          className="font-medium"
                          style={{ fontSize: '12.5px', color: 'var(--foreground-muted)', paddingLeft: '2px' }}
                        >
                          {edu.institution}
                        </p>
                        {edu.result && (
                          <p
                            className="font-mono mt-1"
                            style={{ fontSize: '10px', color: 'var(--foreground-muted)', paddingLeft: '2px' }}
                          >
                            Result — {edu.result}
                          </p>
                        )}
                        {edu.extraFields && edu.extraFields.length > 0 && (
                          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                            {edu.extraFields.map((field, i) => hasContent(field.value) && (
                              <div key={`edu_extra_${idx}_${i}`} className="text-sm">
                                <span className="font-mono text-[9px] uppercase tracking-widest text-foreground-muted block mb-1">{field.label}</span>
                                <span className="text-foreground">{field.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {hasContent(data.education?.additionalQualifications) && (
                    <div style={{ background: 'var(--accent)', padding: '24px', borderLeft: '2px solid var(--foreground)' }}>
                      <span
                        className="font-mono uppercase block mb-1.5"
                        style={{ fontSize: '8.5px', letterSpacing: '0.15em', color: 'var(--foreground-muted)' }}
                      >
                        {t.additionalQualifications}
                      </span>
                      <p style={{ fontSize: '12.5px', lineHeight: '1.6', color: 'var(--foreground-muted)', whiteSpace: 'pre-wrap' }}>
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
              <div className="flex flex-col md:flex-row" style={{ borderTop: '0.5px solid var(--border-muted)', paddingTop: '24px' }}>
                <div className="w-full md:w-1/3 mb-6 md:mb-0">
                  <SectionTitle label={t.profession} />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    { label: t.occupation, value: data.profession?.occupation },
                    { label: t.organization, value: data.profession?.organizationName },
                    { label: t.employmentType, value: data.profession?.employmentType },
                    { label: t.monthlyIncome, value: formatIncome(data.profession?.monthlyIncome as string) },
                    { label: t.workplace, value: data.profession?.workplaceLocation },
                    ...((data.profession?.extraFields || []).map(f => ({ label: f.label, value: f.value })))
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
              <div className="flex flex-col md:flex-row" style={{ borderTop: '0.5px solid var(--border-muted)', paddingTop: '24px' }}>
                <div className="w-full md:w-1/3 mb-6 md:mb-0">
                  <SectionTitle label={t.family} />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    { label: t.fatherName, value: data.familyInfo?.fatherName },
                    { label: t.fatherProfession, value: data.familyInfo?.fatherProfession },
                    { label: t.motherName, value: data.familyInfo?.motherName },
                    { label: t.motherProfession, value: data.familyInfo?.motherProfession },
                    { label: t.brothers, value: data.familyInfo?.numberOfBrothers?.toString() },
                    { label: t.sisters, value: data.familyInfo?.numberOfSisters?.toString() },
                    { label: t.familyStatus, value: data.familyInfo?.familyStatus, full: true },
                    ...((data.familyInfo?.extraFields || []).map(f => ({ label: f.label, value: f.value })))
                  ].map((item, i) => hasContent(item.value) && item.value !== "NaN" && (
                    <Field
                      key={i}
                      label={item.label}
                      value={item.value}
                      className={item.full ? 'col-span-2' : ''}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section: Marriage Expectations */}
          {hasContent(data.expectations) && (
            <section>
              <div className="flex flex-col md:flex-row" style={{ borderTop: '0.5px solid var(--border-muted)', paddingTop: '24px' }}>
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={t.expectations} />
                </div>
                <div
                  className="w-full md:w-2/3 relative overflow-hidden"
                  style={{
                    background: 'var(--surface)',
                    padding: '32px 40px',
                    color: 'var(--foreground)',
                    border: '0.5px solid var(--border-muted)',
                    borderLeft: '2.5px solid var(--foreground)'
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0">
                    {[
                      { label: t.expectedAge, value: data.expectations?.expectedAgeRange },
                      { label: t.expectedHeight, value: data.expectations?.expectedHeight },
                      { label: t.expectedEducation, value: data.expectations?.expectedEducation },
                      { label: t.expectedProfession, value: data.expectations?.expectedProfession },
                      ...((data.expectations?.extraFields || []).map(f => ({ label: f.label, value: f.value })))
                    ].map((item, i) => hasContent(item.value) && (
                      <div key={i} className="flex flex-col gap-1.5" style={{ borderBottom: '0.5px solid var(--border-muted)', padding: '24px 0' }}>
                        <span
                          className="font-mono uppercase transition-opacity"
                          style={{ fontSize: '8.5px', letterSpacing: '0.15em', color: 'var(--foreground-muted)', opacity: 0.8 }}
                        >
                          {item.label}
                        </span>
                        <span className="font-serif italic whitespace-pre-wrap" style={{ fontSize: '16px', color: 'var(--foreground)', lineHeight: 1.3 }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {hasContent(data.expectations?.additionalExpectations) && (
                    <div style={{ borderTop: '0.5px solid var(--border-muted)', paddingTop: '24px', marginTop: '12px' }}>
                      <p className="font-light italic whitespace-pre-wrap text-foreground-muted" style={{ fontSize: '13px', lineHeight: 1.7 }}>
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
              <div className="flex flex-col md:flex-row" style={{ borderTop: '0.5px solid var(--border-muted)', paddingTop: '24px' }}>
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                  <SectionTitle label={section.title} />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-2 gap-x-12 gap-y-6">
                  {section.fields?.map((field: CustomField, fIdx: number) => hasContent(field.value) && (
                    <Field key={fIdx} label={field.label} value={field.value} />
                  ))}
                </div>
              </div>
            </section>
          ))}

        </div>

        {/* ── Contact Footer ── */}
        {hasContent(data.contactInfo) && (
          <footer className="mt-12" style={{ borderTop: '1.5px solid var(--foreground)', paddingTop: '40px' }}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">

              {/* Left: Contact hierarchy */}
              <div className="space-y-4">
                <p
                  className="font-mono uppercase"
                  style={{ fontSize: '8.5px', letterSpacing: '0.18em', color: 'var(--foreground-muted)' }}
                >
                  {t.contact}
                </p>

                <p
                  className="font-serif tracking-tight"
                  style={{ fontSize: '20px', color: 'var(--foreground)', textDecoration: 'underline', textDecorationColor: 'var(--border-muted)', textUnderlineOffset: '8px' }}
                >
                  {data.contactInfo?.emailAddress || 'Not Provided'}
                </p>

                <div className="flex gap-12">
                  {hasContent(data.contactInfo?.contactNumber) && (
                    <div>
                      <p
                        className="font-mono uppercase mb-1"
                        style={{ fontSize: '8px', letterSpacing: '0.15em', color: 'var(--foreground-muted)' }}
                      >
                        {t.contactNumber}
                      </p>
                      <p className="font-semibold" style={{ fontSize: '13.5px', color: 'var(--foreground)' }}>
                        {formatPhone(data.contactInfo?.contactNumber as string)}
                      </p>
                    </div>
                  )}
                  {hasContent(data.contactInfo?.whatsAppNumber) && (
                    <div>
                      <p
                        className="font-mono uppercase mb-1"
                        style={{ fontSize: '8px', letterSpacing: '0.15em', color: 'var(--foreground-muted)' }}
                      >
                        {t.whatsApp}
                      </p>
                      <p className="font-semibold" style={{ fontSize: '13.5px', color: 'var(--foreground)' }}>
                        {formatPhone(data.contactInfo?.whatsAppNumber as string)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Guardian and Extra Fields */}
              <div className="flex flex-col gap-6 w-full md:w-auto md:min-w-[200px]">
                {hasContent(data.contactInfo?.guardianContact) && (
                  <div style={{ background: 'var(--accent)', padding: '24px 32px', borderLeft: '2px solid var(--border-muted)' }}>
                    <p
                      className="font-mono uppercase mb-1.5"
                      style={{ fontSize: '8px', letterSpacing: '0.15em', color: 'var(--foreground-muted)' }}
                    >
                      {t.guardianContact}
                    </p>
                    <p className="font-bold" style={{ fontSize: '13px', color: 'var(--foreground)' }}>
                      {data.contactInfo?.guardianContact}
                    </p>
                  </div>
                )}

                {data.contactInfo?.extraFields && data.contactInfo.extraFields.length > 0 && (
                  <div className="space-y-4">
                    {data.contactInfo.extraFields.map((field, i) => hasContent(field.value) && (
                      <div key={`contact_extra_${i}`}>
                        <p
                          className="font-mono uppercase mb-1"
                          style={{ fontSize: '8px', letterSpacing: '0.15em', color: 'var(--foreground-muted)' }}
                        >
                          {field.label}
                        </p>
                        <p className="font-semibold" style={{ fontSize: '13.5px', color: 'var(--foreground)' }}>
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </footer>
        )}

        {/* ── Platform Footer (always shown) ── */}
        <div
          className="flex justify-between items-center font-mono uppercase mt-12"
          style={{
            borderTop: '0.5px solid var(--border-muted)',
            paddingTop: '16px',
            fontSize: '8px',
            letterSpacing: '0.18em',
            color: 'var(--foreground-muted)',
          }}
        >
          <span>Generated by BiyeProfile</span>
          <span>·</span>
          <span>biyeprofile.com</span>
          <span>·</span>
          <span>Confidential</span>
        </div>

      </div>
    </div>
  );
}
