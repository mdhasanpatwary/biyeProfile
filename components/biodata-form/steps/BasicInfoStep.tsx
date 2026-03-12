import { UseFormReturn } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { CustomFieldsFormBlock } from "../CustomFieldsFormBlock"
import { HEIGHT_OPTIONS, BLOOD_GROUPS, MARITAL_STATUS_OPTIONS, RELIGION_OPTIONS } from "@/lib/constants/biodata-options"

interface BasicInfoStepProps {
  form: UseFormReturn<BiodataFormValues>
  lang: "en" | "bn"
}

export function BasicInfoStep({ form, lang }: BasicInfoStepProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader className="border-b border-border-muted mb-6">
        <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 01</p>
        <CardTitle className="text-3xl font-serif text-foreground italic">
          {lang === 'en' ? 'Basic Information' : 'প্রাথমিক তথ্য'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2">
          <div className="sm:col-span-2 mb-4">
            <FormField label="Profile Photo (Optional)">
              <FileUpload
                value={form.watch("basicInfo.photoUrl") || ""}
                onChange={(url: string) => form.setValue("basicInfo.photoUrl", url)}
              />
            </FormField>
          </div>

          <FormField label="Full Name" error={form.formState.errors.basicInfo?.fullName?.message}>
            <Input type="text" {...form.register("basicInfo.fullName")} placeholder="e.g. John Doe" className="block w-full" />
          </FormField>

          <FormField label="Date of Birth" error={form.formState.errors.basicInfo?.dateOfBirth?.message}>
            <Input type="date" {...form.register("basicInfo.dateOfBirth")} placeholder="e.g. 1995-08-25" className="block w-full" />
          </FormField>

          <FormField label="Age (Auto Calculated)">
            <Input type="number" readOnly {...form.register("basicInfo.age")} placeholder="e.g. 28" className="block w-full rounded-none border-border-muted bg-accent shadow-sm md:text-sm p-4 border text-foreground/70 cursor-not-allowed outline-none font-medium placeholder:text-foreground/50" />
          </FormField>

          <FormField label="Height" error={form.formState.errors.basicInfo?.height?.message}>
            <Select {...form.register("basicInfo.height")} className="cursor-pointer">
              <option value="">Select Height</option>
              {HEIGHT_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
            </Select>
          </FormField>

          <FormField label="Weight (Optional)">
            <Input type="text" {...form.register("basicInfo.weight")} placeholder="e.g. 70kg / 154 lbs" className="block w-full" />
          </FormField>

          <FormField label="Blood Group" error={form.formState.errors.basicInfo?.bloodGroup?.message}>
            <Select {...form.register("basicInfo.bloodGroup")} className="cursor-pointer">
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </Select>
          </FormField>

          <FormField label="Religion" error={form.formState.errors.basicInfo?.religion?.message}>
            <Select {...form.register("basicInfo.religion")} className="cursor-pointer">
              <option value="">Select Religion</option>
              {RELIGION_OPTIONS.map(religion => <option key={religion} value={religion}>{religion}</option>)}
            </Select>
          </FormField>

          <FormField label="Marital Status" error={form.formState.errors.basicInfo?.maritalStatus?.message}>
            <Select {...form.register("basicInfo.maritalStatus")} className="cursor-pointer">
              <option value="">Select Status</option>
              {MARITAL_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
            </Select>
          </FormField>

          <FormField label="Nationality">
            <Input type="text" {...form.register("basicInfo.nationality")} placeholder="e.g. Bangladeshi / American" className="block w-full" />
          </FormField>

          <CustomFieldsFormBlock control={form.control} register={form.register} name="basicInfo.extraFields" />
        </div>
      </CardContent>
    </Card>
  )
}
