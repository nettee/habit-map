"use client"

import { Button } from "@/components/ui/button"
import React from "react"

interface StepLayoutProps {
  stepNumber: number
  stepTitle: string
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
  needsScroll = false,
  fixedContent,
  leftButton,
  rightButton,
  children,
}: StepLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* 顶部固定区域：标题 */}
      <div className="flex-shrink-0 text-center mb-4">
        <h1 className="text-xl font-bold text-text-primary mb-2">创建新习惯</h1>
        <p className="text-sm text-text-secondary">第{stepNumber}步：{stepTitle}</p>
      </div>

      {/* 固定内容区域（可选） */}
      {fixedContent && (
        <div className="flex-shrink-0 mb-4">
          {fixedContent}
        </div>
      )}

      {/* 中间区域：内容 */}
      {needsScroll ? (
        <div className="flex-1 relative mb-4 min-h-0">
          {/* 顶部渐变遮罩 */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50/90 via-gray-50/50 to-transparent z-10 pointer-events-none"></div>
          
          {/* 滚动容器 */}
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="pt-2 pb-2">
              {children}
            </div>
          </div>
          
          {/* 底部渐变遮罩 */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50/90 via-gray-50/50 to-transparent z-10 pointer-events-none"></div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 py-4">
          {children}
        </div>
      )}

      {/* 底部固定区域：按钮 */}
      <div className="flex-shrink-0 flex justify-between pt-4 border-t border-surface-divider">
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