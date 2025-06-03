import { MicroBehavior, HabitBasicInfo } from "@/components/add-habit/types"

const API_URL = '/api/behavior-suggestions'

export interface BehaviorSuggestionRequest {
  habit: HabitBasicInfo
}

export interface BehaviorSuggestionResponse {
  suggestions: {
    title: string
    description: string
  }[]
}

export async function getBehaviorSuggestions(
  habitBasicInfo: HabitBasicInfo
): Promise<MicroBehavior[]> {
  const requestData: BehaviorSuggestionRequest = {
    habit: habitBasicInfo,
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API请求失败: ${response.status} ${response.statusText}`)
    }

    const data: BehaviorSuggestionResponse = await response.json()

    if (!data.suggestions || !Array.isArray(data.suggestions)) {
      throw new Error('API返回数据格式错误')
    }

    // 转换API数据为组件需要的格式
    return data.suggestions.map((suggestion, index) => ({
      id: (index + 1).toString(), // 简单递增数字ID
      title: suggestion.title,
      description: suggestion.description,
      selected: false,
    }))
  } catch (error) {
    console.error('获取习惯建议失败:', error)
    throw error
  }
}