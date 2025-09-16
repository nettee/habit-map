import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollableContent } from "@/components/scrollable-content"
import { Step2Data } from "./wizard-data"
import { HabitData } from "@/types/habit"
import { useBehaviorSuggestions } from "@/hooks/use-behavior-suggestions"

const selectedCountLimit = 3;

export default function SelectBehaviors({
    habitData,
    reportStep2Data
}: {
    habitData: HabitData;
    reportStep2Data: (data: Step2Data) => void;
}) {
    const {
        suggestions,
        isLoading,
        isStreaming,
        isStreamComplete,
        streamError,
        toggleBehavior,
        getSelectedBehaviors,
        selectedCount,
    } = useBehaviorSuggestions(habitData);

    // 当选中的行为发生变化时，报告给父组件
    useEffect(() => {
        const behaviors = getSelectedBehaviors();
        reportStep2Data({ behaviors });
    }, [suggestions, getSelectedBehaviors, reportStep2Data]);

    const handleBehaviorToggle = (behaviorId: string) => {
        toggleBehavior(behaviorId);
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
                <h3 className="font-medium text-text-primary inline-flex items-center">
                    推荐的微行为&nbsp;
                    {suggestions.length > 0 && (
                        <span>
                            ({suggestions.length})&nbsp;
                        </span>
                    )}
                    {!isStreamComplete && (
                        <div className="animate-spin rounded-full h-3 w-3 border border-blue-500 border-t-transparent mr-1"></div>
                    )}
                </h3>
                <span className="text-sm text-text-secondary">
                    已选择 {selectedCount}/{selectedCountLimit}
                </span>
            </div>
            <p className="text-sm text-text-secondary">
                选择1-{selectedCountLimit}个简单易行的微行为，让习惯更容易坚持
                {streamError && (
                    <span className="text-orange-600 ml-2">
                        (AI暂时不可用，已提供默认建议)
                    </span>
                )}
            </p>
        </div>
    )

    // 加载状态的内容
    const renderLoadingContent = () => {
        if (isLoading && suggestions.length === 0) {
            return (
                <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-text-secondary">AI 正在为您生成个性化的微行为建议...</p>
                    <p className="text-sm text-text-secondary mt-2">这可能需要几秒钟时间</p>
                </div>
            );
        }
        return null;
    };

    const behaviorCandidateContent = (
        <div className="py-2 space-y-3">
            {renderLoadingContent()}
            {suggestions.map((behavior) => (
                <Card 
                    key={behavior.id} 
                    className={`border-surface-divider transition-all duration-300 ${
                        behavior.id.startsWith('fallback') ? 'border-orange-200 bg-orange-50' : ''
                    }`}
                >
                    <CardContent
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleBehaviorToggle(behavior.id)}
                    >
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id={behavior.id}
                                checked={behavior.selected}
                                onCheckedChange={() => handleBehaviorToggle(behavior.id)}
                                className="mt-1 pointer-events-none"
                            />
                            <div className="flex-1">
                                <Label
                                    htmlFor={behavior.id}
                                    className="font-medium cursor-pointer text-text-primary pointer-events-none"
                                >
                                    {behavior.title}
                                </Label>
                                <p className="text-sm text-text-secondary mt-1 pointer-events-none">
                                    {behavior.description}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            {/* 流式加载中的占位提示 */}
            {isStreaming && suggestions.length > 0 && (
                <div className="py-4 text-center">
                    <div className="animate-pulse flex justify-center items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">AI 正在生成更多建议...</p>
                </div>
            )}
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