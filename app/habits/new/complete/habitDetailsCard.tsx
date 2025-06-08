"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Sparkles } from "lucide-react"
import { getHabit, HabitWithId } from "@/lib/habit"
import { useEffect, useState } from "react"

interface HabitDetailsCardProps {
  habitId: string
}

export default function HabitDetailsCard({ habitId }: HabitDetailsCardProps) {
  const [habitData, setHabitData] = useState<HabitWithId | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHabit() {
      try {
        const data = await getHabit(habitId)
        setHabitData(data || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取习惯数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchHabit()
  }, [habitId])

  if (loading) {
    return (
      <Card className="border-brand-primary border-2 mb-6 bg-gradient-to-br from-white to-surface-main">
        <CardContent className="p-6 text-center">
          <div className="text-text-secondary">加载中...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-brand-primary border-2 mb-6 bg-gradient-to-br from-white to-surface-main">
        <CardContent className="p-6 text-center">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!habitData) {
    return (
      <Card className="border-brand-primary border-2 mb-6 bg-gradient-to-br from-white to-surface-main">
        <CardContent className="p-6 text-center">
          <div className="text-text-secondary">未找到习惯数据</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-brand-primary border-2 mb-6 bg-gradient-to-br from-white to-surface-main">
      <CardHeader className="pb-3">
        <div className="flex items-center mb-2">
          <Target className="w-5 h-5 text-brand-primary mr-2" />
          <CardTitle className="text-lg text-text-primary">你的新习惯</CardTitle>
        </div>
        <div>
          <h3 className="font-bold text-text-primary text-lg mb-2">{habitData.title}</h3>
          {habitData.description && (
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{habitData.description}</p>
          )}
        </div>

        <div className="flex items-center mt-4 mb-2">
          <Sparkles className="w-5 h-5 mr-2 text-brand-accent" />
          <h2 className="text-lg font-bold text-text-primary">你的微行为计划</h2>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {habitData.behaviors.map((behavior, index) => (
          <div key={behavior.title} className="bg-gray-50/80 rounded-lg p-2.5">
            <div className="flex items-start space-x-2.5">
              <div className="flex-shrink-0 w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-text-primary mb-1 text-sm">{behavior.title}</h4>
                <p className="text-xs text-text-secondary mb-1.5">{behavior.description}</p>

                <div className="flex items-center text-xs">
                  <span className="text-text-secondary mr-1.5">📅 提醒方式:</span>
                  <span className="text-brand-primary font-medium">{behavior.reminder?.anchor}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 