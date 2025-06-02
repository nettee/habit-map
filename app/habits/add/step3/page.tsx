"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SetBehaviorReminders from "@/components/add-habit/SetBehaviorReminders"
import { useHabitWizard } from "../HabitWizardContext"

export default function Step3Page() {
  const router = useRouter()
  const { habitName, selectedMicroBehaviors, setStep } = useHabitWizard()

  // 设置当前步骤为3，并校验前置数据
  useEffect(() => {
    setStep(3)
    
    // 校验前置数据：习惯名称必须存在（描述是可选的）
    if (!habitName.trim()) {
      // 如果缺失习惯信息，重定向到第一步
      router.push('/habits/add/step1')
      return
    }
    
    const hasSelectedBehaviors = selectedMicroBehaviors.some(b => b.selected)
    if (!hasSelectedBehaviors) {
      // 如果没有选择微行为，重定向到第二步
      router.push('/habits/add/step2')
      return
    }
  }, [habitName, selectedMicroBehaviors, setStep, router])

  // 如果前置数据缺失，显示加载状态
  const hasSelectedBehaviors = selectedMicroBehaviors.some(b => b.selected)
  if (!habitName.trim() || !hasSelectedBehaviors) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">正在验证数据...</p>
        </div>
      </div>
    )
  }

  return <SetBehaviorReminders />
} 