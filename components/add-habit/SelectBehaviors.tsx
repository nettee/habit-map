"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { MicroBehavior } from "./types"

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
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-text-primary mb-2">创建新习惯</h1>
          <p className="text-sm text-text-secondary">第2步：设计你的微行动</p>
        </div>

        <Card className="border-surface-divider bg-surface-main">
          <CardContent className="p-4">
            <p className="text-sm text-text-secondary">习惯：</p>
            <p className="font-medium text-text-primary">{habitName}</p>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-6"></div>
          <h3 className="text-lg font-medium text-text-primary mb-2">正在为您推荐微行为...</h3>
          <p className="text-sm text-text-secondary text-center leading-relaxed">
            基于您的习惯目标，我们正在分析并推荐
            <br />
            最适合的微行为组合
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-2">创建新习惯</h1>
        <p className="text-sm text-text-secondary">第2步：设计你的微行动</p>
      </div>

      <Card className="border-surface-divider bg-surface-main">
        <CardContent className="p-4">
          <p className="text-sm text-text-secondary">习惯：</p>
          <p className="font-medium text-text-primary">{habitName}</p>
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-text-primary">推荐的微行为</h3>
          <span className="text-sm text-text-secondary">
            已选择 {selectedMicroBehaviors.filter((b) => b.selected).length}/3
          </span>
        </div>
        <p className="text-sm text-text-secondary mb-4">选择1-3个简单易行的微行为，让习惯更容易坚持</p>

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
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onPrev} className="text-text-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
        <Button onClick={onNext} className="bg-brand-primary hover:bg-brand-primary/80 text-white">
          下一步
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}