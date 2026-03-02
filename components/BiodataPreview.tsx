import { type BiodataFormValues } from "@/lib/validations/biodata"
import { BiodataContent } from "./BiodataContent"

export function BiodataPreview({ data }: { data: Partial<BiodataFormValues> }) {
  if (!data) return null;

  return (
    <div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-0 bg-gray-50/50 custom-scrollbar flex flex-col items-center">
        <div
          className="bg-white shadow-xl rounded-3xl border p-5 sm:p-8 origin-top transition-transform duration-300 preview-scaled-container"
          style={{
            width: '920px',
            transform: 'scale(var(--preview-scale, 0.45))',
            marginBottom: 'calc(-920px * (1 - var(--preview-scale, 0.45)))'
          }}
        >
           <BiodataContent data={data} />
        </div>
      </div>

      <style jsx>{`
        .preview-scaled-container {
          --preview-scale: 0.45;
        }
        @media (max-width: 1200px) {
          .preview-scaled-container {
            --preview-scale: 0.45;
          }
        }
        @media (max-width: 1024px) {
           .preview-scaled-container {
            --preview-scale: 0.45;
          }
        }
        @media (max-width: 640px) {
          .preview-scaled-container {
            --preview-scale: 0.4;
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
