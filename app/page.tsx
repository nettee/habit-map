'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Heart, ArrowRight, Target, Zap, Link } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/habits/new')
  }

  return (
    <div className="min-h-screen bg-surface-main p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* 欢迎标题 */}
        <div className="text-center mb-6">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-brand-primary rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-brand-accent" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-text-primary mb-1">欢迎来到 Habit MAP</h1>
          <p className="text-text-secondary mb-1">基于福格行为模型的习惯养成助手</p>
          {/* <p className="text-sm text-brand-secondary flex items-center justify-center">
            <Heart className="w-4 h-4 mr-1" />
            让改变变得简单而持久
          </p> */}
        </div>

        {/* 福格行为模型介绍 */}
        <Card className="border-brand-accent bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 mb-6">
          <CardContent className="p-4">
            <h2 className="text-text-primary font-bold mb-3 text-center">✨ 什么是福格行为模型？</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              福格行为模型（Fogg Behavior Model）由斯坦福大学教授 BJ Fogg 提出，核心公式是：
            </p>
            <div className="bg-white/50 rounded-lg p-3 mb-4 text-center">
              <p className="font-bold text-brand-primary">B = MAP</p>
              <p className="text-xs text-text-secondary mt-1">行为 = 动机 × 能力 × 提示</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <Zap className="w-4 h-4 text-brand-primary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">动机 (Motivation)</p>
                  <p className="text-xs text-text-secondary">你想要做这件事的程度</p>
                </div>
              </div>
              <div className="flex items-start">
                <Target className="w-4 h-4 text-brand-primary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">能力 (Ability)</p>
                  <p className="text-xs text-text-secondary">你完成这件事的难易程度</p>
                </div>
              </div>
              <div className="flex items-start">
                <Link className="w-4 h-4 text-brand-primary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">提示 (Prompt)</p>
                  <p className="text-xs text-text-secondary">提醒你采取行动的触发器</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 核心理念 */}
        {/* <Card className="border-brand-secondary bg-gradient-to-r from-brand-secondary/10 to-brand-accent/10 mb-6">
          <CardContent className="p-4 text-center">
            <h3 className="text-text-primary font-bold mb-2 text-sm">🌱 核心理念</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              从微小的行为开始，让改变变得容易。当动机不足时，降低难度；当能力有限时，增强动机；无论何时，都要设置清晰的提示。
            </p>
          </CardContent>
        </Card> */}

        {/* 开始按钮 */}
        <Button
          onClick={handleGetStarted}
          className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white py-3 text-lg font-medium mb-4"
        >
          开始设计我的习惯
          {/* <ArrowRight className="w-5 h-5 ml-2" /> */}
        </Button>

        {/* 底部提示 */}
        <p className="text-center text-xs text-text-secondary">
          通过科学的方法，让好习惯自然而然地融入你的生活
        </p>
      </div>
    </div>
  )
}
