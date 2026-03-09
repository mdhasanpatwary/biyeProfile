import { UseFormReturn } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { CustomFieldsFormBlock } from "../CustomFieldsFormBlock"

interface ContactInfoStepProps {
  form: UseFormReturn<BiodataFormValues>
  lang: "en" | "bn"
}

export function ContactInfoStep({ form, lang }: ContactInfoStepProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader className="border-b border-border-muted mb-6">
        <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 07</p>
        <CardTitle className="text-3xl font-serif text-foreground italic">
          {lang === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2">
          <FormField label="Contact Number" error={form.formState.errors.contactInfo?.contactNumber?.message}>
            <Input type="text" {...form.register("contactInfo.contactNumber")} placeholder="e.g. 01712345678" className="block w-full" />
          </FormField>

          <FormField label="WhatsApp Number (Optional)">
            <Input type="text" {...form.register("contactInfo.whatsAppNumber")} placeholder="e.g. 01712345678" className="block w-full" />
          </FormField>

          <FormField label="Email Address (Optional)" error={form.formState.errors.contactInfo?.emailAddress?.message}>
            <Input type="email" {...form.register("contactInfo.emailAddress")} placeholder="e.g. hello@example.com" className="block w-full" />
          </FormField>

          <FormField label="Guardian Contact Info (Optional)">
            <Input type="text" {...form.register("contactInfo.guardianContact")} placeholder="e.g. Father: 017..." className="block w-full" />
          </FormField>

          <CustomFieldsFormBlock control={form.control} register={form.register} name="contactInfo.extraFields" />
        </div>
      </CardContent>
    </Card>
  )
}
