"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Heart, Target } from "lucide-react"

interface MicroBehavior {
  id: string
  title: string
  description: string
  selected: boolean
}

interface HabitData {
  habitName: string
  habitDescription: string
  selectedMicroBehaviors: MicroBehavior[]
  reminderSettings: { [key: string]: any }
}

export default function CompleteAddPage() {
  const [habitData, setHabitData] = useState<HabitData | null>(null)

  const anchorOptions = [
    { id: "morning-brush", label: "早上刷牙后", description: "利用晨间例行公事" },
    { id: "coffee", label: "喝咖啡/茶时", description: "与日常饮品习惯结合" },
    { id: "lunch-break", label: "午休时间", description: "利用工作间隙" },
    { id: "before-sleep", label: "睡前", description: "作为放松活动" },
    { id: "commute", label: "通勤路上", description: "利用交通时间" },
  ]

  useEffect(() => {
    // 从 localStorage 获取数据
    const storedData = localStorage.getItem("newHabitData")
    if (storedData) {
      setHabitData(JSON.parse(storedData))
    }
  }, [])

  const getReminderText = (behaviorId: string) => {
    if (!habitData) return ""

    const setting = habitData.reminderSettings[behaviorId]
    if (!setting || !setting.type) {
      return "未设置提醒"
    }

    if (setting.type === "anchor") {
      if (setting.anchor) {
        const anchorOption = anchorOptions.find((option) => option.id === setting.anchor)
        return `${anchorOption?.label || "未知锚点"}`
      }
      return "自然提醒（未选择锚点）"
    } else if (setting.type === "timer") {
      if (setting.time) {
        return `每天 ${setting.time}`
      }
      return "定时提醒（未选择时间）"
    }

    return "未设置提醒"
  }

  const handleComplete = () => {
    // 清除临时数据
    localStorage.removeItem("newHabitData")
    // 导航到习惯列表页或今日行动页
    window.location.href = "/habits"
  }

  if (!habitData) {
    return (
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
          <p className="text-text-secondary mt-4">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-main p-4">
      <div className="max-w-md mx-auto">
        {/* 成功标识 */}
        <div className="text-center mb-6">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-brand-primary rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-brand-accent" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-text-primary mb-1">🎉 太棒了！</h1>
          <p className="text-text-secondary mb-1">你的新习惯已经创建成功</p>
          <p className="text-sm text-brand-secondary flex items-center justify-center">
            <Heart className="w-4 h-4 mr-1" />
            每一个小行动都是改变的开始
          </p>
        </div>

        {/* 习惯信息和微行为计划合并卡片 */}
        <Card className="border-brand-primary border-2 mb-6 bg-gradient-to-br from-white to-surface-main">
          <CardHeader className="pb-3">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-brand-primary mr-2" />
              <CardTitle className="text-lg text-text-primary">你的新习惯</CardTitle>
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-lg mb-2">{habitData.habitName}</h3>
              {habitData.habitDescription && (
                <p className="text-text-secondary text-sm leading-relaxed mb-4">{habitData.habitDescription}</p>
              )}
            </div>

            <div className="flex items-center mt-4 mb-2">
              <Sparkles className="w-5 h-5 mr-2 text-brand-accent" />
              <h2 className="text-lg font-bold text-text-primary">你的微行为计划</h2>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-2">
            {habitData.selectedMicroBehaviors.map((behavior, index) => (
              <div key={behavior.id} className="bg-gray-50/80 rounded-lg p-2.5">
                <div className="flex items-start space-x-2.5">
                  <div className="flex-shrink-0 w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1 text-sm">{behavior.title}</h4>
                    <p className="text-xs text-text-secondary mb-1.5">{behavior.description}</p>

                    <div className="flex items-center text-xs">
                      <span className="text-text-secondary mr-1.5">📅 提醒方式:</span>
                      <span className="text-brand-primary font-medium">{getReminderText(behavior.id)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 鼓励文案 */}
        <Card className="border-brand-accent bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 mb-6">
          <CardContent className="p-3 text-center">
            <p className="text-text-primary font-medium mb-2 text-sm">✨ 记住福格行为模型的秘诀</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              从小事开始，利用现有习惯作为提醒，持续的小行动会带来巨大的改变！
            </p>
          </CardContent>
        </Card>

        {/* 完成按钮 */}
        <Button
          onClick={handleComplete}
          className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white py-2 text-lg font-medium"
        >
          开始我的习惯之旅 🚀
        </Button>

        {/* 底部提示 */}
        <p className="text-center text-xs text-text-secondary mt-4">你可以随时在习惯列表中查看和调整你的微行为</p>
      </div>
    </div>
  )
}