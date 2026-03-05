import * as React from "react"
import { cn } from "@/lib/utils"

interface StepWizardProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    id: string;
    label: string;
  }[]
  currentStep: number;
}

const StepWizard = React.forwardRef<HTMLDivElement, StepWizardProps>(({
  className,
  steps,
  currentStep,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn("w-full mb-10 overflow-x-auto pb-4 scrollbar-hide hide-scrollbar relative", className)} {...props}>
      <div className="absolute top-[1.25rem] left-0 w-full h-[1px] bg-border-muted -z-10" />
      <div className="flex justify-between min-w-max px-2">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          const isFuture = currentStep < stepNum;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3 w-24">
              <div
                className={cn(
                  "w-10 h-10 rounded-none flex items-center justify-center font-mono text-[11px] font-black uppercase tracking-widest transition-all duration-300 border",
                  isActive && "bg-foreground text-background border-foreground scale-110 shadow-lg shadow-foreground/10",
                  isCompleted && "bg-background text-foreground border-foreground",
                  isFuture && "bg-background text-foreground-muted border-border-muted"
                )}
              >
                {isCompleted ? (
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                ) : (
                  stepNum < 10 ? `0${stepNum}` : stepNum
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] font-mono uppercase tracking-widest text-center px-1 font-bold",
                  isActive ? "text-foreground" : "text-foreground-muted/60"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
StepWizard.displayName = "StepWizard"

export { StepWizard }
