"use client"

import { useState } from "react"
import { BiodataForm } from "./BiodataForm"
import { BiodataPreview } from "./BiodataPreview"
import { type BiodataFormValues } from "@/lib/validations/biodata"

export function BiodataEditor({ initialData, username }: { initialData: Partial<BiodataFormValues>, username: string }) {
  const [formData, setFormData] = useState(initialData)
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit")

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start relative pb-24 lg:pb-0 w-full max-w-full overflow-hidden">
      {/* Mobile Toggle - Improved glassmorphism design */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(79,70,229,0.15)] border border-white/50 p-1.5 ring-1 ring-black/5">
        <button
          onClick={() => setMobileView("edit")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${mobileView === "edit" ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-indigo-600'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Edit Info
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${mobileView === "preview" ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-indigo-600'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          Live Preview
        </button>
      </div>

      <div className={`flex-1 w-full bg-white rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 p-4 sm:p-10 min-h-screen min-w-0 ${mobileView === "preview" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-left-4 duration-500'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-50 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600">
              Edit Your Biodata
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-1">Update your professional and personal profile</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="text-xs sm:text-sm font-bold text-gray-600 bg-gray-100/50 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-all border border-gray-200/50 flex items-center gap-2 group whitespace-nowrap"
            >
              Print Profile
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            </button>
            <a href={`/biodata/${username}`} target="_blank" className="text-xs sm:text-sm font-bold text-indigo-600 bg-indigo-50/50 px-5 py-2.5 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100/50 flex items-center gap-2 group whitespace-nowrap">
              View Live Profile
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>

        <BiodataForm
            initialData={initialData}
            onDataChange={(data) => setFormData(data)}
        />
      </div>

      <div className={`lg:w-[420px] w-full lg:sticky lg:top-8 order-first lg:order-last min-w-0 ${mobileView === "edit" ? 'hidden lg:block' : 'block animate-in fade-in slide-in-from-right-4 duration-500'}`}>
        <BiodataPreview data={formData} />
      </div>
    </div>
  )
}
