"use client"

import { use, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getBehaviorSuggestions } from "@/lib/behavior-suggestion"
import { useHabitWizard } from "@/app/habits/add/HabitWizardContext"
import { useStepLayout } from "@/app/habits/add/StepLayoutContext"
import SelectBehaviors from "./SelectBehaviors"

export default function SelectBehaviorsContainer() {
  const { habitBasicInfo, selectedMicroBehaviors } = useHabitWizard()
  const { setFixedContent } = useStepLayout()
  
  // 使用 use() hook 获取数据，会在数据未准备好时 suspend
  const suggestions = use(getBehaviorSuggestions(habitBasicInfo))
  
  // 设置固定内容（仅在数据加载完成后）
  useEffect(() => {
    const habitCard = (
      <Card className="border-surface-divider bg-surface-main">
        <CardContent className="p-4">
          <p className="text-sm text-text-secondary">习惯：</p>
          <p className="font-medium text-text-primary">{habitBasicInfo.title}</p>
        </CardContent>
      </Card>
    )

    const selectedCount = selectedMicroBehaviors.filter(b => b.selected).length

    const fixedContent = (
      <div className="space-y-4">
        {habitCard}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-text-primary">推荐的微行为</h3>
            <span className="text-sm text-text-secondary">
              已选择 {selectedCount}/3
            </span>
          </div>
          <p className="text-sm text-text-secondary">选择1-3个简单易行的微行为，让习惯更容易坚持</p>
        </div>
      </div>
    )

    setFixedContent(fixedContent)
    
    return () => {
      setFixedContent(null)
    }
  }, [habitBasicInfo.title, selectedMicroBehaviors, setFixedContent])
  
  return <SelectBehaviors initialSuggestions={suggestions} />
}