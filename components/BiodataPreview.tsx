"use client"

import { useEffect, useRef, useState } from "react"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { BiodataContent } from "./BiodataContent"

export function BiodataPreview({ data }: { data: Partial<BiodataFormValues> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!containerRef.current) return

    const updateScale = () => {
      const width = window.innerWidth
      if (width >= 1024) {
        setScale(0.45)
      } else if (width >= 640) {
        // Tablet scaling: scale down to fit the 920px container into the available width
        // px-6 on wrapper = 48px total padding
        const availableWidth = width - 48
        setScale(Math.min(1, availableWidth / 920))
      } else {
        // Mobile scaling: 1:1 (the container itself is w-full)
        setScale(1)
      }
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height)
      }
    })

    observer.observe(containerRef.current)
    updateScale()
    window.addEventListener("resize", updateScale)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateScale)
    }
  }, [])

  if (!data) return null

  const scaledHeight = height * scale
  const marginBottom = scale < 1 ? -(height - scaledHeight) : 0

  return (
    <div className="w-full">
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-0 bg-background/50 custom-scrollbar flex flex-col items-center w-full">
        <div
          ref={containerRef}
          className="bg-background overflow-hidden shadow-2xl rounded-none border-border-muted border p-0 origin-top transition-all duration-300 w-full sm:w-[920px]"
          style={{
            transform: `scale(${scale})`,
            marginBottom: `${marginBottom}px`
          }}
        >
          <BiodataContent data={data} />
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}
