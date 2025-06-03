import { MicroBehavior, HabitBasicInfo } from "@/components/add-habit/types"

const API_URL = '/api/behavior-suggestions'

// 模块级别的 Promise 缓存
const promiseCache = new Map<string, Promise<MicroBehavior[]>>()

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

// 支持 Suspense 的缓存版本
export function getBehaviorSuggestionsWithCache(habitBasicInfo: HabitBasicInfo): Promise<MicroBehavior[]> {
  const cacheKey = `${habitBasicInfo.title}|${habitBasicInfo.description}`
  
  if (promiseCache.has(cacheKey)) {
    return promiseCache.get(cacheKey)!
  }
  
  const promise = getBehaviorSuggestions(habitBasicInfo)
    .catch(error => {
      // 失败时清除缓存，允许重试
      promiseCache.delete(cacheKey)
      throw error
    })
  
  promiseCache.set(cacheKey, promise)
  return promise
}

// 清除缓存的工具函数
export function clearBehaviorSuggestionsCache() {
  promiseCache.clear()
}