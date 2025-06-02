"use client"

import { Check } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1
          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step < currentStep 
                    ? "bg-brand-primary text-white" 
                    : step === currentStep
                    ? "border-2 border-brand-primary bg-transparent"
                    : "border-2 border-brand-primary/80 bg-transparent opacity-50"
                }`}
              >
                {step < currentStep ? (
                  <Check className="w-3 h-3" />
                ) : null}
              </div>
              {step < totalSteps && (
                <div className={`w-6 h-0.5 mx-1 ${step < currentStep ? "bg-brand-primary" : "bg-brand-primary/80"}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}