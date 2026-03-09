import { UseFormReturn } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { CustomFieldsFormBlock } from "../CustomFieldsFormBlock"
import { EMPLOYMENT_TYPES } from "@/lib/constants/biodata-options"

interface ProfessionStepProps {
  form: UseFormReturn<BiodataFormValues>
  lang: "en" | "bn"
}

export function ProfessionStep({ form, lang }: ProfessionStepProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader className="border-b border-border-muted mb-6">
        <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 04</p>
        <CardTitle className="text-3xl font-serif text-foreground italic">
          {lang === 'en' ? 'Profession Information' : 'পেশাগত তথ্য'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2">
          <FormField label="Occupation / Job Title" error={form.formState.errors.profession?.occupation?.message}>
            <Input type="text" {...form.register("profession.occupation")} placeholder="e.g. Software Engineer" className="block w-full" />
          </FormField>

          <FormField label="Organization Name (Optional)">
            <Input type="text" {...form.register("profession.organizationName")} placeholder="e.g. Tech Company Ltd." className="block w-full" />
          </FormField>

          <FormField label="Employment Type (Optional)">
            <Select {...form.register("profession.employmentType")} className="cursor-pointer">
              <option value="">Select Type</option>
              {EMPLOYMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </Select>
          </FormField>

          <FormField label="Monthly Income (Optional)">
            <Input type="text" {...form.register("profession.monthlyIncome")} placeholder="e.g. 50,000 BDT" className="block w-full" />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Workplace Location (Optional)">
              <Input type="text" {...form.register("profession.workplaceLocation")} placeholder="e.g. Banani, Dhaka" className="block w-full" />
            </FormField>
          </div>

          <CustomFieldsFormBlock control={form.control} register={form.register} name="profession.extraFields" />
        </div>
      </CardContent>
    </Card>
  )
}
