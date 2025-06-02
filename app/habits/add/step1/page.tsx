"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SetHabitInfo from "@/components/add-habit/SetHabitInfo"
import { useHabitWizard } from "../HabitWizardContext"

export default function Step1Page() {
  const router = useRouter()
  const { setStep } = useHabitWizard()

  // 设置当前步骤为1
  useEffect(() => {
    setStep(1)
  }, [setStep])

  const handleCancel = () => {
    window.history.back()
  }

  return <SetHabitInfo onCancel={handleCancel} />
} 