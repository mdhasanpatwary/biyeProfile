"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useRef, useEffect } from "react"

export function SearchInput({ initialQuery = "" }: { initialQuery?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const timeoutRef = useRef<NodeJS.Timeout>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Sync input value with URL when it changes externally (e.g. back button)
    useEffect(() => {
        if (inputRef.current && inputRef.current.value !== initialQuery) {
            inputRef.current.value = initialQuery
        }
    }, [initialQuery])

    const handleSearch = (value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set("q", value)
            } else {
                params.delete("q")
            }

            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
            })
        }, 500)
    }

    return (
        <div className="w-full relative shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`w-3 h-3 md:w-4 md:h-4 transition-colors ${isPending ? 'text-foreground animate-pulse' : 'text-foreground-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                ref={inputRef}
                type="text"
                defaultValue={initialQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search biodatas..."
                className="w-full bg-transparent border border-border-muted/50 text-foreground font-mono text-[10px] md:text-[11px] uppercase tracking-widest pl-9 pr-3 py-2.5 placeholder:text-foreground-muted/50 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all rounded-none"
            />
        </div>
    )
}
