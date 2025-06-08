"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Step1Data } from "./wizard-data";
import { useEffect, useState } from "react";

export default function SetHabitInfo({
    reportStep1Data
}: {
    reportStep1Data: (data: Step1Data) => void;
}) {
    const [habitTitle, setHabitTitle] = useState("");
    const [habitDescription, setHabitDescription] = useState("");

    // 当 habitTitle 或 habitDescription 发生变化时，报告给父组件
    useEffect(() => {
        const step1Data: Step1Data = {
            habitTitle,
            habitDescription,
        };
        reportStep1Data(step1Data);
    }, [habitTitle, habitDescription, reportStep1Data]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0 p-4 pb-0 overflow-y-auto space-y-4">
                <div>
                    <Label htmlFor="habit-title" className="text-text-primary font-medium">
                        习惯内容
                    </Label>
                    <Input
                        id="habit-title"
                        placeholder="我想养成的好习惯是..."
                        value={habitTitle}
                        onChange={(e) => setHabitTitle(e.target.value)}
                        className="mt-2 border-surface-divider focus:border-brand-primary"
                    />
                </div>
                <div>
                    <Label htmlFor="habit-description" className="text-text-primary font-medium">
                        习惯说明 (可选)
                    </Label>
                    <Textarea
                        id="habit-description"
                        placeholder="我为什么想养成这个习惯？它对我有什么意义？"
                        value={habitDescription}
                        onChange={(e) => setHabitDescription(e.target.value)}
                        className="mt-2 border-surface-divider focus:border-brand-primary min-h-32 md:min-h-64 resize-none"
                    />
                </div>
            </div>
        </div>
    )
}