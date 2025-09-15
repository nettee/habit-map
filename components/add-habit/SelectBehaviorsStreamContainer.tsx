"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getBehaviorSuggestionsStream } from "@/lib/behavior-suggestion"
import { useHabitWizard } from "@/app/habits/add/HabitWizardContext"
import { useStepLayout } from "@/app/habits/add/StepLayoutContext"
import { MicroBehavior } from "@/components/add-habit/types"
import SelectBehaviors from "./SelectBehaviors"
import SelectBehaviorsLoading from "./SelectBehaviorsLoading"

export default function SelectBehaviorsStreamContainer() {
  const { habitBasicInfo, selectedMicroBehaviors } = useHabitWizard()
  const { setFixedContent } = useStepLayout()
  
  const [suggestions, setSuggestions] = useState<MicroBehavior[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 使用流式API获取建议
  useEffect(() => {
    let mounted = true
    
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setSuggestions([])
        
        await getBehaviorSuggestionsStream(
          habitBasicInfo,
          // onSuggestion: 每收到一个建议就添加到列表
          (suggestion: MicroBehavior) => {
            if (!mounted) return
            setSuggestions(prev => [...prev, suggestion])
            // 收到第一个建议就不再显示loading
            if (isLoading) {
              setIsLoading(false)
            }
          },
          // onError: 处理错误
          (errorMessage: string) => {
            if (!mounted) return
            setError(errorMessage)
            setIsLoading(false)
          },
          // onComplete: 标记完成
          (count: number) => {
            if (!mounted) return
            setIsComplete(true)
            setIsLoading(false)
            console.log(`流式加载完成，共收到 ${count} 个建议`)
          }
        )
      } catch (err) {
        if (!mounted) return
        console.error('获取流式建议失败:', err)
        setError(err instanceof Error ? err.message : '获取建议失败')
        setIsLoading(false)
      }
    }
    
    fetchSuggestions()
    
    return () => {
      mounted = false
    }
  }, [habitBasicInfo.title, habitBasicInfo.description]) // 当习惯信息变化时重新获取
  
  // 设置固定内容
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
    const loadingStatus = isLoading ? " (加载中...)" : isComplete ? ` (共${suggestions.length}个)` : ` (${suggestions.length}个)`

    const fixedContent = (
      <div className="space-y-4">
        {habitCard}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-text-primary">
              推荐的微行为{loadingStatus}
            </h3>
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
  }, [habitBasicInfo.title, selectedMicroBehaviors, suggestions.length, isLoading, isComplete, setFixedContent])
  
  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">获取建议失败</h3>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }
  
  // 完全加载中状态（还没有收到任何建议）
  if (isLoading && suggestions.length === 0) {
    return <SelectBehaviorsLoading />
  }
  
  // 有建议数据时显示（可能还在加载更多）
  return <SelectBehaviors initialSuggestions={suggestions} />
}
