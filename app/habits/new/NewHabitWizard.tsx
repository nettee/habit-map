"use client"

import NewHabitFooter from "@/app/habits/new/NewHabitFooter";
import NewHabitHeader from "@/app/habits/new/NewHabitHeader";
import SetHabitInfo from "@/app/habits/new/Step1SetHabitInfo";
import { useState } from "react";
import SelectBehaviors from "./Step2SelectBehaviors";
import SetReminders from "./Step3SetReminders";
import { useToast } from "@/hooks/use-toast";
import { Step1Data, Step2Data, Step3Data } from "./wizard-data";
import { HabitData } from "@/types/habit";

const totalSteps = 3;

function useStep() {
    const [currentStep, setCurrentStep] = useState(1);

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    const toPrevStep = () => {
        if (isFirstStep) {
            throw new Error('Cannot go back from the first step');
        }
        setCurrentStep(currentStep - 1);
    }

    const toNextStep = () => {
        if (isLastStep) {
            throw new Error('Cannot go forward from the last step');
        }
        setCurrentStep(currentStep + 1);
    }

    return {
        currentStep,
        isFirstStep,
        isLastStep,
        toPrevStep,
        toNextStep,
    }
}

export default function NewHabitWizard() {
    const { toast } = useToast();
    const { currentStep, isFirstStep, isLastStep, toPrevStep, toNextStep } = useStep();

    const [habitData, setHabitData] = useState<HabitData>({
        title: "",
        description: "",
        behaviors: [],
    });

    const [step1Data, setStep1Data] = useState<Step1Data>({
        habitTitle: "",
        habitDescription: "",
    });

    const [step2Data, setStep2Data] = useState<Step2Data>({
        behaviors: [],
    });

    const [step3Data, setStep3Data] = useState<Step3Data>({
        reminders: [],
    });

    const checkStep1 = () => {
        const { habitTitle, habitDescription } = step1Data;
        if (habitTitle.length === 0) {
            toast({
                description: '请输入习惯内容',
                variant: 'destructive',
            });
            return false;
        }
        if (habitTitle.length > 30) {
            toast({
                description: '习惯内容不能超过30个字符',
                variant: 'destructive',
            });
            return false;
        }
        if (habitDescription.length > 200) {
            toast({
                description: '习惯说明不能超过200个字符',
                variant: 'destructive',
            });
            return false;
        }
        return true;
    }

    const mergeStep1Data = () => {
        setHabitData({
            ...habitData,
            title: step1Data.habitTitle,
            description: step1Data.habitDescription,
        });
    }

    const checkStep2 = () => {
        const { behaviors } = step2Data;
        if (behaviors.length === 0) {
            toast({
                description: '请选择至少一个行为',
                variant: 'destructive',
            });
            return false;
        }
        if (behaviors.length > 3) {
            toast({
                description: '最多选择3个行为',
                variant: 'destructive',
            });
            return false;
        }
        return true;
    }

    const checkStep3 = () => {
        const { reminders } = step3Data;
        for (const reminder of reminders) {
            if (reminder.type === "anchor") {
                if (!reminder.anchor) {
                    toast({
                        description: '请选择提醒方式',
                        variant: 'destructive',
                    });
                    return false;
                }
            } else if (reminder.type === "timer") {
                if (!reminder.time) {
                    toast({
                        description: '请选择提醒时间',
                        variant: 'destructive',
                    });
                    return false;
                }
            }
        }
        return true;
    }

    const mergeStep2Data = () => {
        setHabitData({
            ...habitData,
            behaviors: step2Data.behaviors,
        });
    }

    const mergeStep3Data = () => {
        const behaviors = habitData.behaviors;
        const reminders = step3Data.reminders;
        for (let i = 0; i < behaviors.length; i++) {
            behaviors[i].reminder = reminders[i];
        }
        setHabitData({
            ...habitData,
            behaviors: behaviors,
        });
    }

    const prev = () => {
        toPrevStep();
        // TODO
    }

    const next = () => {
        if (currentStep === 1) {
            if (!checkStep1()) {
                return;
            }
            mergeStep1Data();
        }
        if (currentStep === 2) {
            if (!checkStep2()) {
                return;
            }
            mergeStep2Data();
        }
        if (currentStep === 3) {
            if (!checkStep3()) {
                return;
            }
            mergeStep3Data();
        }
        if (currentStep < 3) {
            toNextStep();
        } else {
            // TODO
            console.log('ready to submit, habitData:', habitData);
        }
    }

    const cancel = () => {
        // TODO
    }

    const submit = () => {
        // TODO
    }

    return (
        <div className="h-full flex flex-col">
            {/* 顶部进度指示器和标题 */}
            <div className="flex-shrink-0">
                <NewHabitHeader currentStep={currentStep} totalSteps={totalSteps} />
            </div>

            {/* 内容区域 */}
            <div className="flex-1 min-h-0">
                {currentStep === 1 && <SetHabitInfo reportStep1Data={setStep1Data} />}
                {/* 进入第二步时，将第一步的数据放到 habitData 中，传入子组件 */}
                {currentStep === 2 && <SelectBehaviors habitData={habitData} reportStep2Data={setStep2Data} />}
                {currentStep === 3 && <SetReminders habitData={habitData} reportStep3Data={setStep3Data} />}
            </div>

            {/* 底部导航区域 */}
            <div className="flex-shrink-0">
                <NewHabitFooter
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    onPrev={prev}
                    onNext={next}
                />
            </div>
        </div>
    )
}