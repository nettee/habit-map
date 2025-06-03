"use client"

import { Component, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"
import { clearBehaviorSuggestionsCache } from "@/lib/behavior-suggestion"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class SelectBehaviorsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('SelectBehaviors Error:', error, errorInfo)
  }

  handleRetry = () => {
    // 清除缓存并重置错误状态
    clearBehaviorSuggestionsCache()
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "获取建议失败，请重试"
      
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-800 mb-2">获取建议失败</h3>
                <p className="text-sm text-red-700 mb-4">{errorMessage}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.handleRetry}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重试
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}