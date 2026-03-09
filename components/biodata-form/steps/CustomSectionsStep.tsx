import { UseFormReturn, useFieldArray } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CustomSectionsStepProps {
  form: UseFormReturn<BiodataFormValues>
}

export function CustomSectionsStep({ form }: CustomSectionsStepProps) {
  const { fields: customSectionsFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "customSections"
  })

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="flex flex-row justify-between items-center mb-6 border-b border-border-muted space-y-0">
        <div>
          <p className="font-mono text-[11px] text-foreground-muted uppercase tracking-[0.4em] mb-4">Chapter / 08</p>
          <CardTitle className="text-3xl font-serif text-foreground italic">
            Custom Sections
          </CardTitle>
          <p className="text-foreground-muted font-mono text-[10px] uppercase tracking-widest mt-4 px-0">Describe your heritage and lifestyle in detail</p>
        </div>
        <Button
          type="button"
          onClick={() => appendSection({ title: "", fields: [{ label: "", value: "" }] })}
          variant="outline"
          className="flex items-center gap-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Add Section
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-12">
          {customSectionsFields.map((section, sectionIdx) => (
            <div key={section.id} className="p-8 md:p-12 bg-background rounded-none border border-border-muted relative group transition-all overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent group-hover:bg-foreground transition-colors"></div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeSection(sectionIdx)}
                className="absolute top-6 right-6"
              >
                Delete Section
              </Button>

              <div className="mb-10">
                <FormField label="Section Title">
                  <Input
                    type="text"
                    {...form.register(`customSections.${sectionIdx}.title`)}
                    placeholder="e.g., Heritage, Personal Journey"
                    className="block w-full max-w-md"
                  />
                </FormField>
              </div>

              <div className="space-y-6">
                <p className="font-mono text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] mb-4">Entries</p>
                {form.watch(`customSections.${sectionIdx}.fields`)?.map((_, fieldIdx) => (
                  <div key={fieldIdx} className="flex gap-8 md:gap-12 items-end group/field pb-6 border-b border-border-muted/50">
                    <div className="flex-1">
                      <FormField label="Label">
                        <Input type="text" {...form.register(`customSections.${sectionIdx}.fields.${fieldIdx}.label`)} placeholder="e.g. Prayer" className="block w-full" />
                      </FormField>
                    </div>
                    <div className="flex-[2]">
                      <FormField label="Detail">
                        <Input type="text" {...form.register(`customSections.${sectionIdx}.fields.${fieldIdx}.value`)} placeholder="e.g. 5 Times Daily" className="block w-full" />
                      </FormField>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const f = form.getValues(`customSections.${sectionIdx}.fields`);
                        form.setValue(`customSections.${sectionIdx}.fields`, f.filter((_, i) => i !== fieldIdx));
                      }}
                      className="w-12 border border-transparent hover:border-border-muted opacity-0 group-hover/field:opacity-100"
                    >
                      <svg className="w-4 h-4 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" /></svg>
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const f = form.getValues(`customSections.${sectionIdx}.fields`) || [];
                    form.setValue(`customSections.${sectionIdx}.fields`, [...f, { label: "", value: "" }]);
                  }}
                  className="flex items-center gap-2 mt-4"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  Add Entry
                </Button>
              </div>
            </div>
          ))}

          {customSectionsFields.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-border-muted rounded-none bg-accent/20">
              <div className="w-16 h-16 bg-background border border-border-muted rounded-none flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-foreground-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-xs text-foreground-muted/40 font-mono uppercase tracking-widest">No custom sections added</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
