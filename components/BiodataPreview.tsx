import { type BiodataFormValues } from "@/lib/validations/biodata"
import { BiodataContent } from "./BiodataContent"

export function BiodataPreview({ data }: { data: Partial<BiodataFormValues> }) {
  if (!data) return null;

  return (
    <div className="bg-white shadow-2xl p-0 sticky top-24 border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-indigo-100 group h-[500px] lg:h-[calc(100vh-160px)] flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-center text-white shrink-0">
        <h2 className="text-lg font-bold tracking-tight">Public Profile Preview</h2>
        <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Matches PDF Layout</p>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto p-0 sm:p-4 bg-gray-50/50 custom-scrollbar flex flex-col items-center">
        <div
          className="bg-white shadow-xl border p-8 sm:p-12 min-h-full origin-top transition-transform duration-300 mx-auto preview-scaled-container"
          style={{
            width: '794px',
            transform: 'scale(var(--preview-scale, 0.45))',
            marginBottom: 'calc(-794px * (1 - var(--preview-scale, 0.45)))'
          }}
        >
           <BiodataContent data={data} />
           <div className="h-40" />
        </div>
      </div>

      <div className="p-4 bg-white border-t text-center shrink-0">
         <p className="text-[10px] text-gray-400 font-medium">Auto-scaling to fit A4 layout</p>
      </div>

      <style jsx>{`
        .preview-scaled-container {
          --preview-scale: 0.45;
        }
        @media (max-width: 1200px) {
          .preview-scaled-container {
            --preview-scale: 0.4;
          }
        }
        @media (max-width: 1024px) {
           .preview-scaled-container {
            --preview-scale: 0.35;
          }
        }
        @media (max-width: 640px) {
          .preview-scaled-container {
            --preview-scale: 0.3;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}
