'use client';

import { ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function NavigationFooter({
    currentStep,
    totalSteps,
    onSubmit,
}: {
    currentStep: number;
    totalSteps: number;
    onSubmit: () => void;
}) {
    const router = useRouter();
    
    return (
        <footer className="flex-shrink-0 flex justify-between p-4 border-t border-surface-divider">
            {/* 左侧按钮：取消或返回上一步 */}
            <Button
                variant="ghost"
                onClick={() => {
                    if (currentStep > 1) {
                        router.push(`/habits/new?step=${currentStep - 1}`)
                    } else {
                        // TODO
                    }
                }}
                className="text-text-secondary"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep > 1 ? '上一步' : '取消'}
            </Button>

            {/* 右侧按钮：下一步或完成 */}
            <Button
                onClick={() => {
                    onSubmit();
                }}
                className="bg-brand-primary hover:bg-brand-primary/80 text-white"
            >
                {currentStep < totalSteps ? '下一步' : '完成'}
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </footer>
    );
}
