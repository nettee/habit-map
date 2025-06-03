"use client"

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react"
import { MicroBehavior, ReminderSettings } from "@/components/add-habit/types"

/**
 * 习惯向导业务Context类型定义
 * 
 * 这个Context专门负责管理习惯创建向导的所有业务数据和操作，
 * 包括用户输入的数据、业务逻辑处理、状态持久化等核心功能。
 * 
 * 设计原则：
 * 1. 单一职责：只关心业务数据，不涉及UI展示逻辑
 * 2. 状态管理：集中管理所有步骤的数据状态
 * 3. 数据持久化：支持页面刷新后状态恢复
 * 4. 业务验证：提供各步骤的完成度验证
 */
interface HabitWizardContextType {
  // ===== 核心状态数据 =====
  currentStep: number                    // 当前所在步骤（1-3）
  habitName: string                      // 习惯名称
  habitDescription: string               // 习惯描述
  selectedMicroBehaviors: MicroBehavior[] // 选中的微行为列表
  reminderSettings: ReminderSettings     // 提醒设置配置
  expandedCards: { [key: string]: boolean } // 卡片展开状态（UI辅助状态）
  
  // ===== 数据操作方法 =====
  setHabitName: (name: string) => void
  setHabitDescription: (description: string) => void
  selectBehaviors: (behaviors: MicroBehavior[]) => void
  setReminderSettings: (settings: ReminderSettings | ((prev: ReminderSettings) => ReminderSettings)) => void
  toggleCardExpanded: (behaviorId: string) => void
  
  // ===== 流程控制方法 =====
  nextStep: () => void                   // 前进到下一步
  prevStep: () => void                   // 返回到上一步
  setStep: (step: number) => void        // 直接跳转到指定步骤
  complete: () => void                   // 完成整个向导流程
  resetState: () => void                 // 重置所有状态
  
  // ===== 业务验证方法 =====
  canProceedToStep: (step: number) => boolean  // 检查是否可以进入指定步骤
  getValidationErrors: (step: number) => string[]  // 获取指定步骤的验证错误
}

// 创建 Context
const HabitWizardContext = createContext<HabitWizardContextType | undefined>(undefined)

/**
 * 习惯向导业务Context Provider组件
 * 
 * 核心职责：
 * 1. 管理习惯创建向导的所有业务状态
 * 2. 提供状态操作的统一接口
 * 3. 处理数据的本地存储和恢复
 * 4. 实现业务逻辑验证
 * 5. 性能优化，避免不必要的重渲染
 */
interface HabitWizardProviderProps {
  children: ReactNode
}

