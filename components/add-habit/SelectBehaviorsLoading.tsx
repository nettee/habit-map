"use client"

export default function SelectBehaviorsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-6"></div>
      <h3 className="text-lg font-medium text-text-primary mb-2">正在为您推荐微行为...</h3>
      <p className="text-sm text-text-secondary text-center leading-relaxed">
        基于您的习惯目标，我们正在分析并推荐
        <br />
        最适合的微行为组合
      </p>
    </div>
  )
}