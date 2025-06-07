export type ReminderType = "anchor" | "timer";

export type Reminder = {
    type: ReminderType;
    anchor?: string;
    time?: string;
}

export type Behavior = {
    title: string;
    description: string;
}

export type BehaviorAndReminder = {
    title: string;
    description: string;
    reminder?: Reminder;
}

export type HabitData = {
    title: string;
    description: string;
    behaviors: BehaviorAndReminder[];
}