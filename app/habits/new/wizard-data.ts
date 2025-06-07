import { Behavior, Reminder } from "@/types/habit";

export type Step1Data = {
    habitTitle: string;
    habitDescription: string;
}

export type Step2Data = {
    behaviors: Behavior[];
}

export type Step3Data = {
    reminders: Reminder[];
}