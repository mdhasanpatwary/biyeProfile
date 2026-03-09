import Link from "next/link"
import { getCloudinaryUrl } from "@/lib/cloudinary"
import { BiodataFormValues } from "@/lib/validations/biodata"
import { Avatar } from "@/components/ui/avatar"

interface BiodataCardProps {
    username: string
    data: Partial<BiodataFormValues>
}

export function BiodataCard({ username, data }: BiodataCardProps) {
    const { basicInfo, personalInfo, profession } = data
    const age = basicInfo?.age || "N/A"
    const religion = basicInfo?.religion || "N/A"
    const district = personalInfo?.district || "N/A"
    const occupation = profession?.occupation || "N/A"
    const name = basicInfo?.fullName || "Member"

    return (
        <Link
            href={`/biodata/${username}`}
            className="group block border-b border-border-muted animate-in fade-in slide-in-from-bottom-4 duration-500 hover:bg-accent/50 transition-all font-sans"
        >
            <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 py-10 md:py-12 px-6 sm:px-0">

                {/* Thumbnail */}
                <Avatar
                    src={basicInfo?.photoUrl ? getCloudinaryUrl(basicInfo.photoUrl, "thumb") : null}
                    alt={name}
                    fallback={name.charAt(0)}
                    size="xl"
                    className="border-2 border-background shadow-md grayscale contrast-[1.1] transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Info Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-12 items-center w-full text-center sm:text-left">
                    <div className="md:col-span-2">
                        <p className="text-[10px] font-mono font-black text-foreground/20 uppercase tracking-[0.4em] mb-2">Identification</p>
                        <h3 className="text-2xl sm:text-3xl font-serif text-foreground leading-tight italic tracking-tight">
                            {name}
                        </h3>
                        <p className="text-[11px] font-mono font-bold text-foreground-muted uppercase tracking-widest mt-2">
                            {occupation}
                        </p>

                        {/* Mobile Metrics Row */}
                        <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 md:hidden">
                            <span className="text-[10px] font-black text-foreground uppercase tracking-widest border border-border-muted px-2 py-0.5">{religion}</span>
                            <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">{age} Yrs</span>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-[10px] font-mono font-black text-foreground/20 uppercase tracking-[0.4em] mb-2">Metrics</p>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{religion}</span>
                            <span className="text-[11px] font-mono text-foreground-muted uppercase tracking-widest">{age} Yrs</span>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-[10px] font-mono font-black text-foreground/20 uppercase tracking-[0.4em] mb-2">Origin</p>
                        <span className="text-[11px] font-black text-foreground uppercase tracking-widest line-clamp-1">{district}</span>
                    </div>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex shrink-0 w-12 h-12 items-center justify-center border border-border-muted rounded-none group-hover:bg-foreground group-hover:text-background transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}
