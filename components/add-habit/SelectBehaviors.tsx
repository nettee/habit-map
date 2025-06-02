"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { MicroBehavior } from "./types"
import StepLayout from "./StepLayout"

interface SelectBehaviorsProps {
  habitName: string
  selectedMicroBehaviors: MicroBehavior[]
  isLoadingRecommendations: boolean
  onToggleBehavior: (behaviorId: string) => void
  onNext: () => void
  onPrev: () => void
}

export default function SelectBehaviors({
  habitName,
  selectedMicroBehaviors,
  isLoadingRecommendations,
  onToggleBehavior,
  onNext,
  onPrev,
}: SelectBehaviorsProps) {
  if (isLoadingRecommendations) {
    return (
      <StepLayout
        stepNumber={2}
        stepTitle="设计你的微行为"
        needsScroll={false}
        fixedContent={
          <Card className="border-surface-divider bg-surface-main">
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">习惯：</p>
              <p className="font-medium text-text-primary">{habitName}</p>
            </CardContent>
          </Card>
        }
        leftButton={{
          text: "上一步",
          icon: <ArrowLeft className="w-4 h-4 mr-2" />,
          onClick: onPrev,
        }}
        rightButton={{
          text: "下一步",
          icon: <ArrowRight className="w-4 h-4 ml-2" />,
          onClick: onNext,
        }}
      >
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-6"></div>
          <h3 className="text-lg font-medium text-text-primary mb-2">正在为您推荐微行为...</h3>
          <p className="text-sm text-text-secondary text-center leading-relaxed">
            基于您的习惯目标，我们正在分析并推荐
            <br />
            最适合的微行为组合
          </p>
        </div>
      </StepLayout>
    )
  }

  return (
    <StepLayout
      stepNumber={2}
      stepTitle="设计你的微行为"
      needsScroll={true}
      fixedContent={
        <div className="space-y-4">
          <Card className="border-surface-divider bg-surface-main">
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">习惯：</p>
              <p className="font-medium text-text-primary">{habitName}</p>
            </CardContent>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-text-primary">推荐的微行为</h3>
              <span className="text-sm text-text-secondary">
                已选择 {selectedMicroBehaviors.filter((b) => b.selected).length}/3
              </span>
            </div>
            <p className="text-sm text-text-secondary">选择1-3个简单易行的微行为，让习惯更容易坚持</p>
          </div>
        </div>
      }
      leftButton={{
        text: "上一步",
        icon: <ArrowLeft className="w-4 h-4 mr-2" />,
        onClick: onPrev,
      }}
      rightButton={{
        text: "下一步",
        icon: <ArrowRight className="w-4 h-4 ml-2" />,
        onClick: onNext,
      }}
    >
      <div className="space-y-3">
        {selectedMicroBehaviors.map((behavior) => (
          <Card key={behavior.id} className="border-surface-divider">
            <CardContent
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onToggleBehavior(behavior.id)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={behavior.id}
                  checked={behavior.selected}
                  onCheckedChange={() => onToggleBehavior(behavior.id)}
                  className="mt-1 pointer-events-none"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={behavior.id}
                    className="font-medium cursor-pointer text-text-primary pointer-events-none"
                  >
                    {behavior.title}
                  </Label>
                  <p className="text-sm text-text-secondary mt-1 pointer-events-none">{behavior.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </StepLayout>
  )
}