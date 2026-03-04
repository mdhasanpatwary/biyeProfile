import Link from "next/link"
import Image from "next/image"
import { getCloudinaryUrl } from "@/lib/cloudinary"
import { BiodataFormValues } from "@/lib/validations/biodata"

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
            className="group block border-b border-black/5 animate-in fade-in slide-in-from-bottom-4 duration-500 hover:bg-gray-50/50 transition-all"
        >
            <div className="flex flex-col sm:flex-row items-center gap-12 py-10 px-4 sm:px-0">

                {/* Thumbnail */}
                <div className="relative w-24 h-24 shrink-0 overflow-hidden grayscale contrast-[1.1] transition-all duration-700 bg-gray-50 rounded-sm border border-black/5">
                    {basicInfo?.photoUrl ? (
                        <Image
                            src={getCloudinaryUrl(basicInfo.photoUrl, "thumb")}
                            alt={name}
                            fill
                            sizes="96px"
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Info Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 items-center w-full">
                    <div className="md:col-span-2">
                        <p className="text-[10px] font-mono font-black text-black/20 uppercase tracking-[0.4em] mb-2">Identification</p>
                        <h3 className="text-3xl font-serif text-black leading-tight italic tracking-tight">
                            {name}
                        </h3>
                        <p className="text-[11px] font-mono font-bold text-black/40 uppercase tracking-widest mt-1">
                            {occupation}
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-[10px] font-mono font-black text-black/20 uppercase tracking-[0.4em] mb-2">Metrics</p>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-black text-black uppercase tracking-widest">{religion}</span>
                            <span className="text-[11px] font-mono text-black/40 uppercase tracking-widest">{age} Yrs</span>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-[10px] font-mono font-black text-black/20 uppercase tracking-[0.4em] mb-2">Origin</p>
                        <span className="text-[11px] font-black text-black uppercase tracking-widest line-clamp-1">{district}</span>
                    </div>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex shrink-0 w-12 h-12 items-center justify-center border border-black/5 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}
