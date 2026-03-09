import { UseFormReturn } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { CustomFieldsFormBlock } from "../CustomFieldsFormBlock"
import { FAMILY_STATUS_OPTIONS } from "@/lib/constants/biodata-options"

interface FamilyInfoStepProps {
  form: UseFormReturn<BiodataFormValues>
  lang: "en" | "bn"
}

export function FamilyInfoStep({ form, lang }: FamilyInfoStepProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader className="border-b border-border-muted mb-6">
        <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 05</p>
        <CardTitle className="text-3xl font-serif text-foreground italic">
          {lang === 'en' ? 'Family Information' : 'পারিবারিক তথ্য'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2">
          <FormField label="Father's Name" error={form.formState.errors.familyInfo?.fatherName?.message}>
            <Input type="text" {...form.register("familyInfo.fatherName")} placeholder="e.g. Md. Rahman" className="block w-full" />
          </FormField>

          <FormField label="Father's Profession (Optional)">
            <Input type="text" {...form.register("familyInfo.fatherProfession")} placeholder="e.g. Businessman / Retired Govt. Officer" className="block w-full" />
          </FormField>

          <FormField label="Mother's Name" error={form.formState.errors.familyInfo?.motherName?.message}>
            <Input type="text" {...form.register("familyInfo.motherName")} placeholder="e.g. Mrs. Begum" className="block w-full" />
          </FormField>

          <FormField label="Mother's Profession (Optional)">
            <Input type="text" {...form.register("familyInfo.motherProfession")} placeholder="e.g. Homemaker / Teacher" className="block w-full" />
          </FormField>

          <FormField label="Number of Brothers (Optional)">
            <Input type="number" {...form.register("familyInfo.numberOfBrothers", { valueAsNumber: true })} placeholder="e.g. 1" className="block w-full" />
          </FormField>

          <FormField label="Number of Sisters (Optional)">
            <Input type="number" {...form.register("familyInfo.numberOfSisters", { valueAsNumber: true })} placeholder="e.g. 2" className="block w-full" />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Family Status (Optional)">
              <Select {...form.register("familyInfo.familyStatus")} className="cursor-pointer">
                <option value="">Select Family Status</option>
                {FAMILY_STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
              </Select>
            </FormField>
          </div>

          <CustomFieldsFormBlock control={form.control} register={form.register} name="familyInfo.extraFields" />
        </div>
      </CardContent>
    </Card>
  )
}
