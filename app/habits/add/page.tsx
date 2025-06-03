"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * 习惯添加向导的根页面
 * 
 * 功能：作为 /habits/add 路由的入口点，自动重定向到第一步
 * 
 * 设计原因：
 * 1. 提供统一的入口点，用户访问 /habits/add 时有明确的行为
 * 2. 避免用户直接访问根路径时看到空白页面
 * 3. 在重定向期间显示友好的加载提示
 */
export default function AddHabitPage() {
  const router = useRouter()

  useEffect(() => {
    // 自动重定向到第一步
    // 这确保了用户总是从第一步开始习惯创建流程
    router.push('/habits/add/step1')
  }, [router])

  // 在重定向期间显示加载界面
  // 提供用户友好的视觉反馈，避免白屏
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p className="text-text-secondary">正在跳转...</p>
      </div>
    </div>
  )
}