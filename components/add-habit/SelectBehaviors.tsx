"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MicroBehavior } from "./types"
import { useHabitWizard } from "@/app/habits/add/HabitWizardContext"

interface SelectBehaviorsProps {
  initialSuggestions: MicroBehavior[]
}

export default function SelectBehaviors({ initialSuggestions }: SelectBehaviorsProps) {
  const {
    selectedMicroBehaviors: contextSelectedBehaviors,
    selectBehaviors,
  } = useHabitWizard()

  const [selectedMicroBehaviors, setSelectedMicroBehaviors] = useState<MicroBehavior[]>(initialSuggestions)

  // 如果 Context 中有已选择的微行为，恢复状态
  useEffect(() => {
    if (contextSelectedBehaviors.length > 0) {
      setSelectedMicroBehaviors(contextSelectedBehaviors)
    } else {
      // 使用初始建议
      setSelectedMicroBehaviors(initialSuggestions)
    }
  }, [contextSelectedBehaviors, initialSuggestions])

  const handleMicroBehaviorToggle = (behaviorId: string) => {
    const selectedCount = selectedMicroBehaviors.filter((b) => b.selected).length
    const behavior = selectedMicroBehaviors.find((b) => b.id === behaviorId)

    // 如果要选择第4个，直接返回，不显示toast
    if (!behavior?.selected && selectedCount >= 3) {
      return
    }

    const updatedBehaviors = selectedMicroBehaviors.map((behavior) => 
      behavior.id === behaviorId ? { ...behavior, selected: !behavior.selected } : behavior
    )
    
    // 同时更新本地状态和Context状态
    setSelectedMicroBehaviors(updatedBehaviors)
    selectBehaviors(updatedBehaviors)
  }

  return (
    <div className="space-y-3">
      {selectedMicroBehaviors.map((behavior) => (
        <Card key={behavior.id} className="border-surface-divider">
          <CardContent
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleMicroBehaviorToggle(behavior.id)}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id={behavior.id}
                checked={behavior.selected}
                onCheckedChange={() => handleMicroBehaviorToggle(behavior.id)}
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
  )
}