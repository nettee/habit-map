"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AddHabitPage() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到第一步
    router.push('/habits/add/step1')
  }, [router])

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p className="text-text-secondary">正在跳转...</p>
      </div>
    </div>
  )
}