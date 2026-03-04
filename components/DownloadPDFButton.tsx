"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface DownloadPDFButtonProps {
  /** ID of the DOM element to capture. Defaults to "biodata-content" */
  targetId?: string
  /** Optional filename (without extension). Defaults to "biodata" */
  filename?: string
  /** Optional variant style */
  variant?: "default" | "outline" | "ghost"
  className?: string
  children?: React.ReactNode
}

export function DownloadPDFButton({
  targetId = "biodata-content",
  filename = "biodata",
  className,
  children,
}: DownloadPDFButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ])

      const element = document.getElementById(targetId)
      if (!element) {
        console.error(`Element #${targetId} not found`)
        setLoading(false)
        return
      }

      // A4 dimensions in px at 96 dpi: 794 x 1123
      const A4_WIDTH_PX = 794

      const canvas = await html2canvas(element, {
        scale: 2.5,              // high resolution
        useCORS: true,           // allow cross-origin images (Cloudinary)
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: A4_WIDTH_PX,
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.97)

      // A4 in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const PAGE_W = 210  // mm
      const PAGE_H = 297  // mm
      const MARGIN  = 10  // mm padding on all sides
      const CONTENT_W = PAGE_W - MARGIN * 2
      const CONTENT_H = PAGE_H - MARGIN * 2

      // How many mm tall is the full canvas when scaled to content width?
      const canvasAspect = canvas.height / canvas.width
      const totalImgH = CONTENT_W * canvasAspect  // mm

      let pageTop = 0  // position in the canvas (mm) we have rendered up to

      while (pageTop < totalImgH) {
        if (pageTop > 0) pdf.addPage()

        pdf.addImage(
          imgData,
          "JPEG",
          MARGIN,               // x
          MARGIN - pageTop,     // y: shifts canvas upward each page
          CONTENT_W,
          totalImgH,
          undefined,
          "FAST",
        )

        // Clip to the page — draw a white rectangle to mask content outside content area
        // Top mask
        pdf.setFillColor(255, 255, 255)
        pdf.rect(0, 0, PAGE_W, MARGIN, "F")
        // Bottom mask
        pdf.rect(0, MARGIN + CONTENT_H, PAGE_W, MARGIN, "F")

        pageTop += CONTENT_H
      }

      const safeFilename = filename.replace(/[^a-z0-9_-]/gi, "_").toLowerCase()
      pdf.save(`${safeFilename}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Could not generate PDF. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className={
        className ??
        "group flex items-center gap-2.5 bg-black text-white px-8 py-3.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 hover:shadow-black/20 print:hidden cursor-pointer disabled:opacity-60 disabled:scale-100"
      }
    >
      {loading ? (
        <>
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="tracking-tight">Generating PDF…</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          {children ?? <span className="tracking-tight">Download PDF</span>}
        </>
      )}
    </Button>
  )
}
