"use client"

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react"
import { MicroBehavior, ReminderSettings } from "@/components/add-habit/types"

// Context 类型定义
interface HabitWizardContextType {
  // 状态
  currentStep: number
  habitName: string
  habitDescription: string
  selectedMicroBehaviors: MicroBehavior[]
  reminderSettings: ReminderSettings
  expandedCards: { [key: string]: boolean }
  
  // 操作函数
  setHabitName: (name: string) => void
  setHabitDescription: (description: string) => void
  selectBehaviors: (behaviors: MicroBehavior[]) => void
  setReminderSettings: (settings: ReminderSettings | ((prev: ReminderSettings) => ReminderSettings)) => void
  toggleCardExpanded: (behaviorId: string) => void
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  complete: () => void
  resetState: () => void
}

// 创建 Context
const HabitWizardContext = createContext<HabitWizardContextType | undefined>(undefined)

// Provider 组件
interface HabitWizardProviderProps {
  children: ReactNode
}

export const HabitWizardProvider: React.FC<HabitWizardProviderProps> = ({ children }) => {
  // 状态定义 - 使用多个 useState
  const [currentStep, setCurrentStep] = useState(1)
  const [habitName, setHabitName] = useState("")
  const [habitDescription, setHabitDescription] = useState("")
  const [selectedMicroBehaviors, setSelectedMicroBehaviors] = useState<MicroBehavior[]>([])
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({})
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({})

  // 从 localStorage 恢复状态
  useEffect(() => {
    const savedState = localStorage.getItem("habitWizardState")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        if (parsedState.currentStep) setCurrentStep(parsedState.currentStep)
        if (parsedState.habitName) setHabitName(parsedState.habitName)
        if (parsedState.habitDescription) setHabitDescription(parsedState.habitDescription)
        if (parsedState.selectedMicroBehaviors) setSelectedMicroBehaviors(parsedState.selectedMicroBehaviors)
        if (parsedState.reminderSettings) setReminderSettings(parsedState.reminderSettings)
        if (parsedState.expandedCards) setExpandedCards(parsedState.expandedCards)
      } catch (error) {
        console.error("恢复状态失败:", error)
      }
    }
  }, [])

  // 保存状态到 localStorage
  useEffect(() => {
    const stateToSave = {
      currentStep,
      habitName,
      habitDescription,
      selectedMicroBehaviors,
      reminderSettings,
      expandedCards,
    }
    localStorage.setItem("habitWizardState", JSON.stringify(stateToSave))
  }, [currentStep, habitName, habitDescription, selectedMicroBehaviors, reminderSettings, expandedCards])

  // 操作函数
  const selectBehaviors = (behaviors: MicroBehavior[]) => {
    setSelectedMicroBehaviors(behaviors)
    
    // 为选中的微行为初始化展开状态和默认提醒设置
    const newExpandedCards = { ...expandedCards }
    const newReminderSettings = { ...reminderSettings }

    behaviors
      .filter((b) => b.selected)
      .forEach((behavior) => {
        newExpandedCards[behavior.id] = true
        // 如果该微行为还没有提醒设置，初始化为默认的自然提醒
        if (!newReminderSettings[behavior.id]) {
          newReminderSettings[behavior.id] = { type: "anchor" }
        }
      })

    setExpandedCards(newExpandedCards)
    setReminderSettings(newReminderSettings)
  }

  const toggleCardExpanded = (behaviorId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [behaviorId]: !prev[behaviorId],
    }))
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const setStep = (step: number) => {
    setCurrentStep(step)
  }

  const complete = () => {
    // 处理完成创建的逻辑
    const habitData = {
      habitName,
      habitDescription,
      selectedMicroBehaviors: selectedMicroBehaviors.filter((b) => b.selected),
      reminderSettings,
    }

    console.log("创建习惯:", habitData)

    // 将数据存储到 localStorage
    localStorage.setItem("newHabitData", JSON.stringify(habitData))

    // 导航到完成页面（清理工作由 completeAdd 页面负责）
    window.location.href = "/habits/completeAdd"
  }

  const resetState = () => {
    setCurrentStep(1)
    setHabitName("")
    setHabitDescription("")
    setSelectedMicroBehaviors([])
    setReminderSettings({})
    setExpandedCards({})
    localStorage.removeItem("habitWizardState")
  }

  // 使用 useMemo 优化 Context 值，避免不必要的重新渲染
  const contextValue = useMemo(() => ({
    // 状态
    currentStep,
    habitName,
    habitDescription,
    selectedMicroBehaviors,
    reminderSettings,
    expandedCards,
    
    // 操作函数
    setHabitName,
    setHabitDescription,
    selectBehaviors,
    setReminderSettings,
    toggleCardExpanded,
    nextStep,
    prevStep,
    setStep,
    complete,
    resetState,
  }), [
    currentStep,
    habitName,
    habitDescription,
    selectedMicroBehaviors,
    reminderSettings,
    expandedCards,
  ])

  return (
    <HabitWizardContext.Provider value={contextValue}>
      {children}
    </HabitWizardContext.Provider>
  )
}

// Hook 用于使用 Context
export const useHabitWizard = (): HabitWizardContextType => {
  const context = useContext(HabitWizardContext)
  if (context === undefined) {
    throw new Error("useHabitWizard 必须在 HabitWizardProvider 内部使用")
  }
  return context
} 