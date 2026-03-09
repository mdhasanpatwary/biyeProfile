import { UseFormReturn } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CustomFieldsFormBlock } from "../CustomFieldsFormBlock"

interface ExpectationsStepProps {
  form: UseFormReturn<BiodataFormValues>
  lang: "en" | "bn"
}

export function ExpectationsStep({ form, lang }: ExpectationsStepProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader className="border-b border-border-muted mb-6">
        <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 06</p>
        <CardTitle className="text-3xl font-serif text-foreground italic">
          {lang === 'en' ? 'Marriage Expectations' : 'বিয়ে সংক্রান্ত প্রত্যাশা'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2">
          <FormField label="Expected Age Range (Optional)">
            <Input type="text" {...form.register("expectations.expectedAgeRange")} placeholder="e.g. 22-26" className="block w-full" />
          </FormField>

          <FormField label="Expected Height (Optional)">
            <Input type="text" {...form.register("expectations.expectedHeight")} placeholder={`e.g. 5'2" - 5'6"`} className="block w-full" />
          </FormField>

          <FormField label="Expected Education (Optional)">
            <Input type="text" {...form.register("expectations.expectedEducation")} placeholder="e.g. Graduate or Minimum Post Graduate" className="block w-full" />
          </FormField>

          <FormField label="Expected Profession (Optional)">
            <Input type="text" {...form.register("expectations.expectedProfession")} placeholder="e.g. Doctor, Engineer, or Business" className="block w-full" />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Expected Location (Optional)">
              <Input type="text" {...form.register("expectations.expectedLocation")} placeholder="e.g. Dhaka or Abroad" className="block w-full" />
            </FormField>
          </div>

          <div className="sm:col-span-2 mt-6">
            <FormField label="Additional Expectations (Optional)">
              <Textarea {...form.register("expectations.additionalExpectations")} placeholder="e.g. Looking for someone with a good family background..." rows={4} className="block w-full" />
            </FormField>
          </div>

          <CustomFieldsFormBlock control={form.control} register={form.register} name="expectations.extraFields" />
        </div>
      </CardContent>
    </Card>
  )
}
