import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { BiodataCard } from "@/components/BiodataCard"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { SearchInput } from "@/components/SearchInput"
import Link from "next/link"

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

    const religions = ["Muslim", "Hindu", "Christian", "Buddhist"]

    return (
        <div className="min-h-screen bg-background">

            <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 md:py-16">

                {/* Intro */}
                <header className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
                    <div className="md:max-w-xl text-center md:text-left">
                        <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground-muted mb-8">Directory / 01</div>
                        <h1 className="text-5xl font-serif text-foreground tracking-tight leading-none mb-8">
                            Explore Profiles
                        </h1>
                        <p className="text-foreground-muted font-medium text-lg leading-relaxed md:max-w-md">
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
                                        className={`shrink-0 px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${!religion ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-foreground-muted border-border-muted hover:border-foreground-muted'}`}
                                    >
                                        All
                                    </Link>
                                    {religions.map((r) => (
                                        <Link
                                            key={r}
                                            href={`/biodata?religion=${r}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
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

                <div className="mb-8 md:mb-12" />

                {/* The List (Editorial Style) */}
                {biodata.length > 0 ? (
                    <div className="flex flex-col border-t border-border-muted">
                        {biodata.map((item) => (
                            <BiodataCard
                                key={item.id}
                                username={item.user.username!}
                                data={item.data as unknown as Partial<BiodataFormValues>}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-12 md:py-16 text-center border-2 border-dashed border-border-muted rounded-none">
                        <h3 className="text-2xl font-serif text-foreground mb-6">No matched results</h3>
                        <Link href="/biodata" className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted border-b border-border-muted pb-1 hover:text-foreground hover:border-foreground transition-all">Clear Filters</Link>
                    </div>
                )}

            </main>

        </div>
    )
}
