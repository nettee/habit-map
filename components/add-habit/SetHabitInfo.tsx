"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"
import StepLayout from "./StepLayout"

interface SetHabitInfoProps {
  habitName: string
  setHabitName: (name: string) => void
  habitDescription: string
  setHabitDescription: (description: string) => void
  onNext: () => void
  onCancel: () => void
}

export default function SetHabitInfo({
  habitName,
  setHabitName,
  habitDescription,
  setHabitDescription,
  onNext,
  onCancel,
}: SetHabitInfoProps) {
  return (
    <StepLayout
      stepNumber={1}
      stepTitle="定义你的习惯"
      needsScroll={false}
      leftButton={{
        text: "取消",
        icon: <ArrowLeft className="w-4 h-4 mr-2" />,
        onClick: onCancel,
      }}
      rightButton={{
        text: "下一步",
        icon: <ArrowRight className="w-4 h-4 ml-2" />,
        onClick: onNext,
        disabled: !habitName.trim(),
      }}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="habit-name" className="text-text-primary font-medium">
            习惯名称
          </Label>
          <Input
            id="habit-name"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="我想养成的好习惯是..."
            className="mt-2 border-surface-divider focus:border-brand-primary"
          />
        </div>

        <div>
          <Label htmlFor="habit-description" className="text-text-primary font-medium">
            习惯说明 (可选)
          </Label>
          <Textarea
            id="habit-description"
            value={habitDescription}
            onChange={(e) => setHabitDescription(e.target.value)}
            placeholder="我为什么想养成这个习惯？它对我有什么意义？"
            className="mt-2 border-surface-divider focus:border-brand-primary min-h-32 md:min-h-64 resize-none"
          />
        </div>
      </div>
    </StepLayout>
  )
}