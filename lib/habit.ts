// 封装习惯数据读写，前端组件只需调用 createHabit、getHabit、getHabits，底层可切换 localStorage 或真实后端访问
import { HabitData } from "@/types/habit"

// 使用 localStorage 模拟后端
const USE_LOCAL = true
const STORAGE_KEY = "habit-map-data"

export type HabitWithId = HabitData & { id: string }

function readStorage(): HabitWithId[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStorage(list: HabitWithId[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/** 获取所有习惯 */
export async function getHabits(): Promise<HabitWithId[]> {
  if (USE_LOCAL) {
    return readStorage()
  } else {
    const res = await fetch("/api/habits")
    if (!res.ok) throw new Error(`Failed to fetch habits: ${res.status}`)
    return res.json()
  }
}

/** 根据 id 获取单个习惯 */
export async function getHabit(id: string): Promise<HabitWithId | undefined> {
  if (USE_LOCAL) {
    const list = readStorage()
    return list.find(item => item.id === id)
  } else {
    const res = await fetch(`/api/habits/${id}`)
    if (!res.ok) {
      if (res.status === 404) return undefined
      throw new Error(`Failed to fetch habit: ${res.status}`)
    }
    return res.json()
  }
}

/** 创建新习惯 */
export async function createHabit(habit: HabitData): Promise<HabitWithId> {
  if (USE_LOCAL) {
    const list = readStorage()
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
    const newItem: HabitWithId = { id, ...habit }
    writeStorage([...list, newItem])
    return Promise.resolve(newItem)
  } else {
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habit),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || `Failed to create habit: ${res.status}`)
    }
    const data = await res.json()
    // 如果后端返回数组，则取第一个
    if (Array.isArray(data)) {
      return data[0]
    }
    return data
  }
} 