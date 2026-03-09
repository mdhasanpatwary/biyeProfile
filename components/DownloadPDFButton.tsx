"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DownloadPDFButtonProps {
  /** ID of the DOM element to capture. Defaults to "biodata-content" */
  targetId?: string
  /** Optional filename (without extension). Defaults to "biodata" */
  filename?: string
  /** Optional variant style */
  variant?: "primary" | "secondary" | "outline" | "ghost"
  className?: string
  children?: React.ReactNode
}

export function DownloadPDFButton({
  targetId = "biodata-content",
  filename = "biodata",
  className,
  children,
  variant = "primary"
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

      // ── Step 1: Wait for all fonts to be fully loaded in the main document ──
      await document.fonts.ready

      const canvas = await html2canvas(element, {
        scale: 2,                // high resolution — balanced for A4
        useCORS: true,           // allow cross-origin images (Cloudinary)
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: A4_WIDTH_PX,
        onclone: (clonedDoc, clonedEl) => {
          // ── Step 2: Transfer all loaded FontFace objects into the cloned document ──
          // html2canvas creates an isolated document — it has no access to the
          // fonts loaded by the main window. We copy every loaded FontFace across.
          document.fonts.forEach((fontFace) => {
            try {
              clonedDoc.fonts.add(fontFace)
            } catch {
              // Ignore fonts that can't be transferred (e.g. already added)
            }
          })

          // ── Step 3: Resolve CSS var() font names → real family names ──
          // html2canvas cannot follow `var(--font-geist-sans)` etc.
          // We read the resolved names from the main document's computed styles
          // and inject a scoped <style> that sets font-family to the real names.
          const mainStyles = getComputedStyle(document.documentElement)
          const resolveFont = (varName: string, fallback: string) => {
            const resolved = mainStyles.getPropertyValue(varName).trim()
            // next/font injects names like "__GeistSans_abc123" — use as-is or fallback
            return resolved || fallback
          }

          const sansFont  = resolveFont("--font-geist-sans",       "ui-sans-serif, system-ui, sans-serif")
          const monoFont  = resolveFont("--font-geist-mono",        "ui-monospace, SFMono-Regular, monospace")
          const serifFont = resolveFont("--font-instrument-serif",  "ui-serif, Georgia, serif")

          // Force Light Theme for the cloned document
          clonedDoc.documentElement.setAttribute("data-theme", "light")
          clonedEl.style.backgroundColor = "#ffffff"
          clonedEl.style.color = "#111827"

          const style = clonedDoc.createElement("style")
          style.textContent = `
            #biodata-content,
            #biodata-content * {
              /* Reset browser default font resolution */
            }
            #biodata-content .font-sans,
            #biodata-content {
              font-family: ${sansFont}, ui-sans-serif, sans-serif !important;
            }
            #biodata-content .font-mono,
            #biodata-content [class*="font-mono"] {
              font-family: ${monoFont}, ui-monospace, monospace !important;
            }
            #biodata-content .font-serif,
            #biodata-content [class*="font-serif"],
            #biodata-content h1,
            #biodata-content h3 {
              font-family: ${serifFont}, ui-serif, Georgia, serif !important;
            }
          `
          clonedDoc.head.appendChild(style)

          // ── Step 4: Fix oklab/color-mix unsupported CSS color functions ──
          const unsupported = /oklab|oklch|color-mix/i
          const colorProps = [
            "color",
            "backgroundColor",
            "borderColor",
            "borderTopColor",
            "borderRightColor",
            "borderBottomColor",
            "borderLeftColor",
            "outlineColor",
            "textDecorationColor",
            "caretColor",
            "columnRuleColor",
          ] as const

          const walk = (el: Element) => {
            const style = (el as HTMLElement).style
            if (style) {
              const computed = clonedDoc.defaultView?.getComputedStyle(el)
              if (computed) {
                for (const prop of colorProps) {
                  const val = computed.getPropertyValue(
                    prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
                  )
                  if (val && unsupported.test(val)) {
                    style.setProperty(
                      prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
                      prop === "color" ? "inherit" : "transparent"
                    )
                  }
                }
              }
            }
            for (const child of el.children) walk(child)
          }
          walk(clonedEl)
        },
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.97)

      // We want a single continuous vertical PDF matching the aspect ratio of the canvas.
      // We fix the width to an A4 equivalent (210mm) for scale,
      // and calculate the required height based on the canvas aspect ratio.
      const PAGE_W = 210  // mm
      const MARGIN = 10   // mm padding on left/right/top/bottom
      const CONTENT_W = PAGE_W - MARGIN * 2

      const canvasAspect = canvas.height / canvas.width
      const CONTENT_H = CONTENT_W * canvasAspect  // mm
      const PAGE_H = CONTENT_H + MARGIN * 2       // mm total height needed

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [PAGE_W, PAGE_H],
      })

      // Add the single continuous image
      pdf.addImage(
        imgData,
        "JPEG",
        MARGIN,  // x
        MARGIN,  // y
        CONTENT_W,
        CONTENT_H,
        undefined,
        "FAST",
      )

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
      variant={variant}
      onClick={handleDownload}
      disabled={loading}
      className={
        cn("w-full sm:w-auto flex items-center justify-center gap-2", className)
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
