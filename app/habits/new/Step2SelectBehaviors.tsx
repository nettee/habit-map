import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollableContent } from "@/components/scrollable-content"
import { Step2Data } from "./wizard-data"
import { HabitData } from "@/types/habit"
import { getBehaviorSuggestionsStream } from "@/lib/behavior-suggestion"

interface BehaviorCandidate {
    id: string;
    title: string;
    description: string;
    selected: boolean;
}

// 后备的默认建议，当API失败时使用
const fallbackSuggestions: BehaviorCandidate[] = [
    {
        id: "fallback-1",
        title: "开始第一步",
        description: "将目标分解为最小的可执行步骤",
        selected: false,
    },
    {
        id: "fallback-2", 
        title: "设定提醒",
        description: "在日历或手机上设置提醒",
        selected: false,
    },
    {
        id: "fallback-3",
        title: "准备环境",
        description: "提前准备好需要的工具和环境",
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
    const [behaviorCandidates, setBehaviorCandidates] = useState<BehaviorCandidate[]>([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 获取AI建议
    useEffect(() => {
        let mounted = true;
        
        const fetchSuggestions = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setBehaviorCandidates([]);
                
                // 转换为API需要的格式
                const habitBasicInfo = {
                    title: habitData.title,
                    description: habitData.description || ''
                };
                
                await getBehaviorSuggestionsStream(
                    habitBasicInfo,
                    // onSuggestion: 每收到一个建议就添加到列表
                    (suggestion) => {
                        if (!mounted) return;
                        const behaviorCandidate: BehaviorCandidate = {
                            id: suggestion.id,
                            title: suggestion.title,
                            description: suggestion.description,
                            selected: false,
                        };
                        setBehaviorCandidates(prev => [...prev, behaviorCandidate]);
                        // 收到第一个建议就不再显示loading
                        if (isLoading) {
                            setIsLoading(false);
                        }
                    },
                    // onError: 处理错误
                    (errorMessage) => {
                        if (!mounted) return;
                        console.error('获取建议失败:', errorMessage);
                        setError(errorMessage);
                        setIsLoading(false);
                        // 使用后备建议
                        setBehaviorCandidates(fallbackSuggestions);
                    },
                    // onComplete: 标记完成
                    (count) => {
                        if (!mounted) return;
                        setIsComplete(true);
                        setIsLoading(false);
                        console.log(`流式加载完成，共收到 ${count} 个建议`);
                    }
                );
            } catch (err) {
                if (!mounted) return;
                console.error('获取流式建议失败:', err);
                const errorMessage = err instanceof Error ? err.message : '获取建议失败';
                setError(errorMessage);
                setIsLoading(false);
                // 使用后备建议
                setBehaviorCandidates(fallbackSuggestions);
            }
        };
        
        // 只有当有习惯标题时才获取建议
        if (habitData.title) {
            fetchSuggestions();
        }
        
        return () => {
            mounted = false;
        };
    }, [habitData.title, habitData.description]);

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
                <h3 className="font-medium text-text-primary inline-flex items-center">
                    推荐的微行为&nbsp;
                    {behaviorCandidates.length > 0 && (
                        <span>
                            ({behaviorCandidates.length})&nbsp;
                        </span>
                    )}
                    {!isComplete && (
                        <div className="animate-spin rounded-full h-3 w-3 border border-blue-500 border-t-transparent mr-1"></div>
                    )}
                </h3>
                <span className="text-sm text-text-secondary">
                    已选择 {selectedCount}/{selectedCountLimit}
                </span>
            </div>
            <p className="text-sm text-text-secondary">
                选择1-{selectedCountLimit}个简单易行的微行为，让习惯更容易坚持
                {error && (
                    <span className="text-orange-600 ml-2">
                        (AI暂时不可用，已提供默认建议)
                    </span>
                )}
            </p>
        </div>
    )

    // 加载状态的内容
    const renderLoadingContent = () => {
        if (isLoading && behaviorCandidates.length === 0) {
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
            {behaviorCandidates.map((behavior) => (
                <Card 
                    key={behavior.id} 
                    className={`border-surface-divider transition-all duration-300 ${
                        behavior.id.startsWith('fallback') ? 'border-orange-200 bg-orange-50' : ''
                    }`}
                >
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
                                <p className="text-sm text-text-secondary mt-1 pointer-events-none">
                                    {behavior.description}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            {/* 流式加载中的占位提示 */}
            {isLoading && behaviorCandidates.length > 0 && (
                <div className="py-4 text-center">
                    <div className="animate-pulse flex justify-center items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">AI正在生成更多建议...</p>
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