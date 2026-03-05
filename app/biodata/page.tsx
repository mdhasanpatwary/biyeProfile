import { prisma } from "@/lib/prisma"
import { BiodataCard } from "@/components/BiodataCard"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function BrowseBiodataPage(props: {
    searchParams: Promise<{ religion?: string; district?: string }>
}) {
    const searchParams = await props.searchParams
    const religion = searchParams.religion

    // Fetch only public profiles
    const biodata = await prisma.biodata.findMany({
        where: {
            isPublic: true,
            ...(religion ? {
                data: {
                    path: ['basicInfo', 'religion'],
                    equals: religion
                }
            } : {}),
        },
        include: {
            user: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 48
    })

    const religions = ["Muslim", "Hindu", "Christian", "Buddhist"]

    return (
        <div className="min-h-screen bg-background">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-40">

                {/* Intro */}
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground-muted mb-6">Directory / 01</div>
                        <h1 className="text-6xl md:text-8xl font-serif text-foreground tracking-tight leading-none mb-6">
                            Explore <br /> Profiles
                        </h1>
                        <p className="text-foreground-muted font-medium text-lg leading-relaxed max-w-md">
                            A curated list of public marriage biodata entries. Refined, secure, and ready for your connection.
                        </p>
                    </div>

                    {/* Minimal Filter */}
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-foreground-muted mb-2">Filter by Religion</span>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/biodata"
                                className={`px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${!religion ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-foreground-muted border-border-muted hover:border-foreground-muted'}`}
                            >
                                All
                            </Link>
                            {religions.map((r) => (
                                <Link
                                    key={r}
                                    href={`/biodata?religion=${r}`}
                                    className={`px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${religion === r ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-foreground-muted border-border-muted hover:border-foreground-muted'}`}
                                >
                                    {r}
                                </Link>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Results Info */}
                <div className="mb-12 flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-border-muted" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-foreground-muted/50">
                        {biodata.length} Results
                    </span>
                    <div className="h-[1px] flex-1 bg-border-muted" />
                </div>

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
                    <div className="py-40 text-center border-2 border-dashed border-border-muted rounded-none">
                        <h3 className="text-2xl font-serif text-foreground mb-4">No matched results</h3>
                        <Link href="/biodata" className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground-muted border-b border-border-muted pb-1 hover:text-foreground hover:border-foreground transition-all">Clear Filters</Link>
                    </div>
                )}

            </main>

        </div>
    )
}
