import { auth } from "@/lib/auth"
import { Metadata } from "next"
import { HomePageContent } from "@/components/HomePageContent"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default async function Home() {
  const session = await auth()

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is BiyeProfile a free marriage biodata maker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. BiyeProfile is a free marriage biodata maker online. You can create, customize, and download a complete marriage biodata at no cost. Simply sign up, fill in your details, and export your professional PDF biodata for free."
        }
      },
      {
        "@type": "Question",
        "name": "How do I create a marriage biodata online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BiyeProfile is the easiest free marriage biodata maker online. Create a marriage biodata by signing up, completing your personal, educational, and family information through our structured form, and publishing your profile. You can share it via a private link or download a professional PDF."
        }
      },
      {
        "@type": "Question",
        "name": "Is my marriage biodata private and secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, your marriage biodata is private by default. Our infrastructure is built on principles of isolation and encryption. You can generate a secure, private shareable link for guardians or keep it completely unlisted from search engines."
        }
      },
      {
        "@type": "Question",
        "name": "What is a marriage biodata?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A marriage biodata is a comprehensive document used in many cultures to introduce an individual's personal, educational, family, and professional background to potential life partners and their families. It serves as a formal profile for arranged marriage introductions."
        }
      },
      {
        "@type": "Question",
        "name": "Is BiyeProfile free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BiyeProfile is 100% free to use. You can create a complete marriage biodata, share it via a secure link, and download it as a professionally formatted PDF without any hidden costs."
        }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to create a marriage biodata online for free using BiyeProfile",
    "description": "BiyeProfile is the best free marriage biodata maker online. Create, manage, and export professional marriage biodata in PDF format with complete privacy controls at no cost.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Register Account",
        "text": "Sign up for a free BiyeProfile account using your email."
      },
      {
        "@type": "HowToStep",
        "name": "Input Biodata Details",
        "text": "Fill in your personal, educational, family, and professional information in our structured form."
      },
      {
        "@type": "HowToStep",
        "name": "Set Privacy Settings",
        "text": "Choose to keep your profile private or list it in our public directory."
      },
      {
        "@type": "HowToStep",
        "name": "Download PDF",
        "text": "Export your completed marriage biodata as a professionally formatted PDF document."
      }
    ]
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BiyeProfile",
    "url": "https://biye-profile.vercel.app",
    "logo": "https://biye-profile.vercel.app/icon.svg",
    "description": "BiyeProfile is a premium, secure digital platform dedicated to helping individuals create and manage professional marriage biodata with privacy and elegance.",
    "foundingDate": "2026-03-01",
    "sameAs": [
      "https://facebook.com/biyeprofile",
      "https://twitter.com/biyeprofile"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BiyeProfile",
    "url": "https://biye-profile.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://biye-profile.vercel.app/biodata?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomePageContent hasUser={!!session?.user} faqSchema={faqSchema} />
    </>
  )
}
