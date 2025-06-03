"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ArrowDown, Clock, Link } from "lucide-react"
import { AnchorOption } from "./types"
import { useHabitWizard } from "@/app/habits/add/HabitWizardContext"

export default function SetBehaviorReminders() {
  const {
    selectedMicroBehaviors,
    reminderSettings,
    setReminderSettings,
    expandedCards,
    toggleCardExpanded,
  } = useHabitWizard()

  // 静态的锚点选项数据
  const anchorOptions: AnchorOption[] = [
    { id: "morning-brush", label: "早上刷牙后", description: "利用晨间例行公事" },
    { id: "coffee", label: "喝咖啡/茶时", description: "与日常饮品习惯结合" },
    { id: "lunch-break", label: "午休时间", description: "利用工作间隙" },
    { id: "before-sleep", label: "睡前", description: "作为放松活动" },
    { id: "commute", label: "通勤路上", description: "利用交通时间" },
  ]

  const getReminderDisplayText = (behaviorId: string) => {
    const setting = reminderSettings[behaviorId]
    if (!setting || !setting.type) {
      return "需要设置提醒方式"
    }

    if (setting.type === "anchor") {
      if (setting.anchor) {
        const anchorOption = anchorOptions.find((option) => option.id === setting.anchor)
        return `自然提醒：${anchorOption?.label || "未选择锚点"}`
      }
      return "自然提醒（未选择锚点）"
    } else if (setting.type === "timer") {
      if (setting.time) {
        return `定时提醒：${setting.time}`
      }
      return "定时提醒（未选择时间）"
    }

    return "需要设置提醒方式"
  }

  return (
    <div className="space-y-6">
      {selectedMicroBehaviors
        .filter((behavior) => behavior.selected)
        .map((behavior) => (
          <Card key={behavior.id} className="border-surface-divider">
            {expandedCards[behavior.id] ? (
              // 展开状态 - 完整编辑界面
              <>
                <CardHeader
                  className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCardExpanded(behavior.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-text-primary">{behavior.title}</CardTitle>
                      <p className="text-sm text-text-secondary">{behavior.description}</p>
                    </div>
                    <div className="ml-2">
                      <ArrowUp className="w-4 h-4 text-text-secondary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-text-primary font-medium mb-3 block">选择提醒方式</Label>
                    <RadioGroup
                      value={reminderSettings[behavior.id]?.type || "anchor"}
                      onValueChange={(value: "anchor" | "timer") =>
                        setReminderSettings((prev) => ({
                          ...prev,
                          [behavior.id]: { ...prev[behavior.id], type: value },
                        }))
                      }
                    >
                      <div className="space-y-3">
                        <Card className="border-brand-secondary bg-blue-50">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="anchor" id={`anchor-${behavior.id}`} />
                              <Label htmlFor={`anchor-${behavior.id}`} className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <Link className="w-4 h-4 mr-2 text-brand-secondary" />
                                  <span className="font-medium text-text-primary">自然提醒（推荐）</span>
                                </div>
                                <p className="text-sm text-text-secondary mt-1">与现有习惯关联，更容易记住</p>
                              </Label>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-surface-divider">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="timer" id={`timer-${behavior.id}`} />
                              <Label htmlFor={`timer-${behavior.id}`} className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2 text-text-secondary" />
                                  <span className="font-medium text-text-primary">定时提醒</span>
                                </div>
                                <p className="text-sm text-text-secondary mt-1">设置固定时间提醒</p>
                              </Label>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    {reminderSettings[behavior.id]?.type === "timer" ? (
                      <>
                        <Label className="text-text-primary font-medium">选择提醒时间</Label>
                        <Select
                          onValueChange={(value) =>
                            setReminderSettings((prev) => ({
                              ...prev,
                              [behavior.id]: { ...prev[behavior.id], time: value },
                            }))
                          }
                          value={reminderSettings[behavior.id]?.time}
                        >
                          <SelectTrigger className="mt-2 border-surface-divider">
                            <SelectValue placeholder="选择每天的提醒时间" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="06:00">早上 6:00</SelectItem>
                            <SelectItem value="07:00">早上 7:00</SelectItem>
                            <SelectItem value="08:00">早上 8:00</SelectItem>
                            <SelectItem value="09:00">早上 9:00</SelectItem>
                            <SelectItem value="12:00">中午 12:00</SelectItem>
                            <SelectItem value="18:00">下午 6:00</SelectItem>
                            <SelectItem value="19:00">下午 7:00</SelectItem>
                            <SelectItem value="20:00">下午 8:00</SelectItem>
                            <SelectItem value="21:00">下午 9:00</SelectItem>
                            <SelectItem value="22:00">下午 10:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <>
                        <Label className="text-text-primary font-medium">选择锚点习惯</Label>
                        <Select
                          onValueChange={(value) =>
                            setReminderSettings((prev) => ({
                              ...prev,
                              [behavior.id]: { ...prev[behavior.id], anchor: value },
                            }))
                          }
                          value={reminderSettings[behavior.id]?.anchor}
                        >
                          <SelectTrigger className="mt-2 border-surface-divider">
                            <SelectValue placeholder="选择一个现有的日常习惯" />
                          </SelectTrigger>
                          <SelectContent>
                            {anchorOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-sm text-text-secondary">{option.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              // 收起状态 - 简略只读信息
              <CardContent
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCardExpanded(behavior.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-text-primary">{behavior.title}</h4>
                      <ArrowDown className="w-4 h-4 text-text-secondary" />
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{behavior.description}</p>
                    <div className="flex items-center">
                      <span className="text-xs text-text-secondary mr-2">提醒方式:</span>
                      <span
                        className={`text-xs ${
                          reminderSettings[behavior.id]?.type ? "text-brand-primary" : "text-brand-accent"
                        }`}
                      >
                        {getReminderDisplayText(behavior.id)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
    </div>
  )
}