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
  const internalRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  // Auto-scroll active step into center
  React.useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const activeTab = container.children[1].children[currentStep - 1] as HTMLElement;

      if (activeTab) {
        const containerWidth = container.offsetWidth;
        const tabWidth = activeTab.offsetWidth;
        const targetScrollLeft = activeTab.offsetLeft - (containerWidth / 2) + (tabWidth / 2);

        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentStep, scrollRef]);

  // Drag to scroll handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        "w-full overflow-x-auto scrollbar-hide hide-scrollbar relative select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      {...props}
    >
      <div className="absolute top-[1.25rem] left-0 w-full h-[1px] bg-border-muted -z-10" />
      <div className="flex justify-between min-w-max px-8">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          const isFuture = currentStep < stepNum;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3 w-28 shrink-0">
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
