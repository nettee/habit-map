import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import HabitDetail from "./HabitDetail"

export default async function CompletePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams
  const habitId = params.id

  // 如果没有 habitId，显示错误状态
  if (!habitId) {
    return (
      <div className="min-h-screen bg-surface-main p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-text-primary mb-4">出错了</h1>
          <p className="text-text-secondary">找不到习惯ID，请检查URL是否正确</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-main overflow-y-auto">
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-md w-full py-8">
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
          <p className="text-text-secondary mb-1">你的新习惯已经设计成功</p>
          <p className="text-sm text-brand-secondary flex items-center justify-center">
            <Heart className="w-4 h-4 mr-1" />
            每一个小行动都是改变的开始
          </p>
        </div>

        {/* 动态的习惯信息和微行为计划卡片 */}
        <HabitDetail habitId={habitId} />

        {/* 鼓励文案 */}
        <Card className="border-brand-accent bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 mb-6">
          <CardContent className="p-3 text-center">
            <p className="text-text-primary font-medium mb-2 text-sm">✨ 记住福格行为模型的秘诀</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              从小事开始，利用现有习惯作为提醒，持续的小行动会带来巨大的改变！
            </p>
          </CardContent>
        </Card>

        {/* 返回主页（临时） */}
        <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white py-2 text-lg font-medium">
          <Link href="/">
            返回主页
          </Link>
        </Button>

        {/* 完成按钮 */}
        {/* <Button
          // onClick={handleComplete}
          className="w-full bg-brand-primary hover:bg-brand-primary/80 text-white py-2 text-lg font-medium"
        >
          开始我的习惯之旅 🚀
        </Button> */}

        {/* 底部提示 */}
        {/* <p className="text-center text-xs text-text-secondary mt-4">你可以随时在习惯列表中查看和调整你的微行为</p> */}
        </div>
      </div>
    </div>
  )
}