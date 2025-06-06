"use client"

import NewHabitFooter from "@/app/habits/new/NewHabitFooter";
import NewHabitHeader from "@/app/habits/new/NewHabitHeader";
import SetHabitInfo from "@/app/habits/new/SetHabitInfo";
import { useState } from "react";
import SelectBehaviors from "./SelectBehaviors";
import SetReminders from "./SetReminders";

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
    const { currentStep, isFirstStep, isLastStep, toPrevStep, toNextStep } = useStep();

    const prev = () => {
        toPrevStep();
        // TODO
    }

    const next = () => {
        toNextStep();
        // TODO
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
                {currentStep === 1 && <SetHabitInfo />}
                {currentStep === 2 && <SelectBehaviors />}
                {currentStep === 3 && <SetReminders />}
            </div>

            {/* 底部导航区域 */}
            <div className="flex-shrink-0">
                <NewHabitFooter
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    onPrev={prev}
                    onNext={next}
                    onCancel={cancel}
                    onSubmit={submit}
                />
            </div>
        </div>
    )
}