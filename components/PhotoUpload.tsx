import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="flex items-center gap-6 p-4 bg-gray-50/30 rounded-2xl border border-gray-100/50">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0">
            <Image src={value} alt="Profile preview" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "biyeprofile_preset"}
              onSuccess={(result) => {
                const info = (result as CloudinaryResult).info;
                if (info?.secure_url) {
                  onChange(info.secure_url);
                  setIsUploading(false);
                }
              }}
              onUpload={() => setIsUploading(true)}
            >
              {({ open }) => (
                <Button
                  type="button"
                  onClick={() => open()}
                  variant="outline"
                  className="text-xs font-bold text-black hover:text-gray-800 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm"
                >
                  Change Photo
                </Button>
              )}
            </CldUploadWidget>
            <Button
              type="button"
              onClick={() => onChange("")}
              variant="ghost"
              className="text-xs font-bold text-gray-500 hover:text-black px-4 py-1 text-left justify-start"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "biyeprofile_preset"}
          options={{
            maxFiles: 1,
            maxFileSize: 1048576, // 1MB
            clientAllowedFormats: ["jpeg", "png", "jpg"],
          }}
          onSuccess={(result) => {
            const info = (result as CloudinaryResult).info;
            if (info?.secure_url) {
              onChange(info.secure_url);
              setIsUploading(false);
              setError(null);
            }
          }}
          onUpload={() => setIsUploading(true)}
          onError={() => {
            setIsUploading(false);
            setError("Upload failed. Please try again.");
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              disabled={isUploading}
              variant="outline"
              className={`relative overflow-hidden group w-full sm:w-64 h-32 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${isUploading ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-gray-50/30'}`}
              onClick={() => open()}
            >
              {isUploading ? (
                <>
                  <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-black animate-pulse">Uploading...</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add Profile Photo</span>
                </>
              )}
            </Button>
          )}
        </CldUploadWidget>
      )}
      {error && <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-md border border-gray-100 w-fit">{error}</span>}
      <p className="text-[10px] text-gray-400 font-medium px-1">PNG, JPG or JPEG up to 1MB</p>
    </div>
  )
}
