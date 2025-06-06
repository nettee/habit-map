'use client';

import { ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function NewHabitFooter({
    isFirstStep,
    isLastStep,
    onPrev,
    onNext,
    onCancel,
    onSubmit,
}: {
    isFirstStep: boolean;
    isLastStep: boolean;
    onPrev: () => void;
    onNext: () => void;
    onCancel: () => void;
    onSubmit: () => void;
}) {
    return (
        <footer className="flex justify-between p-4 border-t border-surface-divider">
            {/* 左侧按钮：取消或返回上一步 */}
            <Button
                variant="ghost"
                onClick={isFirstStep ? onCancel : onPrev}
                className="text-text-secondary"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isFirstStep ? '取消' : '上一步'}
            </Button>

            {/* 右侧按钮：下一步或完成 */}
            <Button
                onClick={isLastStep ? onSubmit : onNext}
                className="bg-brand-primary hover:bg-brand-primary/80 text-white"
            >
                {isLastStep ? '完成' : '下一步'}
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </footer>
    );
}
