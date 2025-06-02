"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Check, Clock, Link, ArrowUp, ArrowDown, Sparkles, Heart, Target } from "lucide-react"
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
    } else if (currentStep === 3) {
      // 完成创建，进入第4步（完成页面）
      setCurrentStep(4)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = () => {
    // 导航到习惯列表页或今日行动页
    window.location.href = "/habits"
  }

  const toggleCardExpanded = (behaviorId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [behaviorId]: !prev[behaviorId],
    }))
  }

  const getReminderText = (behaviorId: string) => {
    const setting = reminderSettings[behaviorId]
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-[#292F36] mb-2">创建新习惯</h1>
        <p className="text-sm text-[#5A6872]">第1步：定义你的习惯</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="habit-name" className="text-[#292F36] font-medium">
            习惯名称
          </Label>
          <Input
            id="habit-name"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="我想养成的好习惯是..."
            className="mt-2 border-[#D8DEE9] focus:border-[#69B578]"
          />
        </div>

        <div>
          <Label htmlFor="habit-description" className="text-[#292F36] font-medium">
            习惯描述 (可选)
          </Label>
          <Textarea
            id="habit-description"
            value={habitDescription}
            onChange={(e) => setHabitDescription(e.target.value)}
            placeholder="我为什么想养成这个习惯？它对我有什么意义？"
            className="mt-2 border-[#D8DEE9] focus:border-[#69B578] min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" className="text-[#5A6872]" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          取消
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={!habitName.trim()}
          className="bg-[#69B578] hover:bg-[#5a9a68] text-white"
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
        <h1 className="text-xl font-bold text-[#292F36] mb-2">创建新习惯</h1>
        <p className="text-sm text-[#5A6872]">第2步：设计你的微行动</p>
      </div>

      <Card className="border-[#D8DEE9] bg-[#EBF2FA]">
        <CardContent className="p-4">
          <p className="text-sm text-[#5A6872]">习惯：</p>
          <p className="font-medium text-[#292F36]">{habitName}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#69B578] mb-6"></div>
        <h3 className="text-lg font-medium text-[#292F36] mb-2">正在为您推荐微行为...</h3>
        <p className="text-sm text-[#5A6872] text-center leading-relaxed">
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
        <h1 className="text-xl font-bold text-[#292F36] mb-2">创建新习惯</h1>
        <p className="text-sm text-[#5A6872]">第2步：设计你的微行动</p>
      </div>

      <Card className="border-[#D8DEE9] bg-[#EBF2FA]">
        <CardContent className="p-4">
          <p className="text-sm text-[#5A6872]">习惯：</p>
          <p className="font-medium text-[#292F36]">{habitName}</p>
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[#292F36]">推荐的微行为</h3>
          <span className="text-sm text-[#5A6872]">
            已选择 {selectedMicroBehaviors.filter((b) => b.selected).length}/3
          </span>
        </div>
        <p className="text-sm text-[#5A6872] mb-4">选择1-3个简单易行的微行为，让习惯更容易坚持</p>

        <div className="space-y-3">
          {selectedMicroBehaviors.map((behavior) => (
            <Card key={behavior.id} className="border-[#D8DEE9]">
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
                      className="font-medium cursor-pointer text-[#292F36] pointer-events-none"
                    >
                      {behavior.title}
                    </Label>
                    <p className="text-sm text-[#5A6872] mt-1 pointer-events-none">{behavior.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={handlePrevStep} className="text-[#5A6872]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
        <Button onClick={handleNextStep} className="bg-[#69B578] hover:bg-[#5a9a68] text-white">
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
        <h1 className="text-xl font-bold text-[#292F36] mb-2">创建新习惯</h1>
        <p className="text-sm text-[#5A6872]">第3步：设置提醒</p>
      </div>

      <div className="space-y-6">
        {selectedMicroBehaviors
          .filter((behavior) => behavior.selected)
          .map((behavior) => (
            <Card key={behavior.id} className="border-[#D8DEE9]">
              {expandedCards[behavior.id] ? (
                // 展开状态 - 完整编辑界面
                <>
                  <CardHeader
                    className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCardExpanded(behavior.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base text-[#292F36]">{behavior.title}</CardTitle>
                        <p className="text-sm text-[#5A6872]">{behavior.description}</p>
                      </div>
                      <div className="ml-2">
                        <ArrowUp className="w-4 h-4 text-[#5A6872]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-[#292F36] font-medium mb-3 block">选择提醒方式</Label>
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
                          <Card className="border-[#81ACDA] bg-blue-50">
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="anchor" id={`anchor-${behavior.id}`} />
                                <Label htmlFor={`anchor-${behavior.id}`} className="flex-1 cursor-pointer">
                                  <div className="flex items-center">
                                    <Link className="w-4 h-4 mr-2 text-[#81ACDA]" />
                                    <span className="font-medium text-[#292F36]">自然提醒（推荐）</span>
                                  </div>
                                  <p className="text-sm text-[#5A6872] mt-1">与现有习惯关联，更容易记住</p>
                                </Label>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-[#D8DEE9]">
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="timer" id={`timer-${behavior.id}`} />
                                <Label htmlFor={`timer-${behavior.id}`} className="flex-1 cursor-pointer">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-[#5A6872]" />
                                    <span className="font-medium text-[#292F36]">定时提醒</span>
                                  </div>
                                  <p className="text-sm text-[#5A6872] mt-1">设置固定时间提醒</p>
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
                          <Label className="text-[#292F36] font-medium">选择提醒时间</Label>
                          <Select
                            onValueChange={(value) =>
                              setReminderSettings((prev) => ({
                                ...prev,
                                [behavior.id]: { ...prev[behavior.id], time: value },
                              }))
                            }
                            value={reminderSettings[behavior.id]?.time}
                          >
                            <SelectTrigger className="mt-2 border-[#D8DEE9]">
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
                          <Label className="text-[#292F36] font-medium">选择锚点习惯</Label>
                          <Select
                            onValueChange={(value) =>
                              setReminderSettings((prev) => ({
                                ...prev,
                                [behavior.id]: { ...prev[behavior.id], anchor: value },
                              }))
                            }
                            value={reminderSettings[behavior.id]?.anchor}
                          >
                            <SelectTrigger className="mt-2 border-[#D8DEE9]">
                              <SelectValue placeholder="选择一个现有的日常习惯" />
                            </SelectTrigger>
                            <SelectContent>
                              {anchorOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-sm text-[#5A6872]">{option.description}</div>
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
                        <h4 className="font-medium text-[#292F36]">{behavior.title}</h4>
                        <ArrowDown className="w-4 h-4 text-[#5A6872]" />
                      </div>
                      <p className="text-sm text-[#5A6872] mb-2">{behavior.description}</p>
                      <div className="flex items-center">
                        <span className="text-xs text-[#5A6872] mr-2">提醒方式:</span>
                        <span
                          className={`text-xs ${
                            reminderSettings[behavior.id]?.type ? "text-[#69B578]" : "text-[#E5B061]"
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
        <Button variant="ghost" onClick={handlePrevStep} className="text-[#5A6872]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
        <Button onClick={handleNextStep} className="bg-[#E5B061] hover:bg-[#d49d4f] text-white">
          <Check className="w-4 h-4 mr-2" />
          完成创建
        </Button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* 成功标识 */}
      <div className="text-center mb-6">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-[#69B578] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-[#E5B061]" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-[#292F36] mb-1">🎉 太棒了！</h1>
        <p className="text-[#5A6872] mb-1">你的新习惯已经创建成功</p>
        <p className="text-sm text-[#81ACDA] flex items-center justify-center">
          <Heart className="w-4 h-4 mr-1" />
          每一个小行动都是改变的开始
        </p>
      </div>

      {/* 习惯信息和微行为计划合并卡片 */}
      <Card className="border-[#69B578] border-2 mb-6 bg-gradient-to-br from-white to-[#EBF2FA]">
        <CardHeader className="pb-3">
          <div className="flex items-center mb-2">
            <Target className="w-5 h-5 text-[#69B578] mr-2" />
            <CardTitle className="text-lg text-[#292F36]">你的新习惯</CardTitle>
          </div>
          <div>
            <h3 className="font-bold text-[#292F36] text-lg mb-2">{habitName}</h3>
            {habitDescription && <p className="text-[#5A6872] text-sm leading-relaxed mb-4">{habitDescription}</p>}
          </div>

          <div className="flex items-center mt-4 mb-2">
            <Sparkles className="w-5 h-5 mr-2 text-[#E5B061]" />
            <h2 className="text-lg font-bold text-[#292F36]">你的微行动计划</h2>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-2">
          {selectedMicroBehaviors
            .filter((behavior) => behavior.selected)
            .map((behavior, index) => (
              <div key={behavior.id} className="bg-gray-50/80 rounded-lg p-2.5">
                <div className="flex items-start space-x-2.5">
                  <div className="flex-shrink-0 w-4 h-4 bg-[#69B578] rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#292F36] mb-1 text-sm">{behavior.title}</h4>
                    <p className="text-xs text-[#5A6872] mb-1.5">{behavior.description}</p>

                    <div className="flex items-center text-xs">
                      <span className="text-[#5A6872] mr-1.5">📅 提醒方式:</span>
                      <span className="text-[#69B578] font-medium">{getReminderText(behavior.id)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* 鼓励文案 */}
      <Card className="border-[#E5B061] bg-gradient-to-r from-[#E5B061]/10 to-[#69B578]/10 mb-6">
        <CardContent className="p-3 text-center">
          <p className="text-[#292F36] font-medium mb-2 text-sm">✨ 记住福格行为模型的秘诀</p>
          <p className="text-sm text-[#5A6872] leading-relaxed">
            从小事开始，利用现有习惯作为提醒，持续的小行动会带来巨大的改变！
          </p>
        </CardContent>
      </Card>

      {/* 完成按钮 */}
      <Button
        onClick={handleComplete}
        className="w-full bg-[#69B578] hover:bg-[#5a9a68] text-white py-2 text-lg font-medium"
      >
        开始我的习惯之旅 🚀
      </Button>

      {/* 底部提示 */}
      <p className="text-center text-xs text-[#5A6872] mt-4">你可以随时在习惯列表中查看和调整你的微行为</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#EBF2FA] p-4">
      <div className="max-w-md mx-auto">
        {/* 进度指示器 - 只在前3步显示 */}
        {currentStep <= 3 && (
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep ? "bg-[#69B578] text-white" : "bg-[#D8DEE9] text-[#5A6872]"
                    }`}
                  >
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && <div className={`w-8 h-0.5 ${step < currentStep ? "bg-[#69B578]" : "bg-[#D8DEE9]"}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 步骤内容 */}
        {currentStep <= 3 ? (
          <Card className="border-[#D8DEE9] shadow-sm">
            <CardContent className="p-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && isLoadingRecommendations && renderLoadingStep2()}
              {currentStep === 2 && !isLoadingRecommendations && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </CardContent>
          </Card>
        ) : (
          // 第4步不需要卡片包装，直接渲染内容
          renderStep4()
        )}
        <Toaster />
      </div>
    </div>
  )
}