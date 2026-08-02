import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { GuestBiodataEditor } from "@/components/GuestBiodataEditor"
import { CreatePageHeader, CreatePageGuide } from "@/components/CreatePageGuide"

export const metadata = {
  title: "Create Biodata | BiyeProfile",
  description: "Create your marriage biodata in minutes.",
}

export default async function CreatePage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to create a professional marriage biodata",
    "description": "A step-by-step guide to creating a high-quality marriage biodata for introductions.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter basic information",
        "text": "Provide your full name, date of birth, religion, and contact details."
      },
      {
        "@type": "HowToStep",
        "name": "Add education and profession",
        "text": "List your educational qualifications and current occupation details."
      },
      {
        "@type": "HowToStep",
        "name": "Describe family background",
        "text": "Include information about your parents and siblings."
      },
      {
        "@type": "HowToStep",
        "name": "Set partner expectations",
        "text": "Define the qualities you are looking for in a life partner."
      },
      {
        "@type": "HowToStep",
        "name": "Download PDF",
        "text": "Export your completed biodata as a professionally formatted PDF document."
      }
    ]
  };

  const creationFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does it take to create a marriage biodata?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "With BiyeProfile's structured form, you can create a complete, professional marriage biodata in less than 10 minutes."
        }
      },
      {
        "@type": "Question",
        "name": "Can I edit my biodata after creating it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, if you sign up for an account, you can save your progress and edit your biodata at any time. Guest users can also edit while their session is active."
        }
      }
    ]
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creationFaqSchema) }}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <CreatePageHeader />
        
        <GuestBiodataEditor />

        {/* SEO Content Section at bottom */}
        <CreatePageGuide 
          fallbackSteps={howToSchema.step} 
          fallbackFaqs={creationFaqSchema.mainEntity} 
        />
      </div>
    </div>
  )
}
