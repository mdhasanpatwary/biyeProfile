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
            className="group block animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm border border-black/5 hover:border-black/20 transition-all duration-500 h-full">

                {/* Photo Container */}
                <div className="relative w-full aspect-square overflow-hidden grayscale contrast-[1.1] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700 bg-gray-50">
                    {basicInfo?.photoUrl ? (
                        <Image
                            src={getCloudinaryUrl(basicInfo.photoUrl, "thumb")}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 50vw, 30vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}

                    {/* Overlay Tag */}
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-black text-[8px] font-mono font-black text-white px-2.5 py-1 uppercase tracking-[0.2em] shadow-lg">
                            {religion}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-serif text-black leading-tight group-hover:underline decoration-black/10 underline-offset-4 transition-all line-clamp-1">
                            {name}
                        </h3>
                        <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest line-clamp-1">
                            {occupation}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1">Age</span>
                            <span className="text-[11px] font-black text-black tabular-nums">{age} Yrs</span>
                        </div>
                        <div className="w-px h-6 bg-black/5" />
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1">District</span>
                            <span className="text-[11px] font-black text-black line-clamp-1">{district}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
