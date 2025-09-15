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

// SSE事件类型定义
export interface SSEBehaviorSuggestion {
  type: 'suggestion'
  data: {
    title: string
    description: string
  }
}

export interface SSEComplete {
  type: 'complete'
  count: number
}

export interface SSEError {
  type: 'error'
  message: string
}

export type SSEEvent = SSEBehaviorSuggestion | SSEComplete | SSEError

// 流式获取建议的函数 
export async function getBehaviorSuggestionsStream(
  habitBasicInfo: HabitBasicInfo,
  onSuggestion?: (suggestion: MicroBehavior) => void,
  onError?: (error: string) => void,
  onComplete?: (count: number) => void
): Promise<MicroBehavior[]> {
  const requestData: BehaviorSuggestionRequest = {
    habit: habitBasicInfo,
  }

  return new Promise((resolve, reject) => {
    const suggestions: MicroBehavior[] = []
    let suggestionCount = 0

    try {
      // 使用fetch + ReadableStream处理SSE流
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || `API请求失败: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('响应体为空')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim()
                
                if (!data) continue

                try {
                  const event: SSEEvent = JSON.parse(data)
                  
                  switch (event.type) {
                    case 'suggestion':
                      suggestionCount++
                      const suggestion: MicroBehavior = {
                        id: suggestionCount.toString(),
                        title: event.data.title,
                        description: event.data.description,
                        selected: false,
                      }
                      suggestions.push(suggestion)
                      onSuggestion?.(suggestion)
                      break
                      
                    case 'complete':
                      console.log(`SSE流式接收完成，共收到 ${event.count} 个建议`)
                      onComplete?.(event.count)
                      resolve(suggestions)
                      return
                      
                    case 'error':
                      console.error('SSE错误:', event.message)
                      onError?.(event.message)
                      reject(new Error(event.message))
                      return
                  }
                } catch (parseError) {
                  console.warn('解析SSE事件失败:', parseError)
                  // 继续处理，不中断流
                }
              }
            }
          }
          
          // 如果循环正常结束但没有收到complete事件
          resolve(suggestions)
        } catch (streamError) {
          console.error('处理流式响应失败:', streamError)
          reject(streamError)
        }
      }).catch(reject)
      
    } catch (error) {
      console.error('建立SSE连接失败:', error)
      reject(error)
    }
  })
}

// 保持向后兼容的函数
export async function getBehaviorSuggestions(
  habitBasicInfo: HabitBasicInfo
): Promise<MicroBehavior[]> {
  // 默认使用流式API，但不处理中间状态
  return getBehaviorSuggestionsStream(habitBasicInfo)
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