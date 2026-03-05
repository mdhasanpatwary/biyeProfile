import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getCloudinaryUrl } from '@/lib/cloudinary';

interface CloudinaryResult {
  info: {
    secure_url: string;
    public_id: string;
  };
}

interface FileUploadProps {
  value: string;
  onChange: (publicId: string) => void;
  /** Optional overlay text for the uploader */
  label?: string;
  /** Optional sub-text */
  subLabel?: string;
}

export function FileUpload({
  value,
  onChange,
  label = "Add Profile Photo",
  subLabel = "PNG or JPG up to 10MB (Square Crop Forced)"
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const previewUrl = getCloudinaryUrl(value, "thumb");

  const uploadOptions = {
    maxFiles: 1,
    maxFileSize: 10485760, // 10MB
    clientAllowedFormats: ["jpeg", "png", "jpg"],
    cropping: true,
    croppingAspectRatio: 1,
    showSkipCropButton: false,
    multiple: false,
    sources: ["local", "camera"] as ("local" | "camera")[],
    styles: {
      palette: {
        window: "#FFFFFF",
        windowBorder: "#E2E8F0",
        tabIcon: "#000000",
        menuIcons: "#000000",
        textLight: "#FFFFFF",
        textDark: "#000000",
        activeTabIcon: "#000000",
        inactiveTabIcon: "#64748B",
        link: "#000000",
        action: "#000000",
        inProgress: "#000000",
        complete: "#10B981",
        error: "#EF4444",
        sourceBg: "#F8FAFC"
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {value ? (
        <div className="flex items-center gap-6 p-4 bg-accent/30 rounded-none border border-border-muted/50 w-full md:w-fit">
          <div className="relative w-24 h-24 rounded-none overflow-hidden border-2 border-background shadow-md shrink-0 bg-accent">
            <Image
              src={previewUrl}
              alt="Uploaded file preview"
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          </div>
          <div className="flex flex-col gap-2">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "biyeprofile_preset"}
              options={uploadOptions}
              onSuccess={(result) => {
                const info = (result as CloudinaryResult).info;
                if (info?.public_id) {
                  onChange(info.public_id);
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
                  className="text-xs font-bold text-foreground hover:opacity-80 bg-background px-4 py-2 rounded-none border border-border-muted shadow-sm"
                >
                  Change File
                </Button>
              )}
            </CldUploadWidget>
            <Button
              type="button"
              onClick={() => onChange("")}
              variant="ghost"
              className="text-xs font-bold px-4 py-1 text-left justify-start"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "biyeprofile_preset"}
          options={uploadOptions}
          onSuccess={(result) => {
            const info = (result as CloudinaryResult).info;
            if (info?.public_id) {
              onChange(info.public_id);
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
              className={`relative overflow-hidden w-full sm:w-64 h-32 flex flex-col items-center justify-center gap-2 group border-dashed transition-all ${isUploading ? 'bg-accent border-border-muted' : 'bg-background border-border-muted hover:border-foreground hover:bg-accent/30'}`}
              onClick={() => open()}
            >
              <div className="w-10 h-10 aspect-square shrink-0">
                {isUploading ? (
                  <div className="w-full h-full border-4 border-foreground border-t-transparent rounded-none animate-spin"></div>
                ) : (
                  <div className="w-full h-full bg-accent rounded-none flex items-center justify-center text-foreground-muted group-hover:text-foreground group-hover:scale-110 group-hover:bg-background border border-transparent group-hover:border-foreground/10 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${isUploading ? 'text-foreground animate-pulse' : 'text-foreground-muted'}`}>
                {isUploading ? 'Uploading...' : label}
              </span>
            </Button>
          )}
        </CldUploadWidget>
      )}
      {error && <span className="text-xs font-medium text-destructive bg-destructive/10 px-3 py-1 rounded-none border border-destructive/20 w-fit">{error}</span>}
      {subLabel && <p className="text-[10px] text-foreground-muted/60 font-medium px-1">{subLabel}</p>}
    </div>
  )
}