export const HabitWizardProvider: React.FC<HabitWizardProviderProps> = ({ children }) => {
  // ===== 状态定义 =====
  // 使用多个独立的useState，便于精确控制更新和优化性能
  const [currentStep, setCurrentStep] = useState(1)
  const [habitName, setHabitName] = useState("")
  const [habitDescription, setHabitDescription] = useState("")
  const [selectedMicroBehaviors, setSelectedMicroBehaviors] = useState<MicroBehavior[]>([])
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({})
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({})

  // ===== 状态恢复Effect =====
  // 从localStorage恢复之前保存的状态，实现页面刷新后的数据持久化
  useEffect(() => {
    const savedState = localStorage.getItem("habitWizardState")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        // 安全地恢复每个状态字段，避免因数据格式变化导致的错误
        if (parsedState.currentStep) setCurrentStep(parsedState.currentStep)
        if (parsedState.habitName) setHabitName(parsedState.habitName)
        if (parsedState.habitDescription) setHabitDescription(parsedState.habitDescription)
        if (parsedState.selectedMicroBehaviors) setSelectedMicroBehaviors(parsedState.selectedMicroBehaviors)
        if (parsedState.reminderSettings) setReminderSettings(parsedState.reminderSettings)
        if (parsedState.expandedCards) setExpandedCards(parsedState.expandedCards)
      } catch (error) {
        console.error("恢复状态失败:", error)
        // 如果恢复失败，清除损坏的数据
        localStorage.removeItem("habitWizardState")
      }
    }
  }, [])

  // ===== 状态保存Effect =====
  // 每当状态变化时，自动保存到localStorage
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

  // ===== 复杂业务操作方法 =====
  
  /**
   * 选择微行为的复合操作
   * 
   * 这个方法不仅更新选中的微行为列表，还会：
   * 1. 为新选中的微行为初始化展开状态
   * 2. 为新选中的微行为设置默认提醒配置
   * 3. 确保UI状态与业务状态的一致性
   */
  const selectBehaviors = (behaviors: MicroBehavior[]) => {
    setSelectedMicroBehaviors(behaviors)
    
    // 为选中的微行为初始化展开状态和默认提醒设置
    const newExpandedCards = { ...expandedCards }
    const newReminderSettings = { ...reminderSettings }

    behaviors
      .filter((b) => b.selected)
      .forEach((behavior) => {
        // 默认展开新选中的微行为卡片，方便用户配置
        newExpandedCards[behavior.id] = true
        
        // 如果该微行为还没有提醒设置，初始化为默认的自然提醒
        if (!newReminderSettings[behavior.id]) {
          newReminderSettings[behavior.id] = { type: "anchor" }
        }
      })

    setExpandedCards(newExpandedCards)
    setReminderSettings(newReminderSettings)
  }

  /**
   * 切换卡片展开状态
   * 用于管理微行为配置卡片的展开/收起状态
   */
  const toggleCardExpanded = (behaviorId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [behaviorId]: !prev[behaviorId],
    }))
  }

  // ===== 流程控制方法 =====
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const setStep = (step: number) => {
    setCurrentStep(step)
  }

  /**
   * 完成向导流程
   * 
   * 执行步骤：
   * 1. 收集所有用户输入的数据
   * 2. 构建最终的习惯数据对象
   * 3. 保存数据到localStorage（供完成页面使用）
   * 4. 跳转到完成页面
   * 
   * 注意：这里使用window.location.href而不是router.push
   * 是为了确保完全离开当前的向导流程
   */
  const complete = () => {
    // 构建最终的习惯数据
    const habitData = {
      habitName,
      habitDescription,
      selectedMicroBehaviors: selectedMicroBehaviors.filter((b) => b.selected),
      reminderSettings,
    }

    console.log("创建习惯:", habitData)

    // 将数据存储到localStorage，供完成页面使用
    localStorage.setItem("newHabitData", JSON.stringify(habitData))

    // 导航到完成页面（清理工作由completeAdd页面负责）
    window.location.href = "/habits/completeAdd"
  }

  /**
   * 重置所有状态
   * 用于用户取消或重新开始时清理所有数据
   */
  const resetState = () => {
    setCurrentStep(1)
    setHabitName("")
    setHabitDescription("")
    setSelectedMicroBehaviors([])
    setReminderSettings({})
    setExpandedCards({})
    localStorage.removeItem("habitWizardState")
  }

  // ===== 业务验证方法 =====
  
  /**
   * 检查是否可以进入指定步骤
   * 实现递进式验证：每一步都需要前面步骤的数据完整
   */
  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true // 总是可以进入第一步
      case 2:
        return habitName.trim() !== "" // 第二步需要习惯名称
      case 3:
        return habitName.trim() !== "" && 
               selectedMicroBehaviors.some(b => b.selected) // 第三步需要习惯名称和选择的微行为
      default:
        return false
    }
  }

  /**
   * 获取指定步骤的验证错误信息
   * 用于向用户提供具体的错误提示
   */
  const getValidationErrors = (step: number): string[] => {
    const errors: string[] = []
    
    switch (step) {
      case 2:
        if (!habitName.trim()) {
          errors.push("请输入习惯名称")
        }
        break
      case 3:
        if (!habitName.trim()) {
          errors.push("请输入习惯名称")
        }
        if (!selectedMicroBehaviors.some(b => b.selected)) {
          errors.push("请至少选择一个微行为")
        }
        break
    }
    
    return errors
  }

  // ===== Context值优化 =====
  // 使用useMemo优化Context值，避免因状态变化导致的不必要重渲染
  // 只有依赖数组中的状态发生变化时，才会重新创建Context值
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
    
    // 业务验证
    canProceedToStep,
    getValidationErrors,
  }), [
    // 依赖数组：只有这些状态变化时才重新创建Context值
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

/**
 * 业务Context Hook
 * 
 * 提供类型安全的Context访问方式，确保：
 * 1. 只能在Provider内部使用
 * 2. 返回类型完整且正确
 * 3. 开发时提供友好的错误提示
 */
export const useHabitWizard = (): HabitWizardContextType => {
  const context = useContext(HabitWizardContext)
  if (context === undefined) {
    throw new Error("useHabitWizard 必须在 HabitWizardProvider 内部使用")
  }
  return context
}