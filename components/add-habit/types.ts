/**
 * 习惯基本信息接口
 */
export interface HabitBasicInfo {
  title: string      // 习惯标题
  description: string // 习惯描述
}

export interface MicroBehavior {
  id: string
  title: string
  description: string
  selected: boolean
}

export interface AnchorOption {
  id: string
  label: string
  description: string
}

export interface ReminderSettings {
  [key: string]: {
    type: "anchor" | "timer"
    anchor?: string
    time?: string
  }
}