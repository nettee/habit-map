'use client'

import { useQuery } from '@tanstack/react-query'
import { HabitData } from '@/types/habit'
import { getBehaviorSuggestionsStream } from '@/lib/behavior-suggestion'
import { useState, useCallback } from 'react'

interface BehaviorCandidate {
  id: string;
  title: string;
  description: string;
  selected: boolean;
}

// 后备的默认建议，当API失败时使用
const fallbackSuggestions: BehaviorCandidate[] = [
  {
    id: "fallback-1",
    title: "开始第一步",
    description: "将目标分解为最小的可执行步骤",
    selected: false,
  },
  {
    id: "fallback-2", 
    title: "设定提醒",
    description: "在日历或手机上设置提醒",
    selected: false,
  },
  {
    id: "fallback-3",
    title: "准备环境",
    description: "提前准备好需要的工具和环境",
    selected: false,
  },
];

export function useBehaviorSuggestions(habitData: HabitData) {
  const [streamingSuggestions, setStreamingSuggestions] = useState<BehaviorCandidate[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isStreamComplete, setIsStreamComplete] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)

  // 使用 React Query 来管理状态，但实际数据通过流式接口获取
  const query = useQuery({
    queryKey: ['behavior-suggestions', habitData.title, habitData.description],
    queryFn: async () => {
      // 重置流式状态
      setStreamingSuggestions([])
      setIsStreaming(true)
      setIsStreamComplete(false)
      setStreamError(null)

      try {
        const habitBasicInfo = {
          title: habitData.title,
          description: habitData.description || ''
        };

        const suggestions = await getBehaviorSuggestionsStream(
          habitBasicInfo,
          // onSuggestion: 每收到一个建议就添加到列表
          (suggestion) => {
            const behaviorCandidate: BehaviorCandidate = {
              id: suggestion.id,
              title: suggestion.title,
              description: suggestion.description,
              selected: false,
            };
            setStreamingSuggestions(prev => [...prev, behaviorCandidate]);
          },
          // onError: 处理错误
          (errorMessage) => {
            console.error('获取建议失败:', errorMessage);
            setStreamError(errorMessage);
            setIsStreaming(false);
            // 使用后备建议
            setStreamingSuggestions(fallbackSuggestions);
          },
          // onComplete: 标记完成
          (count) => {
            setIsStreamComplete(true);
            setIsStreaming(false);
            console.log(`流式加载完成，共收到 ${count} 个建议`);
          }
        );

        return suggestions;
      } catch (err) {
        console.error('获取流式建议失败:', err);
        const errorMessage = err instanceof Error ? err.message : '获取建议失败';
        setStreamError(errorMessage);
        setIsStreaming(false);
        // 使用后备建议
        setStreamingSuggestions(fallbackSuggestions);
        throw err;
      }
    },
    enabled: !!habitData.title, // 只有当有习惯标题时才执行查询
    retry: 1, // 减少重试次数，因为流式请求失败后会使用后备方案
  })

  // 切换行为选择状态
  const toggleBehavior = useCallback((behaviorId: string) => {
    setStreamingSuggestions(prev => 
      prev.map(b => 
        b.id === behaviorId ? { ...b, selected: !b.selected } : b
      )
    );
  }, []);

  // 获取选中的行为
  const getSelectedBehaviors = useCallback(() => {
    return streamingSuggestions
      .filter(b => b.selected)
      .map(b => ({
        title: b.title,
        description: b.description,
      }));
  }, [streamingSuggestions]);

  return {
    // React Query 原生状态
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    
    // 流式状态
    suggestions: streamingSuggestions,
    isStreaming,
    isStreamComplete,
    streamError,
    
    // 业务逻辑
    toggleBehavior,
    getSelectedBehaviors,
    selectedCount: streamingSuggestions.filter(b => b.selected).length,
  }
}
