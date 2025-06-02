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