import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollableContent } from "@/components/scrollable-content"
import { Step2Data } from "./wizard-data"
import { HabitData } from "@/types/habit"

interface BehaviorCandidate {
    id: string;
    title: string;
    description: string;
    selected: boolean;
}

const mockBehaviorCandidates: BehaviorCandidate[] = [
    {
        id: "1",
        title: "喝水",
        description: "每天喝水",
        selected: false,
    },
    {
        id: "2",
        title: "吃饭",
        description: "每天吃饭",
        selected: false,
    },
    {
        id: "3",
        title: "睡觉",
        description: "每天睡觉",
        selected: false,
    },
    {
        id: "4",
        title: "运动",
        description: "每天运动",
        selected: false,
    },
    {
        id: "5",
        title: "学习",
        description: "每天学习",
        selected: false,
    },
    {
        id: "6",
        title: "工作",
        description: "每天工作",
        selected: false,
    },
    {
        id: "7",
        title: "阅读",
        description: "每天阅读",
        selected: false,
    },
    {
        id: "8",
        title: "写作",
        description: "每天写作",
        selected: false,
    },
    {
        id: "9",
        title: "冥想",
        description: "每天冥想",
        selected: false,
    },
    {
        id: "10",
        title: "旅行",
        description: "每天旅行",
        selected: false,
    },
];

const selectedCountLimit = 3;

export default function SelectBehaviors({
    habitData,
    reportStep2Data
}: {
    habitData: HabitData;
    reportStep2Data: (data: Step2Data) => void;
}) {
    const [behaviorCandidates, setBehaviorCandidates] = useState<BehaviorCandidate[]>(mockBehaviorCandidates);
    const [selectedCount, setSelectedCount] = useState(0);

    // 当 behaviorCandidates 发生变化时，报告给父组件
    useEffect(() => {
        const behaviors = behaviorCandidates
            .filter(b => b.selected)
            .map(b => ({
                title: b.title,
                description: b.description,
            }));
        reportStep2Data({ behaviors });
    }, [behaviorCandidates, reportStep2Data]);

    const handleBehaviorToggle = (behavior: BehaviorCandidate) => {
        const newSelected = !behavior.selected;
        setBehaviorCandidates(prev => prev.map(b =>
            b.id === behavior.id ? { ...b, selected: newSelected } : b
        ));
        setSelectedCount(prev => newSelected ? prev + 1 : prev - 1);
    }

    const habitCard = (
        <Card className="border-surface-divider bg-surface-main">
            <CardContent className="p-4">
                <p className="text-sm text-text-secondary">我想养成的习惯是：</p>
                <p className="font-medium text-text-primary">{habitData.title}</p>
            </CardContent>
        </Card>
    )

    const behaviorCandidateTitle = (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-text-primary">推荐的微行为</h3>
                <span className="text-sm text-text-secondary">
                    已选择 {selectedCount}/{selectedCountLimit}
                </span>
            </div>
            <p className="text-sm text-text-secondary">选择1-{selectedCountLimit}个简单易行的微行为，让习惯更容易坚持</p>
        </div>
    )

    const behaviorCandidateContent = (
        <div className="py-2 space-y-3">
            {behaviorCandidates.map((behavior) => (
                <Card key={behavior.id} className="border-surface-divider">
                    <CardContent
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleBehaviorToggle(behavior)}
                    >
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id={behavior.id}
                                checked={behavior.selected}
                                onCheckedChange={() => handleBehaviorToggle(behavior)}
                                className="mt-1 pointer-events-none"
                            />
                            <div className="flex-1">
                                <Label
                                    htmlFor={behavior.id}
                                    className="font-medium cursor-pointer text-text-primary pointer-events-none"
                                >
                                    {behavior.title}
                                </Label>
                                <p className="text-sm text-text-secondary mt-1 pointer-events-none">{behavior.description}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    return (
        <div className="h-full flex flex-col p-4 pb-0 space-y-2">
            <div className="flex-shrink-0">
                {habitCard}
            </div>
            <div className="flex-shrink-0">
                {behaviorCandidateTitle}
            </div>
            <div className="flex-1 min-h-0">
                <ScrollableContent>
                    {behaviorCandidateContent}
                </ScrollableContent>
            </div>
        </div >
    )
}