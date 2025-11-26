// src/components/Stepper.tsx
"use client";

type StepperProps = {
  steps: string[];
  activeIndex: number;
};

export function Stepper({ steps, activeIndex }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      {steps.map((label, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;
        return (
          <div
            key={label}
            className="flex-1 flex flex-col items-center text-xs md:text-sm"
          >
            <div
              className={[
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                isDone
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : isActive
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-500 text-slate-400"
              ].join(" ")}
            >
              {index + 1}
            </div>
            <span className="mt-1 text-slate-200">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
