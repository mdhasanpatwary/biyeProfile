import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { GuestBiodataEditor } from "@/components/GuestBiodataEditor"

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
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl font-serif text-foreground mb-6 italic">Create Marriage Biodata</h1>
        </div>
        
        <GuestBiodataEditor />

        {/* SEO Content Section at bottom */}
        <div className="mt-32 pt-24 border-t border-border-muted max-w-3xl mx-auto px-6 sm:px-0">
          <div className="mb-20">
            <h2 className="text-3xl font-serif text-foreground mb-8 italic">Quick Guide to Creating a Biodata</h2>
            <div className="prose prose-sm prose-neutral">
              <p className="text-foreground-muted text-base leading-relaxed font-medium mb-6">
                <span className="text-foreground font-bold">How to create a biodata for marriage?</span> Creating a marriage biodata on BiyeProfile involves five simple steps: entering basic info, adding education/profession, providing family history, setting expectations, and exporting as PDF. Our tool ensures your profile is structured professionally and respects your privacy.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 bg-surface/30 p-8 rounded-sm">
                <div>
                  <h3 className="text-sm font-mono font-black uppercase tracking-widest text-foreground-muted mb-4 underline decoration-foreground/20 underline-offset-4">Creation Steps</h3>
                  <ul className="space-y-3 text-[13px] text-foreground-muted font-medium list-none">
                    {howToSchema.step.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-foreground-muted/40">{i+1}.</span>
                        <span><span className="text-foreground font-bold">{step.name}:</span> {step.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-mono font-black uppercase tracking-widest text-foreground-muted mb-4 underline decoration-foreground/20 underline-offset-4">Common Questions</h3>
                  <div className="space-y-6">
                    {creationFaqSchema.mainEntity.map((faq, i) => (
                      <div key={i}>
                        <p className="text-[13px] text-foreground font-bold mb-1">{faq.name}</p>
                        <p className="text-[12px] text-foreground-muted leading-relaxed font-medium">{faq.acceptedAnswer.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
