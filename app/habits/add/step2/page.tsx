"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SelectBehaviorsWithSuspense from "@/components/add-habit/SelectBehaviorsWithSuspense"
import { useHabitWizard } from "../HabitWizardContext"

export default function Step2Page() {
  const router = useRouter()
  const { habitBasicInfo, setStep } = useHabitWizard()

  // 设置当前步骤为2，并校验前置数据
  useEffect(() => {
    setStep(2)
    
    // 校验前置数据：习惯名称必须存在（描述是可选的）
    if (!habitBasicInfo.title.trim()) {
      // 如果缺失前置数据，重定向到第一步
      router.push('/habits/add/step1')
    }
  }, [habitBasicInfo.title, setStep, router])

  // 如果前置数据缺失，显示加载状态
  if (!habitBasicInfo.title.trim()) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">正在跳转到第一步...</p>
        </div>
      </div>
    )
  }

  return <SelectBehaviorsWithSuspense />
}