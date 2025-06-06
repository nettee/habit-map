import ProgressIndicator from "../../../components/add-habit/ProgressIndicator"

const pageTitles: Record<number, string> = {
    1: '定义你的习惯',
    2: '选择微行为',
    3: '设置提醒',
}

export default function NewHabitHeader({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
    return (
        <header className="p-4 pb-0">
            {/* 进度指示器：显示当前步骤进度 */}
            <div className="mb-4">
                <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </div>

            {/* 步骤信息和标题：动态显示当前步骤的信息 */}
            <div className="text-center mb-6">
                <p className="text-xs text-text-secondary mb-2">
                    第 {currentStep} 步，共 {totalSteps} 步 · 设计新习惯
                </p>
                <h1 className="text-2xl font-bold text-text-primary">
                    {pageTitles[currentStep]}
                </h1>
            </div>
        </header>
    )
}