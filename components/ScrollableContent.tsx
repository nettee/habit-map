import React from "react";

interface ScrollableContentProps {
  children: React.ReactNode;
}

/**
 * 通用滚动容器组件
 * 
 * 提供一个完整的滚动解决方案，适用于需要垂直滚动的场景。
 * 特点：
 * - 占满父容器高度
 * - 内容超出时自动显示滚动条
 * - 隐藏滚动条样式但保持滚动功能
 * - 支持 flex 布局
 */
export function ScrollableContent({ children }: ScrollableContentProps) {
  return (
    // 最外层容器：占据父容器的完整高度，建立flex布局
    // h-full: 继承父容器的100%高度
    // flex flex-col: 垂直方向的flex布局，为内部滚动区域提供高度基础
    <div className="h-full flex flex-col">
      {/* 滚动区域容器：负责建立滚动上下文 */}
      {/* flex-1: 占据剩余的所有可用空间 */}
      {/* relative: 为绝对定位的子元素提供定位参考 */}
      {/* min-h-0: 重要！允许flex子项收缩到内容高度以下，这是实现滚动的关键 */}
      <div className="flex-1 relative min-h-0">
        {/* 实际的滚动容器：这里是滚动的核心实现 */}
        {/* h-full: 占据父容器的100%高度（这里是flex-1分配的空间） */}
        {/* overflow-y-auto: 垂直方向内容超出时显示滚动条，否则隐藏 */}
        {/* scrollbar-hide: 自定义类，隐藏滚动条但保持滚动功能 */}
        <div className="h-full overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
} 