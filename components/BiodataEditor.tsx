"use client"

import { useState } from "react"
import { BiodataForm } from "./BiodataForm"
import { BiodataPreview } from "./BiodataPreview"
import { type BiodataFormValues } from "@/lib/validations/biodata"

export function BiodataEditor({ initialData, username }: { initialData: Partial<BiodataFormValues>, username: string }) {
  const [formData, setFormData] = useState(initialData)
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit")

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative pb-24 lg:pb-0 w-full max-w-full overflow-hidden">
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] flex bg-white rounded-full shadow-2xl border p-1 border-indigo-100">
        <button
          onClick={() => setMobileView("edit")}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${mobileView === "edit" ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}
        >
          Edit Info
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${mobileView === "preview" ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}
        >
          Live Preview
        </button>
      </div>

      <div className={`flex-1 w-full bg-white rounded-2xl shadow-sm border p-6 min-h-screen min-w-0 ${mobileView === "preview" ? 'hidden lg:block' : 'block'}`}>
        <div className="flex justify-between items-center mb-8 pb-4 border-b">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Edit Your Biodata</h1>
          <a href={`/biodata/${username}`} target="_blank" className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors">
            View Live Profile &rarr;
          </a>
        </div>

        <BiodataForm
            initialData={initialData}
            onDataChange={(data) => setFormData(data)}
        />
      </div>

      <div className={`lg:w-[400px] w-full lg:sticky lg:top-8 order-first lg:order-last min-w-0 ${mobileView === "edit" ? 'hidden lg:block' : 'block'}`}>
        <BiodataPreview data={formData} />
      </div>
    </div>
  )
}
