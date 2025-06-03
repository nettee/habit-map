"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useHabitWizard } from "@/app/habits/add/HabitWizardContext"

export default function SetHabitInfo() {
  const { habitBasicInfo, updateHabitBasicInfo } = useHabitWizard()

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="habit-title" className="text-text-primary font-medium">
          习惯标题
        </Label>
        <Input
          id="habit-title"
          value={habitBasicInfo.title}
          onChange={(e) => updateHabitBasicInfo({ title: e.target.value })}
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
          value={habitBasicInfo.description}
          onChange={(e) => updateHabitBasicInfo({ description: e.target.value })}
          placeholder="我为什么想养成这个习惯？它对我有什么意义？"
          className="mt-2 border-surface-divider focus:border-brand-primary min-h-32 md:min-h-64 resize-none"
        />
      </div>
    </div>
  )
}