import { Check } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  // 渲染步骤圆圈
  const renderStepCircle = (step: number, currentStep: number) => {
    let circleClassName = "w-6 h-6 rounded-full flex items-center justify-center";
    
    if (step < currentStep) {
      circleClassName += " bg-brand-primary text-white"
      return (
        <div className={circleClassName}>
          <Check className="w-3 h-3" />
        </div>
      );
    } else {
      circleClassName += " border-2 bg-transparent";
      if (step === currentStep) {
        circleClassName += " border-brand-primary";
      } else {
        circleClassName += " border-brand-primary/60";
      }
      return (
        <div className={circleClassName}></div>
      );
    }
  }
  
  // 渲染连接线
  const renderConnector = (step: number, currentStep: number, totalSteps: number) => {
    if (step >= totalSteps) {
      return null;
    }

    let connectorClassName = "w-6 h-0.5 mx-1";
    if (step < currentStep) {
      connectorClassName += " bg-brand-primary";
    } else {
      connectorClassName += " bg-brand-primary/60";
    }
    
    return (
      <div className={connectorClassName} />
    )
  }

  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1
          return (
            <div key={step} className="flex items-center">
              {renderStepCircle(step, currentStep)}
              {renderConnector(step, currentStep, totalSteps)}
            </div>
          )
        })}
      </div>
    </div>
  )
}