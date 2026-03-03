import { type BiodataFormValues } from "@/lib/validations/biodata"
import { BiodataContent } from "./BiodataContent"

export function BiodataPreview({ data }: { data: Partial<BiodataFormValues> }) {
  if (!data) return null;

  return (
    <div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-0 bg-white custom-scrollbar flex flex-col items-center w-full">
        <div
          className="bg-white shadow-2xl rounded-none border-black/5 border p-0 origin-top transition-all duration-300 preview-scaled-container w-full sm:w-[920px]"
          style={{
            transform: 'scale(var(--preview-scale, 1))',
            marginBottom: 'calc(var(--preview-margin-bottom, 0px))'
          }}
        >
          <BiodataContent data={data} />
        </div>
      </div>

      <style jsx>{`
        .preview-scaled-container {
          --preview-scale: 1;
          --preview-margin-bottom: 0px;
        }
        @media (min-width: 1024px) {
          .preview-scaled-container {
            --preview-scale: 0.45;
            --preview-margin-bottom: calc(-920px * (1 - 0.45));
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
