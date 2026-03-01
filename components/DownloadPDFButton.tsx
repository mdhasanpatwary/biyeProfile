"use client"

export function DownloadPDFButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition shadow-sm print:hidden"
    >
      Download PDF
    </button>
  )
}
