"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import SetHabitInfo from "@/components/add-habit/SetHabitInfo"
import SelectBehaviors from "@/components/add-habit/SelectBehaviors"
import SetBehaviorReminders from "@/components/add-habit/SetBehaviorReminders"
import { MicroBehavior, AnchorOption, ReminderSettings } from "@/components/add-habit/types"

export default function AddHabitPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [habitName, setHabitName] = useState("")
  const [habitDescription, setHabitDescription] = useState("")
  const [selectedMicroBehaviors, setSelectedMicroBehaviors] = useState<MicroBehavior[]>([])
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({})
  const { toast } = useToast()
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({})
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  // 模拟推荐的微行为
  const recommendedMicroBehaviors: MicroBehavior[] = [
    {
      id: "1",
      title: "打开书本",
      description: "每天只需要打开一本书，翻到任意一页",
      selected: false,
    },
    {
      id: "2",
      title: "阅读一段话",
      description: "读完一个段落就算完成",
      selected: false,
    },
    {
      id: "3",
      title: "阅读2分钟",
      description: "设置计时器，专注阅读2分钟",
      selected: false,
    },
    {
      id: "4",
      title: "准备阅读环境",
      description: "找一个安静的地方，准备好书本和水杯",
      selected: false,
    },
    {
      id: "5",
      title: "记录一个想法",
      description: "阅读后写下一句话的感受或想法",
      selected: false,
    },
    {
      id: "6",
      title: "朗读一句话",
      description: "大声朗读书中的任意一句话",
      selected: false,
    },
    {
      id: "7",
      title: "标记一个重点",
      description: "用笔或便签标记一个有趣的内容",
      selected: false,
    },
    {
      id: "8",
      title: "翻阅目录",
      description: "浏览书本目录，选择感兴趣的章节",
      selected: false,
    },
    {
      id: "9",
      title: "设置阅读提醒",
      description: "在手机上设置明天的阅读提醒",
      selected: false,
    },
    {
      id: "10",
      title: "分享阅读计划",
      description: "告诉朋友或家人你今天的阅读计划",
      selected: false,
    },
  ]

  const anchorOptions: AnchorOption[] = [
    { id: "morning-brush", label: "早上刷牙后", description: "利用晨间例行公事" },
    { id: "coffee", label: "喝咖啡/茶时", description: "与日常饮品习惯结合" },
    { id: "lunch-break", label: "午休时间", description: "利用工作间隙" },
    { id: "before-sleep", label: "睡前", description: "作为放松活动" },
    { id: "commute", label: "通勤路上", description: "利用交通时间" },
  ]

  const handleMicroBehaviorToggle = (behaviorId: string) => {
    const selectedCount = selectedMicroBehaviors.filter((b) => b.selected).length
    const behavior = selectedMicroBehaviors.find((b) => b.id === behaviorId)

    // 如果要选择第4个，显示toast提示
    if (!behavior?.selected && selectedCount >= 3) {
      toast({
        title: "选择数量已达上限",
        description: "最多只能选择3个微行为，请先取消其他选择。",
        variant: "destructive",
      })
      return
    }

    setSelectedMicroBehaviors((prev) =>
      prev.map((behavior) => (behavior.id === behaviorId ? { ...behavior, selected: !behavior.selected } : behavior)),
    )
  }

  const initializeMicroBehaviors = () => {
    if (selectedMicroBehaviors.length === 0) {
      setSelectedMicroBehaviors(recommendedMicroBehaviors)
      // 初始化所有选中的微行为卡片为展开状态
      const initialExpandedState: { [key: string]: boolean } = {}
      recommendedMicroBehaviors.forEach((behavior) => {
        if (behavior.selected) {
          initialExpandedState[behavior.id] = true
        }
      })
      setExpandedCards(initialExpandedState)
    }
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      setIsLoadingRecommendations(true)
      setCurrentStep(2)
      // 模拟系统推荐微行为的等待时间
      await new Promise((resolve) => setTimeout(resolve, 2000))
      initializeMicroBehaviors()
      setIsLoadingRecommendations(false)
    } else if (currentStep === 2) {
      const selectedCount = selectedMicroBehaviors.filter((b) => b.selected).length
      if (selectedCount === 0) {
        toast({
          title: "请选择微行为",
          description: "至少需要选择1个微行为才能继续。",
          variant: "destructive",
        })
        return
      }
      // 为选中的微行为初始化展开状态和默认提醒设置
      const initialExpandedState: { [key: string]: boolean } = {}
      const initialReminderSettings: ReminderSettings = { ...reminderSettings }

      selectedMicroBehaviors
        .filter((b) => b.selected)
        .forEach((behavior) => {
          initialExpandedState[behavior.id] = true
          // 如果该微行为还没有提醒设置，初始化为默认的自然提醒
          if (!initialReminderSettings[behavior.id]) {
            initialReminderSettings[behavior.id] = { type: "anchor" }
          }
        })

      setExpandedCards(initialExpandedState)
      setReminderSettings(initialReminderSettings)
      setCurrentStep(3)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = () => {
    // 这里处理完成创建的逻辑
    const habitData = {
      habitName,
      habitDescription,
      selectedMicroBehaviors: selectedMicroBehaviors.filter((b) => b.selected),
      reminderSettings,
    }

    console.log("创建习惯:", habitData)

    // 将数据存储到 localStorage 或通过其他方式传递给下一个页面
    localStorage.setItem("newHabitData", JSON.stringify(habitData))

    // 导航到完成页面
    window.location.href = "/habits/completeAdd"
  }

  const toggleCardExpanded = (behaviorId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [behaviorId]: !prev[behaviorId],
    }))
  }

  return (
    <div className="min-h-screen bg-surface-main p-4">
      <div className="max-w-md mx-auto">
        {/* 进度指示器 */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-brand-primary text-white" : "bg-surface-divider text-text-secondary"
                  }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && <div className={`w-8 h-0.5 ${step < currentStep ? "bg-brand-primary" : "bg-surface-divider"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* 步骤内容 */}
        <Card className="border-surface-divider shadow-sm h-[calc(100vh-8rem)]">
          <CardContent className="p-6 h-full">
            {currentStep === 1 && (
              <SetHabitInfo
                habitName={habitName}
                setHabitName={setHabitName}
                habitDescription={habitDescription}
                setHabitDescription={setHabitDescription}
                onNext={handleNextStep}
                onCancel={() => window.history.back()}
              />
            )}
            {currentStep === 2 && (
              <SelectBehaviors
                habitName={habitName}
                selectedMicroBehaviors={selectedMicroBehaviors}
                isLoadingRecommendations={isLoadingRecommendations}
                onToggleBehavior={handleMicroBehaviorToggle}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}
            {currentStep === 3 && (
              <SetBehaviorReminders
                selectedMicroBehaviors={selectedMicroBehaviors}
                reminderSettings={reminderSettings}
                setReminderSettings={setReminderSettings}
                anchorOptions={anchorOptions}
                expandedCards={expandedCards}
                onToggleCardExpanded={toggleCardExpanded}
                onComplete={handleComplete}
                onPrev={handlePrevStep}
              />
            )}
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </div>
  )
}