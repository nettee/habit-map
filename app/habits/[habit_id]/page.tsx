import { ArrowLeft, Target, CheckCircle2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// 模拟单个习惯的数据
const habitData = {
  id: "1",
  name: "每天阅读",
  microBehaviors: [
    {
      action: "打开书本到书签页",
      anchor: "喝完晨间咖啡后",
    },
    {
      action: "只读一个段落",
      anchor: "打开书本后",
    },
    {
      action: "合上书本并放回床头柜",
      anchor: "读完段落后",
    },
  ],
  // 最近7天的触发情况 (true表示完成，false表示未完成)
  recentTriggers: [
    { date: "12-30", triggerCount: 3 },
    { date: "12-29", triggerCount: 0 },
    { date: "12-28", triggerCount: 1 },
    { date: "12-27", triggerCount: 2 },
    { date: "12-26", triggerCount: 0 },
    { date: "12-25", triggerCount: 1 },
    { date: "12-24", triggerCount: 2 },
  ],
}

export default function HabitDetailPage() {
  return (
    <div className="bg-main-background min-h-screen text-primary-text">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/habits">
              <ArrowLeft className="h-5 w-5 text-secondary-text" />
              <span className="sr-only">返回习惯列表</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">习惯详情</h1>
        </header>

        <main className="space-y-6">
          {/* 习惯信息卡片 */}
          <Card className="bg-white border-divider shadow-sm">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="bg-primary-green/10 p-3 rounded-full">
                <Target className="h-6 w-6 text-primary-green" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-primary-text">{habitData.name}</CardTitle>
              </div>
            </CardHeader>
          </Card>

          {/* 微行为卡片 */}
          <Card className="bg-white border-divider shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary-text">微行为</CardTitle>
              <CardDescription className="text-secondary-text">
                这些是让你的习惯变得容易执行的微小步骤。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-6">
                {habitData.microBehaviors.map((behavior, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-green mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-secondary-text block">{behavior.action}</span>
                      <span className="text-sm text-secondary-text/70 mt-1 block">
                        <span className="font-medium">锚点：</span>
                        {behavior.anchor}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 最近7天习惯触发情况 */}
          <Card className="bg-white border-divider shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary-text">最近7天触发情况</CardTitle>
              <CardDescription className="text-secondary-text">查看你最近一周的习惯完成情况。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {habitData.recentTriggers.map((trigger, index) => {
                  const getBgColor = (count) => {
                    if (count === 0) return "bg-gray-200 text-secondary-text"
                    if (count === 1) return "bg-[#A8D5B2] text-white" // 浅绿
                    if (count === 2) return "bg-[#69B578] text-white" // 中绿 (主绿色)
                    if (count >= 3) return "bg-[#4A8A57] text-white" // 深绿
                    return "bg-gray-200 text-secondary-text"
                  }

                  return (
                    <div key={index} className="text-center">
                      <div className="text-xs text-secondary-text mb-2">{trigger.date}</div>
                      <div
                        className={`w-8 h-5 rounded-md mx-auto flex items-center justify-center text-xs font-medium ${getBgColor(trigger.triggerCount)}`}
                      >
                        {trigger.triggerCount > 0 ? trigger.triggerCount : ""}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-secondary-text">
                  完成天数：{habitData.recentTriggers.filter((t) => t.triggerCount > 0).length}/7 天
                </span>
                <span className="text-secondary-text">
                  总触发次数：{habitData.recentTriggers.reduce((sum, t) => sum + t.triggerCount, 0)} 次
                </span>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
