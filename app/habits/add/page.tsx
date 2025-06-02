"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Check, Clock, Link, ArrowUp, ArrowDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface MicroBehavior {
  id: string
  title: string
  description: string
  selected: boolean
}

interface AnchorOption {
  id: string
  label: string
  description: string
}

export default function AddHabitPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [habitName, setHabitName] = useState("")
  const [habitDescription, setHabitDescription] = useState("")
  const [selectedMicroBehaviors, setSelectedMicroBehaviors] = useState<MicroBehavior[]>([])
  const [reminderSettings, setReminderSettings] = useState<{ [key: string]: any }>({})
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
      const initialReminderSettings: { [key: string]: any } = { ...reminderSettings }

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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-2">创建新习惯</h1>
        <p className="text-sm text-text-secondary">第1步：定义你的习惯</p>
      </div>

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
            习惯描述 (可选)
          </Label>
          <Textarea
            id="habit-description"
            value={habitDescription}
            onChange={(e) => setHabitDescription(e.target.value)}
            placeholder="我为什么想养成这个习惯？它对我有什么意义？"
            className="mt-2 border-surface-divider focus:border-brand-primary min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" className="text-text-secondary" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          取消
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={!habitName.trim()}
          className="bg-brand-primary hover:bg-brand-primary/80 text-white"
        >
          下一步
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderLoadingStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-2">创建新习惯</h1>
        <p className="text-sm text-text-secondary">第2步：设计你的微行动</p>
      </div>

      <Card className="border-surface-divider bg-surface-main">
        <CardContent className="p-4">
          <p className="text-sm text-text-secondary">习惯：</p>
          <p className="font-medium text-text-primary">{habitName}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-6"></div>
        <h3 className="text-lg font-medium text-text-primary mb-2">正在为您推荐微行为...</h3>
        <p className="text-sm text-text-secondary text-center leading-relaxed">
          基于您的习惯目标，我们正在分析并推荐
          <br />
          最适合的微行为组合
        </p>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-2">创建新习惯</h1>
        <p className="text-sm text-text-secondary">第2步：设计你的微行动</p>
      </div>

      <Card className="border-surface-divider bg-surface-main">
        <CardContent className="p-4">
          <p className="text-sm text-text-secondary">习惯：</p>
          <p className="font-medium text-text-primary">{habitName}</p>
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-text-primary">推荐的微行为</h3>
          <span className="text-sm text-text-secondary">
            已选择 {selectedMicroBehaviors.filter((b) => b.selected).length}/3
          </span>
        </div>
        <p className="text-sm text-text-secondary mb-4">选择1-3个简单易行的微行为，让习惯更容易坚持</p>

        <div className="space-y-3">
          {selectedMicroBehaviors.map((behavior) => (
            <Card key={behavior.id} className="border-surface-divider">
              <CardContent
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleMicroBehaviorToggle(behavior.id)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={behavior.id}
                    checked={behavior.selected}
                    onCheckedChange={() => handleMicroBehaviorToggle(behavior.id)}
                    className="mt-1 pointer-events-none"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={behavior.id}
                      className="font-medium cursor-pointer text-text-primary pointer-events-none"
                    >
                      {behavior.title}
                    </Label>
                    <p className="text-sm text-text-secondary mt-1 pointer-events-none">{behavior.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={handlePrevStep} className="text-text-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
        <Button onClick={handleNextStep} className="bg-brand-primary hover:bg-brand-primary/80 text-white">
          下一步
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

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

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-2">创建新习惯</h1>
        <p className="text-sm text-text-secondary">第3步：设置提醒</p>
      </div>

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
                        onValueChange={(value) =>
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

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={handlePrevStep} className="text-text-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
        <Button onClick={handleComplete} className="bg-brand-accent hover:bg-brand-accent/80 text-white">
          <Check className="w-4 h-4 mr-2" />
          完成创建
        </Button>
      </div>
    </div>
  )

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
        <Card className="border-surface-divider shadow-sm">
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && isLoadingRecommendations && renderLoadingStep2()}
            {currentStep === 2 && !isLoadingRecommendations && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </div>
  )
}