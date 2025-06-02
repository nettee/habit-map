# 添加习惯组件

这个目录包含了从 `app/habits/add/page.tsx` 重构出来的组件，将原本的单一大文件拆分成了更易维护的小组件。

## 组件结构

### `SetHabitInfo.tsx`
- **功能**: 处理习惯创建的第一步 - 设置习惯基本信息
- **包含**: 习惯名称输入、习惯描述输入、导航按钮
- **Props**: habitName, setHabitName, habitDescription, setHabitDescription, onNext, onCancel

### `SelectBehaviors.tsx`
- **功能**: 处理习惯创建的第二步 - 选择微行为
- **包含**: 加载状态、微行为列表、选择逻辑、导航按钮
- **Props**: habitName, selectedMicroBehaviors, isLoadingRecommendations, onToggleBehavior, onNext, onPrev

### `SetBehaviorReminders.tsx`
- **功能**: 处理习惯创建的第三步 - 设置提醒
- **包含**: 提醒方式选择（自然提醒/定时提醒）、锚点选择、时间选择、卡片展开/收起
- **Props**: selectedMicroBehaviors, reminderSettings, setReminderSettings, anchorOptions, expandedCards, onToggleCardExpanded, onComplete, onPrev

### `types.ts`
- **功能**: 共享的TypeScript类型定义
- **包含**: MicroBehavior, AnchorOption, ReminderSettings 接口

## 重构的好处

1. **代码可读性**: 每个组件只负责一个步骤的逻辑，代码结构更清晰
2. **可维护性**: 修改某个步骤的UI或逻辑时，只需要关注对应的文件
3. **可重用性**: 如果将来有其他地方需要用到某个步骤的逻辑或UI，可以更容易地复用
4. **类型安全**: 使用共享的类型定义，确保组件间的数据传递类型安全

## 主页面 (`app/habits/add/page.tsx`)

重构后的主页面只负责：
- 状态管理（currentStep, habitName, selectedMicroBehaviors 等）
- 步骤切换逻辑（handleNextStep, handlePrevStep）
- 根据当前步骤渲染对应的组件
- 将必要的状态和处理函数作为props传递给子组件