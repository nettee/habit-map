"use client"

import { Button } from "@/components/ui/button"
import ProgressIndicator from "./ProgressIndicator"
import React from "react"

interface StepLayoutProps {
  stepNumber: number
  stepTitle: string
  totalSteps?: number
  needsScroll?: boolean
  fixedContent?: React.ReactNode // 固定在滚动区域上方的内容
  leftButton: {
    text: string
    icon: React.ReactNode
    onClick: () => void
    variant?: "ghost" | "default"
    className?: string
  }
  rightButton: {
    text: string
    icon: React.ReactNode
    onClick: () => void
    disabled?: boolean
    className?: string
  }
  children: React.ReactNode
}

export default function StepLayout({
  stepNumber,
  stepTitle,
  totalSteps = 3,
  needsScroll = false,
  fixedContent,
  leftButton,
  rightButton,
  children,
}: StepLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* 顶部固定区域：进度指示器和标题 */}
      <div className="flex-shrink-0 p-4 pb-0">
        {/* 进度指示器 */}
        <div className="mb-4">
          <ProgressIndicator currentStep={stepNumber} totalSteps={totalSteps} />
        </div>

        {/* 步骤信息和标题 */}
        <div className="text-center mb-6">
          <p className="text-xs text-text-secondary mb-2">第 {stepNumber} 步，共 {totalSteps} 步 · 设计新习惯</p>
          <h1 className="text-2xl font-bold text-text-primary">{stepTitle}</h1>
        </div>
      </div>

      {/* 固定内容区域（可选） */}
      {fixedContent && (
        <div className="flex-shrink-0 p-4 pb-0">
          {fixedContent}
        </div>
      )}

      {/* 中间区域：内容 */}
      {needsScroll ? (
        <div className="flex-1 relative min-h-0 p-4 pb-0">
          {/* 滚动容器 */}
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="pt-2 pb-2">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 p-4 pb-0 overflow-y-auto">
          {children}
        </div>
      )}

      {/* 底部固定区域：按钮 */}
      <div className="flex-shrink-0 flex justify-between p-4 border-t border-surface-divider">
        <Button
          variant={leftButton.variant || "ghost"}
          onClick={leftButton.onClick}
          className={leftButton.className || "text-text-secondary"}
        >
          {leftButton.icon}
          {leftButton.text}
        </Button>
        <Button
          onClick={rightButton.onClick}
          disabled={rightButton.disabled}
          className={rightButton.className || "bg-brand-primary hover:bg-brand-primary/80 text-white"}
        >
          {rightButton.text}
          {rightButton.icon}
        </Button>
      </div>
    </div>
  )
}