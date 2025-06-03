"use client"

import { Button } from "@/components/ui/button"
import ProgressIndicator from "@/components/add-habit/ProgressIndicator"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { HabitWizardProvider, useHabitWizard } from "./HabitWizardContext"
import { StepLayoutProvider, useStepLayout } from "./StepLayoutContext"

/**
 * 习惯添加向导的主布局组件
 * 
 * 架构设计：
 * - 采用双层Context Provider模式，实现业务逻辑与UI逻辑分离
 * - HabitWizardProvider：管理业务数据和流程（外层）
 * - StepLayoutProvider：管理布局状态和UI配置（内层）
 * 
 * 布局特点：
 * - 全屏高度布局，固定顶部和底部，中间内容可滚动
 * - 响应式设计，适配移动端和桌面端
 * - 统一的进度指示器和导航按钮
 */
interface AddHabitLayoutProps {
  children: React.ReactNode
}

/**
 * 布局内容组件
 * 
 * 职责：
 * 1. 消费两个Context的状态，渲染统一的布局结构
 * 2. 处理导航按钮的点击逻辑
 * 3. 管理布局的各个区域（顶部、中间、底部）
 */
function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // 从业务Context获取核心操作方法
  const { complete } = useHabitWizard()
  // 从布局Context获取UI配置信息
  const { currentStepConfig, leftButton, rightButton, fixedContent } = useStepLayout()
  
  /**
   * 左侧按钮点击处理
   * 根据当前步骤决定不同的行为：
   * - 第1步：取消操作，返回上一页面
   * - 第2-3步：返回到上一步骤
   */
  const handleLeftButtonClick = () => {
    if (currentStepConfig.number === 1) {
      // 第一步：取消，返回上一页
      window.history.back()
    } else {
      // 其他步骤：返回上一步
      router.push(`/habits/add/step${currentStepConfig.number - 1}`)
    }
  }
  
  /**
   * 右侧按钮点击处理
   * 根据当前步骤决定不同的行为：
   * - 第1-2步：前进到下一步骤
   * - 第3步：完成整个向导流程
   */
  const handleRightButtonClick = () => {
    if (currentStepConfig.number === 3) {
      // 第三步：完成创建习惯
      complete()
    } else {
      // 其他步骤：进入下一步
      router.push(`/habits/add/step${currentStepConfig.number + 1}`)
    }
  }
  
  return (
    <div className="min-h-screen bg-surface-main">
      {/* 使用100dvh确保在移动端也能正确占满视口高度 */}
      <div className="h-[100dvh] flex flex-col">
        <div className="flex-1 min-h-0 flex flex-col">
          
          {/* 区域1：顶部固定区域 - 进度指示器和标题 */}
          <div className="flex-shrink-0 p-4 pb-0">
            {/* 进度指示器：显示当前步骤进度 */}
            <div className="mb-4">
              <ProgressIndicator currentStep={currentStepConfig.number} totalSteps={3} />
            </div>

            {/* 步骤信息和标题：动态显示当前步骤的信息 */}
            <div className="text-center mb-6">
              <p className="text-xs text-text-secondary mb-2">
                第 {currentStepConfig.number} 步，共 3 步 · 设计新习惯
              </p>
              <h1 className="text-2xl font-bold text-text-primary">
                {currentStepConfig.title}
              </h1>
            </div>
          </div>

          {/* 区域2：固定内容区域（可选）*/}
          {/* 某些步骤可能需要在滚动内容之前显示固定的UI元素 */}
          {fixedContent && (
            <div className="flex-shrink-0 p-4 pb-0">
              {fixedContent}
            </div>
          )}

          {/* 区域3：中间内容区域 - 根据步骤配置决定是否可滚动 */}
          {currentStepConfig.needsScroll ? (
            // 可滚动模式：适用于内容较多的步骤（如第2、3步）
            <div className="flex-1 relative min-h-0 p-4 pb-0">
              {/* 滚动容器：隐藏滚动条，提供更好的视觉体验 */}
              <div className="h-full overflow-y-auto scrollbar-hide">
                <div className="pt-2 pb-2">
                  {children}
                </div>
              </div>
            </div>
          ) : (
            // 固定高度模式：适用于内容较少的步骤（如第1步）
            <div className="flex-1 min-h-0 p-4 pb-0 overflow-y-auto">
              {children}
            </div>
          )}

          {/* 区域4：底部固定区域 - 导航按钮 */}
          <div className="flex-shrink-0 flex justify-between p-4 border-t border-surface-divider">
            {/* 左侧按钮：取消或返回上一步 */}
            <Button
              variant="ghost"
              onClick={handleLeftButtonClick}
              className="text-text-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {leftButton.text}
            </Button>
            
            {/* 右侧按钮：下一步或完成 */}
            <Button
              onClick={handleRightButtonClick}
              disabled={rightButton.disabled}
              className="bg-brand-primary hover:bg-brand-primary/80 text-white"
            >
              {rightButton.text}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* 全局Toast通知组件 */}
      <Toaster />
    </div>
  )
}

/**
 * 主布局组件导出
 * 
 * Context嵌套层级：
 * HabitWizardProvider (外层) -> StepLayoutProvider (内层) -> LayoutContent
 * 
 * 这种嵌套的原因：
 * 1. HabitWizardProvider 提供业务数据，必须在最外层
 * 2. StepLayoutProvider 依赖业务数据来计算UI状态，必须在内层
 * 3. LayoutContent 消费两个Context，渲染最终的布局
 */
export default function AddHabitLayout({ children }: AddHabitLayoutProps) {
  return (
    <HabitWizardProvider>
      <StepLayoutProvider>
        <LayoutContent>
          {children}
        </LayoutContent>
      </StepLayoutProvider>
    </HabitWizardProvider>
  )
}