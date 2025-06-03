"use client"

import { Suspense } from "react"
import SelectBehaviorsContainer from "./SelectBehaviorsContainer"
import SelectBehaviorsErrorBoundary from "./SelectBehaviorsErrorBoundary"
import SelectBehaviorsLoading from "./SelectBehaviorsLoading"

export default function SelectBehaviorsWithSuspense() {
  return (
    <SelectBehaviorsErrorBoundary>
      <Suspense fallback={<SelectBehaviorsLoading />}>
        <SelectBehaviorsContainer />
      </Suspense>
    </SelectBehaviorsErrorBoundary>
  )
}