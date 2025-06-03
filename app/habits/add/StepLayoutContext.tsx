"use client"

import React, { createContext, useContext, useMemo, ReactNode, useState } from 'react'
import { useHabitWizard } from './HabitWizardContext'

/**
 * 单个步骤的配置信息
 * 
 * 定义每个步骤的基本属性和UI行为，
 * 这些配置与具体的业务数据无关，是静态的UI配置。
 */
interface StepConfig {
  number: number          // 步骤编号（1、2、3）
  title: string          // 步骤标题
  needsScroll?: boolean  // 是否需要滚动容器（内容多时需要）
  showBackButton?: boolean      // 是否显示返回按钮
  backButtonText?: string       // 返回按钮文案
  nextButtonText?: string       // 下一步按钮文案
}

/**
 * 步骤布局Context类型定义
 * 
 * 这个Context专门负责管理向导布局相关的UI状态和配置，
 * 它依赖于HabitWizardContext的业务数据来计算UI的展示状态。
 * 
 * 设计原则：
 * 1. UI专用：只关心如何展示，不管理业务数据
 * 2. 依赖业务：基于业务状态计算UI状态
 * 3. 配置驱动：通过配置表管理不同步骤的UI差异
 * 4. 可扩展：支持自定义固定内容区域
 */
interface StepLayoutContextType {
  // ===== 当前步骤配置 =====
  currentStepConfig: StepConfig    // 当前步骤的静态配置信息
  
  // ===== UI状态计算结果 =====
  progress: number        // 进度百分比（0-100）
  canGoNext: boolean      // 是否可以前进到下一步
  canGoPrev: boolean      // 是否可以返回上一步
  
  // ===== 导航按钮配置 =====
  leftButton: {
    text: string      // 左按钮文案
    show: boolean     // 是否显示左按钮
  }
  rightButton: {
    text: string      // 右按钮文案
    disabled: boolean // 是否禁用右按钮
  }
  
  // ===== 可选的固定内容区域 =====
  fixedContent?: ReactNode              // 固定内容（在滚动区域之前显示）
  setFixedContent: (content: ReactNode) => void  // 设置固定内容的方法
}

/**
 * 步骤配置数据表
 * 
 * 集中管理每个步骤的静态配置，包括：
 * - 步骤标题和编号
 * - 是否需要滚动容器
 * - 按钮文案配置
 * 
 * 这种配置驱动的方式便于：
 * 1. 统一管理步骤配置
 * 2. 快速调整步骤行为
 * 3. 添加新步骤时保持一致性
 */
const STEP_CONFIGS: Record<number, StepConfig> = {
  1: {
    number: 1,
    title: "定义你的习惯",
    needsScroll: false,              // 第一步内容较少，不需要滚动
    showBackButton: true,
    backButtonText: "取消",          // 第一步的"返回"是取消操作
    nextButtonText: "下一步"
  },
  2: {
    number: 2,
    title: "选择微行为",
    needsScroll: true,               // 第二步微行为列表较多，需要滚动
    showBackButton: true,
    backButtonText: "上一步",        // 第二步可以返回上一步
    nextButtonText: "下一步"
  },
  3: {
    number: 3,
    title: "设置提醒",
    needsScroll: true,               // 第三步提醒配置较多，需要滚动
    showBackButton: true,
    backButtonText: "上一步",
    nextButtonText: "完成"           // 第三步是完成操作
  }
}

const StepLayoutContext = createContext<StepLayoutContextType | null>(null)

/**
 * 步骤布局Context Provider组件
 * 
 * 核心职责：
 * 1. 监听业务Context的状态变化
 * 2. 根据业务状态计算UI状态和按钮可用性
 * 3. 提供步骤配置和UI状态给布局组件使用
 * 4. 管理可选的固定内容区域
 * 
 * 与HabitWizardContext的关系：
 * - 消费：读取currentStep、habitBasicInfo、selectedMicroBehaviors等业务状态
 * - 计算：基于业务状态计算canGoNext、progress等UI状态
 * - 不修改：从不直接修改业务状态，只提供计算结果
 */
interface StepLayoutProviderProps {
  children: ReactNode
}

export function StepLayoutProvider({ children }: StepLayoutProviderProps) {
  // 从业务Context获取必要的状态数据
  const { currentStep, habitBasicInfo, selectedMicroBehaviors } = useHabitWizard()
  
  // 管理固定内容区域的状态
  // 这允许某些步骤在滚动内容之前插入固定的UI元素
  const [fixedContent, setFixedContentState] = useState<ReactNode>(null)
  
  // 使用useMemo优化计算，避免每次渲染都重新计算UI状态
  // 只有依赖的业务状态发生变化时，才重新计算UI配置
  const contextValue = useMemo(() => {
    // 获取当前步骤的基础配置，如果步骤不存在则回退到第一步
    const stepConfig = STEP_CONFIGS[currentStep] || STEP_CONFIGS[1]
    
    // ===== 进度计算 =====
    // 简单的线性进度：当前步骤 / 总步骤数
    const progress = (currentStep / 3) * 100
    
    // ===== 前进条件计算 =====
    // 根据每个步骤的业务要求，判断是否可以前进
    // 这是核心的业务逻辑验证，确保用户完成当前步骤才能继续
    let canGoNext = false
    switch (currentStep) {
      case 1:
        // 第一步：需要输入习惯名称
        canGoNext = habitBasicInfo.title.trim() !== ""
        break
      case 2:
        // 第二步：需要选择至少一个微行为
        canGoNext = selectedMicroBehaviors.some(b => b.selected)
        break
      case 3:
        // 第三步：总是可以完成（因为提醒设置是可选的）
        canGoNext = true
        break
    }
    
    // ===== 后退条件计算 =====
    // 第一步不能后退（会变成取消操作），其他步骤可以后退
    const canGoPrev = currentStep > 1
    
    // 返回完整的UI状态配置
    return {
      // 步骤配置
      currentStepConfig: stepConfig,
      
      // UI状态
      progress,
      canGoNext,
      canGoPrev,
      
      // 按钮配置
      leftButton: {
        text: stepConfig.backButtonText || "返回",
        show: stepConfig.showBackButton || false
      },
      rightButton: {
        text: stepConfig.nextButtonText || "下一步",
        disabled: !canGoNext  // 基于业务验证结果决定是否禁用
      },
      
      // 固定内容管理
      fixedContent,
      setFixedContent: setFixedContentState,
    }
  }, [
    // 依赖数组：只有这些状态变化时才重新计算
    // 注意这里不包括所有业务状态，只包括影响UI计算的关键状态
    currentStep,           // 步骤变化影响配置和进度
    habitBasicInfo,            // 习惯基本信息影响第1步的前进条件
    selectedMicroBehaviors, // 微行为选择影响第2步的前进条件
    fixedContent          // 固定内容变化需要重新渲染
  ])
  
  return (
    <StepLayoutContext.Provider value={contextValue}>
      {children}
    </StepLayoutContext.Provider>
  )
}

/**
 * 布局Context Hook
 * 
 * 提供类型安全的Context访问方式，确保：
 * 1. 只能在StepLayoutProvider内部使用
 * 2. 返回完整且正确的类型信息
 * 3. 开发时提供友好的错误提示
 * 
 * 使用场景：
 * - 布局组件需要获取当前步骤配置
 * - 需要检查按钮状态和文案
 * - 需要获取进度信息
 * - 需要设置固定内容区域
 */
export function useStepLayout() {
  const context = useContext(StepLayoutContext)
  if (!context) {
    throw new Error('useStepLayout must be used within a StepLayoutProvider')
  }
  return context
}