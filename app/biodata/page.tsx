import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { RELIGION_OPTIONS } from "@/lib/constants/biodata-options"
import { Metadata } from "next"
import { BrowseBiodataContent } from "@/components/BrowseBiodataContent"

export const metadata: Metadata = {
  title: "Explore Marriage Biodata | BiyeProfile",
  description: "Browse all public marriage biodata profiles. Find your life partner from our curated directory of professional biodatas.",
  alternates: {
    canonical: "/biodata",
  },
}

export const dynamic = "force-dynamic"

export default async function BrowseBiodataPage(props: {
  searchParams: Promise<{ religion?: string; district?: string; q?: string }>
}) {
  const searchParams = await props.searchParams
  const religion = searchParams.religion
  const q = searchParams.q

  let biodata;

  if (q) {
    const results = await prisma.$queryRaw`
      SELECT b."id"
      FROM "Biodata" b
      WHERE b."isPublic" = true
      ${religion ? Prisma.sql`AND b."data"->'basicInfo'->>'religion' = ${religion}` : Prisma.sql``}
      AND (
        b."data"->'basicInfo'->>'fullName' ILIKE ${`%${q}%`}
        OR b."data"->'profession'->>'occupation' ILIKE ${`%${q}%`}
        OR b."data"->'personalInfo'->>'district' ILIKE ${`%${q}%`}
      )
      ORDER BY b."createdAt" DESC
      LIMIT 48
    ` as { id: string }[];

    const ids = results.map(r => r.id);

    biodata = await prisma.biodata.findMany({
      where: { id: { in: ids } },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    biodata = await prisma.biodata.findMany({
      where: {
        isPublic: true,
        ...(religion ? {
          data: {
            path: ['basicInfo', 'religion'],
            equals: religion
          }
        } : {}),
      },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
      take: 48
    });
  }

  const religions = RELIGION_OPTIONS

  const browseFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I find marriage biodata for a specific district?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can find marriage biodata for specific districts by using the search bar on our directory page. Simply type the name of the district (e.g., Dhaka, Sylhet, Chittagong) to filter profiles by location."
        }
      },
      {
        "@type": "Question",
        "name": "Is it possible to filter biodata by religion?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BiyeProfile allows you to filter the marriage biodata directory by religion. You can select your preferred religion from the filter options to find matching profiles."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(browseFaqSchema) }}
      />
      <BrowseBiodataContent
        biodata={biodata}
        religion={religion}
        q={q}
        religions={religions}
        browseFaqSchema={browseFaqSchema}
      />
    </>
  )
}
