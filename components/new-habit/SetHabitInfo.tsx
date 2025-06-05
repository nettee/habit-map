"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import NavigationFooter from "./NavigationFooter";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface HabitFormData {
    title: string;
    description: string;
}

export default function SetHabitInfo({
    currentStep,
    totalSteps,
}: {
    currentStep: number;
    totalSteps: number;
}) {
    const { toast } = useToast();
    const router = useRouter();
    const { register, handleSubmit } = useForm<HabitFormData>({
        defaultValues: {
            title: '',
            description: '',
        },
    });

    // TODO 手动管理表单状态比较好
    const onSubmit = handleSubmit((data) => {
        console.log('habit info:', data);
        router.push(`/habits/new?step=${currentStep + 1}`);
    }, (errors) => {
        const errorMessage = Object.values(errors).map((error) => error.message).join('\n');
        toast({
            description: errorMessage,
            variant: 'destructive',
        });
    });

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
                        className="mt-2 border-surface-divider focus:border-brand-primary"
                        {...register('title', {
                            required: '请输入习惯内容',
                            maxLength: { value: 30, message: '习惯内容不能超过30个字符' },
                        })}
                    />
                </div>
                <div>
                    <Label htmlFor="habit-description" className="text-text-primary font-medium">
                        习惯说明 (可选)
                    </Label>
                    <Textarea
                        id="habit-description"
                        placeholder="我为什么想养成这个习惯？它对我有什么意义？"
                        className="mt-2 border-surface-divider focus:border-brand-primary min-h-32 md:min-h-64 resize-none"
                        {...register('description', {
                            maxLength: { value: 200, message: '习惯说明不能超过200个字符' },
                        })}
                    />
                </div>
            </div>
            <div className="flex-shrink-0">
                <NavigationFooter currentStep={currentStep} totalSteps={totalSteps} onSubmit={onSubmit} />
            </div>
        </div>
    )
}