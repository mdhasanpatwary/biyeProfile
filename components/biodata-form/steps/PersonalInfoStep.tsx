import { UseFormReturn } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CustomFieldsFormBlock } from "../CustomFieldsFormBlock"
import { COMPLEXION_OPTIONS } from "@/lib/constants/biodata-options"

interface PersonalInfoStepProps {
  form: UseFormReturn<BiodataFormValues>
  lang: "en" | "bn"
}

export function PersonalInfoStep({ form, lang }: PersonalInfoStepProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader className="border-b border-border-muted mb-6">
        <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 02</p>
        <CardTitle className="text-3xl font-serif text-foreground italic">
          {lang === 'en' ? 'Personal Information' : 'ব্যক্তিগত তথ্য'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label="Present Address" error={form.formState.errors.personalInfo?.presentAddress?.message}>
              <Textarea {...form.register("personalInfo.presentAddress")} placeholder="e.g. House 12, Road 4, Banani, Dhaka" rows={3} className="block w-full" />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField label="Permanent Address" error={form.formState.errors.personalInfo?.permanentAddress?.message}>
              <Textarea {...form.register("personalInfo.permanentAddress")} placeholder="e.g. Village Name, Thana, District" rows={3} className="block w-full" />
            </FormField>
          </div>

          <FormField label="District" error={form.formState.errors.personalInfo?.district?.message}>
            <Input type="text" {...form.register("personalInfo.district")} placeholder="e.g. Dhaka / Sylhet" className="block w-full" />
          </FormField>

          <FormField label="Division (Optional)">
            <Input type="text" {...form.register("personalInfo.division")} placeholder="e.g. Dhaka Division" className="block w-full" />
          </FormField>

          <FormField label="Native Village (Optional)">
            <Input type="text" {...form.register("personalInfo.nativeVillage")} placeholder="e.g. Your Ancestral Village" className="block w-full" />
          </FormField>

          <FormField label="Complexion (Optional)">
            <Select {...form.register("personalInfo.complexion")} className="cursor-pointer">
              <option value="">Select Complexion</option>
              {COMPLEXION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>

          <FormField label="Physical Status (Optional)">
            <Input type="text" {...form.register("personalInfo.physicalStatus")} placeholder="e.g. Completely Healthy" className="block w-full" />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Hobby / Interests (Optional)">
              <Textarea {...form.register("personalInfo.hobby")} placeholder="e.g. Reading, Traveling, Photography" rows={2} className="block w-full" />
            </FormField>
          </div>

          <CustomFieldsFormBlock control={form.control} register={form.register} name="personalInfo.extraFields" />
        </div>
      </CardContent>
    </Card>
  )
}
