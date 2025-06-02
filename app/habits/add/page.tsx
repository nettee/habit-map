"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import SetHabitInfo from "@/components/add-habit/SetHabitInfo"
import SelectBehaviors from "@/components/add-habit/SelectBehaviors"
import SetBehaviorReminders from "@/components/add-habit/SetBehaviorReminders"
import { MicroBehavior, AnchorOption, ReminderSettings } from "@/components/add-habit/types"

export default function AddHabitPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [habitName, setHabitName] = useState("")
  const [habitDescription, setHabitDescription] = useState("")
  const [selectedMicroBehaviors, setSelectedMicroBehaviors] = useState<MicroBehavior[]>([])
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({})
  const { toast } = useToast()
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({})

  const anchorOptions: AnchorOption[] = [
    { id: "morning-brush", label: "早上刷牙后", description: "利用晨间例行公事" },
    { id: "coffee", label: "喝咖啡/茶时", description: "与日常饮品习惯结合" },
    { id: "lunch-break", label: "午休时间", description: "利用工作间隙" },
    { id: "before-sleep", label: "睡前", description: "作为放松活动" },
    { id: "commute", label: "通勤路上", description: "利用交通时间" },
  ]

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // 这个逻辑现在由SelectBehaviors组件的onNext处理
      // 这里不应该到达，因为SelectBehaviors会直接调用handleSelectBehaviors
    }
  }

  const handleSelectBehaviors = (behaviors: MicroBehavior[]) => {
    setSelectedMicroBehaviors(behaviors)
    
    // 为选中的微行为初始化展开状态和默认提醒设置
    const initialExpandedState: { [key: string]: boolean } = {}
    const initialReminderSettings: ReminderSettings = { ...reminderSettings }

    behaviors
      .filter((b) => b.selected)
      .forEach((behavior) => {
        initialExpandedState[behavior.id] = true
        // 如果该微行为还没有提醒设置，初始化为默认的自然提醒
        if (!initialReminderSettings[behavior.id]) {
          initialReminderSettings[behavior.id] = { type: "anchor" }
        }
      })

    setExpandedCards(initialExpandedState)
    setReminderSettings(initialReminderSettings)
    setCurrentStep(3)
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = () => {
    // 这里处理完成创建的逻辑
    const habitData = {
      habitName,
      habitDescription,
      selectedMicroBehaviors: selectedMicroBehaviors.filter((b) => b.selected),
      reminderSettings,
    }

    console.log("创建习惯:", habitData)

    // 将数据存储到 localStorage 或通过其他方式传递给下一个页面
    localStorage.setItem("newHabitData", JSON.stringify(habitData))

    // 导航到完成页面
    window.location.href = "/habits/completeAdd"
  }

  const toggleCardExpanded = (behaviorId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [behaviorId]: !prev[behaviorId],
    }))
  }

  return (
    <div className="min-h-screen bg-surface-main">
      {/* 步骤内容 */}
      <div className="h-screen flex flex-col">
        {/* 步骤内容区域 - 占用全部空间 */}
        <div className="flex-1 min-h-0">
          {currentStep === 1 && (
            <SetHabitInfo
              habitName={habitName}
              setHabitName={setHabitName}
              habitDescription={habitDescription}
              setHabitDescription={setHabitDescription}
              onNext={handleNextStep}
              onCancel={() => window.history.back()}
            />
          )}
          {currentStep === 2 && (
            <SelectBehaviors
              habitName={habitName}
              habitDescription={habitDescription}
              onNext={handleSelectBehaviors}
              onPrev={handlePrevStep}
            />
          )}
          {currentStep === 3 && (
            <SetBehaviorReminders
              selectedMicroBehaviors={selectedMicroBehaviors}
              reminderSettings={reminderSettings}
              setReminderSettings={setReminderSettings}
              anchorOptions={anchorOptions}
              expandedCards={expandedCards}
              onToggleCardExpanded={toggleCardExpanded}
              onComplete={handleComplete}
              onPrev={handlePrevStep}
            />
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}