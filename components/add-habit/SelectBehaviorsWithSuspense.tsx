"use client"

import { Suspense } from "react"
import SelectBehaviorsContainer from "./SelectBehaviorsContainer"
import SelectBehaviorsStreamContainer from "./SelectBehaviorsStreamContainer"
import SelectBehaviorsErrorBoundary from "./SelectBehaviorsErrorBoundary"
import SelectBehaviorsLoading from "./SelectBehaviorsLoading"

// 可以通过环境变量或feature flag控制使用哪种方式
const USE_STREAM_API = process.env.NEXT_PUBLIC_USE_STREAM_API === 'true' || true // 默认使用流式API

export default function SelectBehaviorsWithSuspense() {
  if (USE_STREAM_API) {
    // 使用新的流式API，无需Suspense
    return <SelectBehaviorsStreamContainer />
  }
  
  // 使用原有的Suspense方式
  return (
    <SelectBehaviorsErrorBoundary>
      <Suspense fallback={<SelectBehaviorsLoading />}>
        <SelectBehaviorsContainer />
      </Suspense>
    </SelectBehaviorsErrorBoundary>
  )
}