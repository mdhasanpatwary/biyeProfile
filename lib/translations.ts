export interface TranslationMap {
  nav: {
    biodatas: string
    create: string
    dashboard: string
    signIn: string
    myBiodata: string
    signOut: string
    admin: string
  }
  footer: {
    tagline: string
    quickLinks: string
    legal: string
    privacy: string
    terms: string
    rights: string
    home: string
    allBiodatas: string
    createBiodata: string
  }
  common: {
    search: string
    searchPlaceholder: string
    filterByReligion: string
    allReligions: string
    clearFilters: string
    noResults: string
    noResultsSub: string
    viewBiodata: string
    viewFullBiodata: string
    editBiodata: string
    createBiodata: string
    copyLink: string
    linkCopied: string
    backToHome: string
    yearsOld: string
    male: string
    female: string
    loading: string
    save: string
    cancel: string
  }
  biodataCard: {
    age: string
    height: string
    religion: string
    maritalStatus: string
    profession: string
    location: string
    district: string
    viewProfile: string
    unspecified: string
  }
  home: {
    badge: string
    heroTitle: string
    heroSubtitle: string
    createBtn: string
    browseBtn: string
    feature1Title: string
    feature1Desc: string
    feature2Title: string
    feature2Desc: string
    feature3Title: string
    feature3Desc: string
    statsProfiles: string
    statsPdf: string
    statsPrivacy: string
    howItWorksTitle: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
    faqTitle: string
    ctaTitle: string
    ctaSubtitle: string
    faqs: Array<{ question: string; answer: string }>
  }
  browse: {
    title: string
    subtitle: string
    totalCount: string
    searchLabel: string
    faqs: Array<{ question: string; answer: string }>
  }
  create: {
    title: string
    guideTitle: string
    guideDesc: string
    stepsTitle: string
    steps: Array<{ name: string; text: string }>
    commonQuestionsTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
  dashboard: {
    title: string
    subtitle: string
    profileStatus: string
    public: string
    private: string
    views: string
    actions: string
    visibilityNotice: string
    createPrompt: string
  }
  auth: {
    signInTitle: string
    signInSubtitle: string
    continueGoogle: string
    or: string
    privacyNotice: string
  }
}

export const translations: Record<"en" | "bn", TranslationMap> = {
  en: {
    nav: {
      biodatas: "Biodatas",
      create: "Create",
      dashboard: "Dashboard",
      signIn: "Sign In",
      myBiodata: "My Biodata",
      signOut: "Sign Out",
      admin: "Admin",
    },
    footer: {
      tagline: "Free Marriage Biodata Maker Online. Create, manage & share professional profiles with complete privacy.",
      quickLinks: "Quick Links",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "All rights reserved.",
      home: "Home",
      allBiodatas: "All Biodatas",
      createBiodata: "Create Biodata",
    },
    common: {
      search: "Search",
      searchPlaceholder: "Search by name, occupation or district...",
      filterByReligion: "Filter by Religion",
      allReligions: "All Religions",
      clearFilters: "Clear Filters",
      noResults: "No biodatas found",
      noResultsSub: "Try adjusting your search query or filters.",
      viewBiodata: "View Biodata",
      viewFullBiodata: "View Full Profile",
      editBiodata: "Edit Biodata",
      createBiodata: "Create Biodata",
      copyLink: "Copy Link",
      linkCopied: "Link Copied!",
      backToHome: "Back to Home",
      yearsOld: "Years Old",
      male: "Male",
      female: "Female",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
    },
    biodataCard: {
      age: "Age",
      height: "Height",
      religion: "Religion",
      maritalStatus: "Marital Status",
      profession: "Profession",
      location: "Location",
      district: "District",
      viewProfile: "View Biodata",
      unspecified: "Unspecified",
    },
    home: {
      badge: "Free Marriage Biodata Maker Online",
      heroTitle: "Create Your Marriage Biodata Effortlessly",
      heroSubtitle: "Design a clean, elegant, and secure marriage profile in minutes. Export to PDF or share with a private link.",
      createBtn: "Create Free Biodata",
      browseBtn: "Browse Biodatas",
      feature1Title: "100% Free & Instant",
      feature1Desc: "No hidden fees or subscriptions. Build and download your complete PDF profile instantly.",
      feature2Title: "Complete Privacy Control",
      feature2Desc: "Control profile visibility. Keep it unlisted or share only via secure link with trusted family members.",
      feature3Title: "Professional PDF Export",
      feature3Desc: "Clean, beautifully formatted PDF templates optimized for printed or digital sharing.",
      statsProfiles: "Biodatas Created",
      statsPdf: "PDF Downloads",
      statsPrivacy: "Privacy Protection",
      howItWorksTitle: "How It Works in 3 Simple Steps",
      step1Title: "1. Fill Information",
      step1Desc: "Enter your personal, educational, family, and professional details in our structured form.",
      step2Title: "2. Set Privacy",
      step2Desc: "Decide whether your biodata is public or private with easy visibility controls.",
      step3Title: "3. Share & Export",
      step3Desc: "Download a crisp PDF or share a direct link with prospective families.",
      faqTitle: "Frequently Asked Questions",
      ctaTitle: "Ready to create your marriage biodata?",
      ctaSubtitle: "Join thousands of users who built their professional marriage profiles with BiyeProfile.",
      faqs: [
        {
          question: "Is BiyeProfile a free marriage biodata maker?",
          answer: "Yes. BiyeProfile is a free marriage biodata maker online. You can create, customize, and download a complete marriage biodata at no cost. Simply sign up, fill in your details, and export your professional PDF biodata for free."
        },
        {
          question: "How do I create a marriage biodata online?",
          answer: "BiyeProfile is the easiest free marriage biodata maker online. Create a marriage biodata by signing up, completing your personal, educational, and family information through our structured form, and publishing your profile. You can share it via a private link or download a professional PDF."
        },
        {
          question: "Is my marriage biodata private and secure?",
          answer: "Yes, your marriage biodata is private by default. Our infrastructure is built on principles of isolation and encryption. You can generate a secure, private shareable link for guardians or keep it completely unlisted from search engines."
        },
        {
          question: "What is a marriage biodata?",
          answer: "A marriage biodata is a comprehensive document used in many cultures to introduce an individual's personal, educational, family, and professional background to potential life partners and their families. It serves as a formal profile for arranged marriage introductions."
        },
        {
          question: "Is BiyeProfile free to use?",
          answer: "Yes, BiyeProfile is 100% free to use. You can create a complete marriage biodata, share it via a secure link, and download it as a professionally formatted PDF without any hidden costs."
        }
      ]
    },
    browse: {
      title: "Explore Marriage Biodatas",
      subtitle: "Browse public profiles to find your potential life partner across Bangladesh and beyond.",
      totalCount: "Public Profiles",
      searchLabel: "Search Profiles",
      faqs: [
        {
          question: "How can I find marriage biodata for a specific district?",
          answer: "You can find marriage biodata for specific districts by using the search bar on our directory page. Simply type the name of the district (e.g., Dhaka, Sylhet, Chittagong) to filter profiles by location."
        },
        {
          question: "Is it possible to filter biodata by religion?",
          answer: "Yes, BiyeProfile allows you to filter the marriage biodata directory by religion. You can select your preferred religion from the filter options to find matching profiles."
        }
      ]
    },
    create: {
      title: "Create Marriage Biodata",
      guideTitle: "Quick Guide to Creating a Biodata",
      guideDesc: "Creating a marriage biodata on BiyeProfile involves five simple steps: entering basic info, adding education/profession, providing family history, setting expectations, and exporting as PDF. Our tool ensures your profile is structured professionally and respects your privacy.",
      stepsTitle: "Creation Steps",
      steps: [
        { name: "Enter basic information", text: "Provide your full name, date of birth, religion, and contact details." },
        { name: "Add education and profession", text: "List your educational qualifications and current occupation details." },
        { name: "Describe family background", text: "Include information about your parents and siblings." },
        { name: "Set partner expectations", text: "Define the qualities you are looking for in a life partner." },
        { name: "Download PDF", text: "Export your completed biodata as a professionally formatted PDF document." }
      ],
      commonQuestionsTitle: "Common Questions",
      faqs: [
        {
          question: "How long does it take to create a marriage biodata?",
          answer: "With BiyeProfile's structured form, you can create a complete, professional marriage biodata in less than 10 minutes."
        },
        {
          question: "Can I edit my biodata after creating it?",
          answer: "Yes, if you sign up for an account, you can save your progress and edit your biodata at any time. Guest users can also edit while their session is active."
        }
      ]
    },
    dashboard: {
      title: "Your Dashboard",
      subtitle: "Manage your marriage biodata profile, privacy settings, and sharing links.",
      profileStatus: "Profile Status",
      public: "Public",
      private: "Private",
      views: "Profile Views",
      actions: "Quick Actions",
      visibilityNotice: "Public profiles are discoverable in the search directory. Private profiles are only accessible via direct link.",
      createPrompt: "You haven't created a biodata profile yet.",
    },
    auth: {
      signInTitle: "Sign In to BiyeProfile",
      signInSubtitle: "Access and manage your marriage biodata anytime.",
      continueGoogle: "Continue with Google",
      or: "OR",
      privacyNotice: "By signing in, you agree to our Terms of Service and Privacy Policy.",
    }
  },
  bn: {
    nav: {
      biodatas: "সকল বায়োডাটা",
      create: "বায়োডাটা তৈরি",
      dashboard: "ড্যাশবোর্ড",
      signIn: "সাইন ইন",
      myBiodata: "আমার বায়োডাটা",
      signOut: "সাইন আউট",
      admin: "এডমিন",
    },
    footer: {
      tagline: "ফ্রি ম্যারেজ বায়োডাটা মেকার অনলাইন। সম্পূর্ণ গোপনীয়তার সাথে প্রফেশনাল বায়োডাটা তৈরি ও শেয়ার করুন।",
      quickLinks: "দ্রুত লিঙ্ক",
      legal: "আইনি ও গোপনীয়তা",
      privacy: "গোপনীয়তা নীতি",
      terms: "ব্যবহারের শর্তাবলী",
      rights: "সর্বস্বত্ব সংরক্ষিত।",
      home: "হোম",
      allBiodatas: "সকল বায়োডাটা",
      createBiodata: "বায়োডাটা তৈরি করুন",
    },
    common: {
      search: "খুঁজুন",
      searchPlaceholder: "নাম, পেশা বা জেলা লিখে খুঁজুন...",
      filterByReligion: "ধর্ম অনুযায়ী ফিল্টার",
      allReligions: "সকল ধর্ম",
      clearFilters: "ফিল্টার সরান",
      noResults: "কোন বায়োডাটা পাওয়া যায়নি",
      noResultsSub: "অন্য শব্দ বা ফিল্টার ব্যবহার করে চেষ্টা করুন।",
      viewBiodata: "বায়োডাটা দেখুন",
      viewFullBiodata: "সম্পূর্ণ বায়োডাটা দেখুন",
      editBiodata: "বায়োডাটা এডিট করুন",
      createBiodata: "বায়োডাটা তৈরি করুন",
      copyLink: "লিঙ্ক কপি করুন",
      linkCopied: "লিঙ্ক কপি হয়েছে!",
      backToHome: "হোমে ফিরে যান",
      yearsOld: "বছর",
      male: "পাত্র",
      female: "পাত্রী",
      loading: "লোড হচ্ছে...",
      save: "সংরক্ষণ করুন",
      cancel: "বাতিল করুন",
    },
    biodataCard: {
      age: "বয়স",
      height: "উচ্চতা",
      religion: "ধর্ম",
      maritalStatus: "বৈবাহিক অবস্থা",
      profession: "পেশা",
      location: "অবস্থান",
      district: "জেলা",
      viewProfile: "বায়োডাটা দেখুন",
      unspecified: "উল্লেখিত নয়",
    },
    home: {
      badge: "ফ্রি ম্যারেজ বায়োডাটা মেকার অনলাইন",
      heroTitle: "সহজেই তৈরি করুন সুন্দর ম্যারেজ বায়োডাটা",
      heroSubtitle: "মাত্র কয়েক মিনিটে পরিচ্ছন্ন ও মার্জিত বায়োডাটা তৈরি করুন। পিডিএফ ডাউনলোড করুন অথবা প্রাইভেট লিঙ্কে শেয়ার করুন।",
      createBtn: "ফ্রি বায়োডাটা তৈরি করুন",
      browseBtn: "বায়োডাটা খুঁজুন",
      feature1Title: "১০০% ফ্রি ও তাৎক্ষণিক",
      feature1Desc: "কোন গোপন ফি বা সাবস্ক্রিপশন নেই। সরাসরি বিনামূল্যে সুন্দর পিডিএফ বায়োডাটা ডাউনলোড করুন।",
      feature2Title: "সম্পূর্ণ প্রাইভেসি কন্ট্রোল",
      feature2Desc: "আপনার বায়োডাটার দৃশ্যমানতা নিয়ন্ত্রণ করুন। পাবলিক না করে শুধু লিঙ্ক দিয়ে পরিবারের সাথে শেয়ার করুন।",
      feature3Title: "প্রফেশনাল পিডিএফ এক্সপোর্ট",
      feature3Desc: "ছাপা বা ডিজিটাল যেকোনো উপায়ে শেয়ার করার জন্য পরিচ্ছন্ন ও প্রফেশনাল পিডিএফ ফরম্যাট।",
      statsProfiles: "তৈরিকৃত বায়োডাটা",
      statsPdf: "পিডিএফ ডাউনলোড",
      statsPrivacy: "প্রাইভেসি সুরক্ষা",
      howItWorksTitle: "৩টি সহজ ধাপে বায়োডাটা তৈরি",
      step1Title: "১. তথ্য পূরণ করুন",
      step1Desc: "আমাদের সহজ ফর্মে আপনার ব্যক্তিগত, শিক্ষাগত, পারিবারিক ও পেশাগত তথ্য দিন।",
      step2Title: "২. প্রাইভেসি নির্বাচন করুন",
      step2Desc: "সহজ সেটিংসের মাধ্যমে বায়োডাটা পাবলিক রাখবেন নাকি প্রাইভেট রাখবেন ঠিক করুন।",
      step3Title: "৩. শেয়ার ও ডাউনলোড করুন",
      step3Desc: "প্রফেশনাল পিডিএফ ডাউনলোড করুন অথবা সরাসরি লিঙ্ক শেয়ার করুন।",
      faqTitle: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী",
      ctaTitle: "বায়োডাটা তৈরি করতে প্রস্তুত?",
      ctaSubtitle: "BiyeProfile ব্যবহার করে হাজার হাজার মানুষ তাদের প্রফেশনাল বিবাহের বায়োডাটা তৈরি করেছেন।",
      faqs: [
        {
          question: "BiyeProfile কি একটি বিনামূল্যে ম্যারেজ বায়োডাটা মেকার?",
          answer: "হ্যাঁ, BiyeProfile একটি সম্পূর্ণ ফ্রি অনলাইন ম্যারেজ বায়োডাটা মেকার। আপনি কোনো খরচ ছাড়াই সম্পূর্ণ বিনামূল্যে বায়োডাটা তৈরি, কাস্টমাইজ এবং প্রফেশনাল পিডিএফ ডাউনলোড করতে পারবেন।"
        },
        {
          question: "অনলাইনে কীভাবে ম্যারেজ বায়োডাটা তৈরি করবেন?",
          answer: "BiyeProfile-এ অ্যাকাউন্ট খুলে আমাদের সহজ ফর্মের মাধ্যমে আপনার ব্যক্তিগত, শিক্ষাগত ও পারিবারিক তথ্য পূরণ করে অতি সহজেই সুন্দর বায়োডাটা তৈরি করা যায়। আপনি এটি প্রাইভেট লিঙ্কে শেয়ার করতে বা প্রফেশনাল পিডিএফ ডাউনলোড করতে পারবেন।"
        },
        {
          question: "আমার বায়োডাটা কি নিরাপদ ও গোপন থাকবে?",
          answer: "হ্যাঁ, আপনার বায়োডাটা বাই-ডিফল্ট সম্পূর্ণ প্রাইভেট ও সুরক্ষিত থাকে। আপনি গোপনীয়তা সেটিংসের মাধ্যমে একটি সুরক্ষিত শেয়ারেবল প্রাইভেট লিঙ্ক তৈরি করতে পারেন অথবা সার্চ ইঞ্জিন থেকে সম্পূর্ণ গোপনে রাখতে পারেন।"
        },
        {
          question: "ম্যারেজ বায়োডাটা বা বিবাহের বায়োডাটা কী?",
          answer: "ম্যারেজ বায়োডাটা হলো পাত্র বা পাত্রীর ব্যক্তিগত, শিক্ষাগত, পারিবারিক ও পেশাগত তথ্যের একটি পূর্ণাঙ্গ বিবরণ, যা বিয়ের প্রস্তাবের সময় সম্ভাব্য জীবনসঙ্গী ও তাদের পরিবারের কাছে আত্মপ্রকাশের মাধ্যম হিসেবে ব্যবহৃত হয়।"
        },
        {
          question: "BiyeProfile ব্যবহার করা কি সম্পূর্ণ ফ্রি?",
          answer: "হ্যাঁ, BiyeProfile ১০০% ফ্রি। কোনো গোপন ফি ছাড়াই আপনি বায়োডাটা তৈরি, প্রাইভেট লিঙ্ক শেয়ার এবং সুন্দর পিডিএফ ডাউনলোড করতে পারবেন।"
        }
      ]
    },
    browse: {
      title: "বায়োডাটা সমূহ খুঁজুন",
      subtitle: "সারা বাংলাদেশের পাত্র-পাত্রীদের পাবলিক বায়োডাটা থেকে আপনার জীবনসঙ্গী খুঁজুন।",
      totalCount: "পাবলিক বায়োডাটা",
      searchLabel: "বায়োডাটা ফিল্টার করুন",
      faqs: [
        {
          question: "নির্দিষ্ট জেলার বায়োডাটা কীভাবে খুঁজবেন?",
          answer: "আমাদের ডিরেক্টরি পেজে সার্চ বার ব্যবহার করে আপনার নির্দিষ্ট জেলার নাম (যেমন: ঢাকা, সিলেট, চট্টগ্রাম) টাইপ করে স্থান অনুযায়ী পাত্র-পাত্রীর বায়োডাটা খুঁজে পেতে পারেন।"
        },
        {
          question: "ধর্ম অনুযায়ী বায়োডাটা ফিল্টার করা কি সম্ভব?",
          answer: "হ্যাঁ, BiyeProfile-এ ধর্ম অনুযায়ী বায়োডাটা ফিল্টার করার ব্যবস্থা রয়েছে। ফিল্টার অপশন থেকে আপনার কাঙ্ক্ষিত ধর্ম নির্বাচন করে সহজেই বায়োডাটা দেখতে পারবেন।"
        }
      ]
    },
    create: {
      title: "বায়োডাটা তৈরি করুন",
      guideTitle: "বায়োডাটা তৈরির সহজ নির্দেশিকা",
      guideDesc: "BiyeProfile-এ বায়োডাটা তৈরি করার সহজ ধাপগুলো হলো: মৌলিক তথ্য দেওয়া, শিক্ষা ও পেশা যোগ করা, পারিবারিক বিবরণ দেওয়া, জীবনসঙ্গীর প্রত্যাশা ঠিক করা এবং পিডিএফ আকারে ডাউনলোড করা। আমাদের টুলটি আপনার প্রোফাইলকে প্রফেশনাল ও নিরাপদ রাখে।",
      stepsTitle: "তৈরির ধাপসমূহ",
      steps: [
        { name: "মৌলিক তথ্য দিন", text: "আপনার নাম, জন্মতারিখ, ধর্ম ও যোগাযোগের তথ্য পূরণ করুন।" },
        { name: "শিক্ষা ও পেশা যোগ করুন", text: "আপনার শিক্ষাগত যোগ্যতা ও বর্তমান পেশার বিবরণ দিন।" },
        { name: "পারিবারিক বিবরণ দিন", text: "বাবা-মা ও ভাইবোনদের সম্পর্কিত তথ্য দিন।" },
        { name: "জীবনসঙ্গীর প্রত্যাশা লিখুন", text: "আপনি কেমন জীবনসঙ্গী খুঁজছেন তা উল্লেখ করুন।" },
        { name: "পিডিএফ ডাউনলোড করুন", text: "আপনার বায়োডাটা প্রফেশনাল পিডিএফ ফরম্যাটে এক্সপোর্ট করুন।" }
      ],
      commonQuestionsTitle: "সাধারণ প্রশ্নাবলী",
      faqs: [
        {
          question: "বায়োডাটা তৈরি করতে কত সময় লাগে?",
          answer: "BiyeProfile-এর সুসংগঠিত ফর্মের সাহায্যে মাত্র ১০ মিনিটেরও কম সময়ে আপনি একটি পূর্ণাঙ্গ প্রফেশনাল বায়োডাটা তৈরি করতে পারবেন।"
        },
        {
          question: "বায়োডাটা তৈরির পর কি তা সংশোধন বা এডিট করা সম্ভব?",
          answer: "হ্যাঁ, অ্যাকাউন্ট তৈরি করলে আপনি যেকোনো সময় আপনার বায়োডাটা পরিবর্তন বা আপডেট করতে পারবেন।"
        }
      ]
    },
    dashboard: {
      title: "আপনার ড্যাশবোর্ড",
      subtitle: "আপনার বায়োডাটা, প্রাইভেসি সেটিংস এবং শেয়ারিং লিঙ্ক পরিচালনা করুন।",
      profileStatus: "প্রোফাইল স্ট্যাটাস",
      public: "পাবলিক",
      private: "প্রাইভেট",
      views: "প্রোফাইল ভিউ",
      actions: "দ্রুত অ্যাকশন",
      visibilityNotice: "পাবলিক প্রোফাইল সবাই সার্চ ডিরেক্টরিতে দেখতে পাবে। প্রাইভেট প্রোফাইল শুধুমাত্র ডিরেক্ট লিঙ্কের মাধ্যমে দেখা যাবে।",
      createPrompt: "আপনি এখনও কোনো বায়োডাটা প্রোফাইল তৈরি করেননি।",
    },
    auth: {
      signInTitle: "BiyeProfile-এ সাইন ইন করুন",
      signInSubtitle: "যেকোনো সময় আপনার বায়োডাটা প্রবেশ ও পরিবর্তন করুন।",
      continueGoogle: "Google দিয়ে সাইন ইন করুন",
      or: "অথবা",
      privacyNotice: "সাইন ইন করার মাধ্যমে আপনি আমাদের ব্যবহারের শর্তাবলী এবং গোপনীয়তা নীতি মেনে নিচ্ছেন।",
    }
  }
}
