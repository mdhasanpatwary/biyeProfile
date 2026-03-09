import { UseFormReturn, useFieldArray } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CustomFieldsFormBlock } from "../CustomFieldsFormBlock"

interface EducationStepProps {
  form: UseFormReturn<BiodataFormValues>
  lang: "en" | "bn"
}

export function EducationStep({ form, lang }: EducationStepProps) {
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "education.qualifications"
  })

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardHeader className="border-b border-border-muted mb-6">
        <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 03</p>
        <CardTitle className="text-3xl font-serif text-foreground italic">
          {lang === 'en' ? 'Education Information' : 'শিক্ষাগত তথ্য'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-10">
          {educationFields.map((field, index) => (
            <div key={field.id} className="p-8 md:p-10 rounded-none bg-accent/50 border border-border-muted relative group/edu">
              {educationFields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-background text-foreground-muted rounded-none shadow-md border border-border-muted flex items-center justify-center opacity-0 group-hover/edu:opacity-100 transition-all hover:bg-accent z-10"
                >
                  <svg className="w-4 min-w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </Button>
              )}

              <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <FormField label="Degree / Level" error={form.formState.errors.education?.qualifications?.[index]?.degree?.message}>
                    <Input
                      type="text"
                      {...form.register(`education.qualifications.${index}.degree` as const)}
                      placeholder="e.g. SSC / Graduation"
                      className="block w-full"
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-1">
                  <FormField label="Passing Year" error={form.formState.errors.education?.qualifications?.[index]?.passingYear?.message}>
                    <Input
                      type="text"
                      {...form.register(`education.qualifications.${index}.passingYear` as const)}
                      placeholder="e.g. 2018"
                      className="block w-full"
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField label="Institution Name" error={form.formState.errors.education?.qualifications?.[index]?.institution?.message}>
                    <Input
                      type="text"
                      {...form.register(`education.qualifications.${index}.institution` as const)}
                      placeholder="e.g. Dhaka University"
                      className="block w-full"
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField label="Result (Optional)" error={form.formState.errors.education?.qualifications?.[index]?.result?.message}>
                    <Input
                      type="text"
                      {...form.register(`education.qualifications.${index}.result` as const)}
                      placeholder="e.g. GPA 5.00 / 1st Class"
                      className="block w-full"
                    />
                  </FormField>
                </div>
              </div>
              <div className="mt-6 md:-mx-2">
                <CustomFieldsFormBlock control={form.control} register={form.register} name={`education.qualifications.${index}.extraFields`} />
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={() => appendEducation({ degree: "", institution: "", passingYear: "", result: "" })}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 group border-dashed"
          >
            <div className="w-6 h-6 rounded-none bg-accent group-hover:bg-border-muted flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            Add Another Qualification
          </Button>

          <div className="sm:col-span-2 mt-12 py-8 border-t border-border-muted">
            <FormField label="Additional Educational Details (Optional)">
              <Textarea {...form.register("education.additionalQualifications")} placeholder="e.g. Won national debate championship" rows={3} className="block w-full" />
            </FormField>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
