"use client"

import { useEffect } from "react"
import SetHabitInfo from "@/components/add-habit/SetHabitInfo"
import { useHabitWizard } from "../HabitWizardContext"

export default function Step1Page() {
  const { setStep } = useHabitWizard()

  // 设置当前步骤为1
  useEffect(() => {
    setStep(1)
  }, [setStep])

  return (
    <SetHabitInfo />
  )
}