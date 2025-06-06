import { Toaster } from "@/components/ui/toaster";
import NewHabitWizard from "./NewHabitWizard";

export default function NewHabitPage() {

    return (
        <div className="min-h-screen bg-surface-main">
            {/* 使用100dvh确保在移动端也能正确占满视口高度 */}
            <div className="h-[100dvh]">
                <NewHabitWizard />
            </div>

            {/* 全局Toast通知组件 */}
            <Toaster />
        </div>
    )
}