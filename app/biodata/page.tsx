import { prisma } from "@/lib/prisma"
import { BiodataCard } from "@/components/BiodataCard"
import { Logo } from "@/components/Logo"
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
        <div className="min-h-screen bg-white">
            {/* Premium Header */}
            <nav className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
                    <Logo />
                    <div className="flex items-center gap-8">
                        <Link
                            href="/dashboard"
                            className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-black border-b border-black hover:pb-1 transition-all"
                        >
                            My Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-40">

                {/* Intro */}
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-gray-400 mb-6">Directory / 01</div>
                        <h1 className="text-6xl md:text-8xl font-serif text-black tracking-tight leading-none mb-6">
                            Explore <br /> Profiles
                        </h1>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-md">
                            A curated list of public marriage biodata entries. Refined, secure, and ready for your connection.
                        </p>
                    </div>

                    {/* Minimal Filter */}
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Filter by Religion</span>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/biodata"
                                className={`px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${!religion ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-black/5 hover:border-black/20'}`}
                            >
                                All
                            </Link>
                            {religions.map((r) => (
                                <Link
                                    key={r}
                                    href={`/biodata?religion=${r}`}
                                    className={`px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${religion === r ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-black/5 hover:border-black/20'}`}
                                >
                                    {r}
                                </Link>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Results Info */}
                <div className="mb-12 flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-black/5" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-gray-300">
                        {biodata.length} Results
                    </span>
                    <div className="h-[1px] flex-1 bg-black/5" />
                </div>

                {/* The Grid */}
                {biodata.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-y-16">
                        {biodata.map((item) => (
                            <BiodataCard
                                key={item.id}
                                username={item.user.username!}
                                data={item.data as unknown as Partial<BiodataFormValues>}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                        <h3 className="text-2xl font-serif text-black mb-4">No matched results</h3>
                        <Link href="/biodata" className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 hover:text-black hover:border-black transition-all">Clear Filters</Link>
                    </div>
                )}

            </main>

            {/* Footer Branding */}
            <footer className="border-t border-black/5 py-24 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <Logo />
                    <p className="mt-8 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-gray-300">
                        Premium Marriage Biodata Builder
                    </p>
                </div>
            </footer>
        </div>
    )
}
