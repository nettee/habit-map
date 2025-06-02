"use client"

import { Toaster } from "@/components/ui/toaster"
import { HabitWizardProvider } from "./HabitWizardContext"

interface AddHabitLayoutProps {
  children: React.ReactNode
}

export default function AddHabitLayout({ children }: AddHabitLayoutProps) {
  return (
    <HabitWizardProvider>
      <div className="min-h-screen bg-surface-main">
        {/* 步骤内容 */}
        <div className="h-[100dvh] flex flex-col">
          {/* 步骤内容区域 - 占用全部空间 */}
          <div className="flex-1 min-h-0">
            {children}
          </div>
        </div>
        <Toaster />
      </div>
    </HabitWizardProvider>
  )
} 