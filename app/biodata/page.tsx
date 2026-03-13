import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { BiodataCard } from "@/components/BiodataCard"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { SearchInput } from "@/components/SearchInput"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RELIGION_OPTIONS } from "@/lib/constants/biodata-options"
import { Metadata } from "next"

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

    // Fetch profiles with case-insensitive search if query exists
    let biodata;

    if (q) {
        // Use raw query for case-insensitive JSON search in Postgres
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
        <div className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(browseFaqSchema) }}
            />

            <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 md:py-16">

                {/* Intro */}
                <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
                    <div className="md:max-w-xl text-center md:text-left">
                        <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground-muted mb-8">Directory / 01</div>
                        <h1 className="text-5xl font-serif text-foreground tracking-tight leading-none mb-8">
                            Explore Profiles
                        </h1>

                        <p className="text-foreground-muted font-medium text-lg leading-relaxed md:max-w-md mb-6">
                            A curated list of public marriage biodata entries. Refined, secure, and ready for your connection.
                        </p>
                    </div>

                    {/* Minimal Filter & Search */}
                    <div className="flex flex-col gap-6 md:min-w-[320px]">
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-foreground-muted text-center md:text-left">Filter by Religion</span>
                            <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                                <div className="flex flex-nowrap justify-center md:justify-start md:flex-wrap gap-2 pb-2 md:pb-0">
                                    <Link
                                        href={`/biodata${q ? `?q=${encodeURIComponent(q)}` : ''}`}
                                        aria-current={!religion ? "true" : undefined}
                                        className={`shrink-0 px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${!religion ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-foreground-muted border-border-muted hover:border-foreground-muted'}`}
                                    >
                                        All
                                    </Link>
                                    {religions.map((r) => (
                                        <Link
                                            key={r}
                                            href={`/biodata?religion=${r}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                                            aria-current={religion === r ? "true" : undefined}
                                            className={`shrink-0 px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${religion === r ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-foreground-muted border-border-muted hover:border-foreground-muted'}`}
                                        >
                                            {r}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Search Input & Results Count */}
                        <div className="w-full flex flex-col gap-3">
                            <SearchInput initialQuery={q || ""} />
                            <div className="text-right">
                                <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-foreground-muted">
                                    {biodata.length} Results
                                </span>
                            </div>
                        </div>
                    </div>
                </header>


                {/* The List (Editorial Style) */}
                {biodata.length > 0 ? (
                    <div className="flex flex-col border-t border-border-muted pb-8 md:pb-12">
                        {biodata.map((item) => (
                            <BiodataCard
                                key={item.id}
                                username={item.user.username!}
                                data={item.data as unknown as Partial<BiodataFormValues>}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="pt-16 md:pt-24 pb-8 md:pb-12 text-center border-t border-border-muted">

                        {/* Icon */}
                        <div className="w-16 h-16 border border-border-muted flex items-center justify-center mx-auto mb-10">
                            <svg className="w-6 h-6 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Heading */}
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted mb-4">
                            No Results
                        </p>
                        <h3 className="text-3xl md:text-4xl font-serif italic text-foreground mb-4 tracking-tight">
                            {q ? <>Nothing found for &ldquo;{q}&rdquo;</> : <>No profiles match<br />these filters.</>}
                        </h3>
                        <p className="text-sm text-foreground-muted font-medium max-w-xs mx-auto leading-relaxed mb-12">
                            {q
                                ? "Try a different name, district, or occupation. You can also remove the religion filter below."
                                : "This religion filter currently has no public profiles. Try browsing all profiles instead."
                            }
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link href="/biodata">
                                <Button variant="primary" className="px-8">
                                    Browse All Profiles
                                </Button>
                            </Link>
                            {(q && religion) && (
                                <Link href={`/biodata?religion=${religion}`}>
                                    <Button variant="outline" className="px-8">
                                        Clear Search
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Suggestion: Try other religions */}
                        <div className="border-t border-border-muted/50 pt-10 max-w-sm mx-auto">
                            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted mb-6">
                                Try browsing by
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {religions.filter(r => r !== religion).map((r) => (
                                    <Link
                                        key={r}
                                        href={`/biodata?religion=${r}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                                        className="px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border border-border-muted text-foreground-muted hover:border-foreground hover:text-foreground transition-all"
                                    >
                                        {r}
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* SEO Content Section at bottom */}
                <div className="mt-32 pt-24 border-t border-border-muted max-w-3xl mx-auto px-6 sm:px-0">
                    <div className="mb-20">
                        <h2 className="text-3xl font-serif text-foreground mb-8 italic">Understanding Marriage Biodata</h2>
                        <div className="prose prose-sm prose-neutral">
                            <p className="text-foreground-muted text-base leading-relaxed font-medium mb-6">
                                <span className="text-foreground font-bold">What is a marriage biodata?</span> A marriage biodata is a structured document that provides a comprehensive overview of an individual&apos;s personal background, including their identity, religion, education, profession, family history, and partner expectations. It is a critical tool for introductions in the arranged marriage process, facilitating transparency and informed decision-making.
                            </p>
                            <p className="text-foreground-muted text-base leading-relaxed font-medium">
                                BiyeProfile provides a secure and professional environment for these introductions. Our directory features verified marriage biodata from across Bangladesh and beyond, allowing you to filter by religion, profession, and location while maintaining the highest standards of privacy.
                            </p>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-border-muted">
                        <h2 className="text-2xl font-serif text-foreground mb-12 italic">Frequently Asked Questions</h2>
                        <div className="space-y-12 pb-24">
                            {browseFaqSchema.mainEntity.map((faq, i) => (
                                <div key={i} className="group">
                                    <h3 className="text-lg font-serif text-foreground mb-3 opacity-90 group-hover:opacity-100 transition-opacity tracking-tight font-bold">
                                        {faq.name}
                                    </h3>
                                    <p className="text-foreground-muted text-base font-medium tracking-tight leading-relaxed">
                                        {faq.acceptedAnswer.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>

        </div>
    )
}
