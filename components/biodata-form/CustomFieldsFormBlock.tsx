import { Control, UseFormRegister, ArrayPath, FieldPath, useFieldArray } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CustomFieldsFormBlock({
  control,
  register,
  name,
}: {
  control: Control<BiodataFormValues>
  register: UseFormRegister<BiodataFormValues>
  name: ArrayPath<BiodataFormValues>
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  return (
    <div className="sm:col-span-2 space-y-4 pt-6 border-t border-border-muted border-dashed">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-serif text-lg text-foreground italic">Additional Information</h4>
          <p className="text-xs text-foreground-muted font-mono uppercase tracking-widest mt-1">Add any custom details not listed above</p>
        </div>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-end group/custom">
          <div className="flex-1">
            <FormField label="Custom Label">
              <Input
                type="text"
                {...register(`${name}.${index}.label` as FieldPath<BiodataFormValues>)}
                placeholder="e.g. Special Note"
                className="block w-full"
              />
            </FormField>
          </div>
          <div className="flex-[2]">
            <FormField label="Custom Value">
              <Input
                type="text"
                {...register(`${name}.${index}.value` as FieldPath<BiodataFormValues>)}
                placeholder="Enter detail here..."
                className="block w-full"
              />
            </FormField>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="w-12 border border-transparent hover:border-border-muted opacity-0 group-hover/custom:opacity-100"
          >
            <svg className="w-4 h-4 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" /></svg>
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ label: "", value: "" })}
        className="flex items-center gap-2 mt-4 w-full justify-center border-dashed font-mono text-[10px] font-black uppercase tracking-widest"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
        Add Custom Field
      </Button>
    </div>
  )
}
