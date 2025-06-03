"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"
import { MicroBehavior } from "./types"
import { getBehaviorSuggestions } from "@/lib/behavior-suggestion"
import { useHabitWizard } from "@/app/habits/add/HabitWizardContext"
import { useStepLayout } from "@/app/habits/add/StepLayoutContext"

export default function SelectBehaviors() {
  const {
    habitBasicInfo,
    selectedMicroBehaviors: contextSelectedBehaviors,
    selectBehaviors,
  } = useHabitWizard()
  const { setFixedContent } = useStepLayout()

  const [selectedMicroBehaviors, setSelectedMicroBehaviors] = useState<MicroBehavior[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const fetchBehaviorSuggestions = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      const suggestions = await getBehaviorSuggestions(habitBasicInfo)
      setSelectedMicroBehaviors(suggestions)
      
    } catch (error) {
      console.error("获取行为建议失败:", error)
      setError(error instanceof Error ? error.message : "获取建议失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  // 组件挂载时自动获取建议
  useEffect(() => {
    fetchBehaviorSuggestions()
  }, [habitBasicInfo.title, habitBasicInfo.description])

  // 如果 Context 中有已选择的微行为，恢复状态
  useEffect(() => {
    if (contextSelectedBehaviors.length > 0) {
      setSelectedMicroBehaviors(contextSelectedBehaviors)
    }
  }, [contextSelectedBehaviors])

  // 设置固定内容
  useEffect(() => {
    // 始终设置基础的习惯信息卡片
    const habitCard = (
      <Card className="border-surface-divider bg-surface-main">
        <CardContent className="p-4">
          <p className="text-sm text-text-secondary">习惯：</p>
          <p className="font-medium text-text-primary">{habitBasicInfo.title}</p>
        </CardContent>
      </Card>
    )

    if (isLoading || error) {
      // 加载和错误状态时只显示习惯信息
      setFixedContent(habitCard)
    } else {
      // 正常状态时显示完整的固定内容
      setFixedContent(
        <div className="space-y-4">
          {habitCard}

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
      )
    }

    // 清理函数
    return () => {
      setFixedContent(null)
    }
  }, [habitBasicInfo.title, selectedMicroBehaviors, isLoading, error, setFixedContent])

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

  const handleRetry = () => {
    fetchBehaviorSuggestions()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-6"></div>
        <h3 className="text-lg font-medium text-text-primary mb-2">正在为您推荐微行为...</h3>
        <p className="text-sm text-text-secondary text-center leading-relaxed">
          基于您的习惯目标，我们正在分析并推荐
          <br />
          最适合的微行为组合
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">获取建议失败</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重试
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
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