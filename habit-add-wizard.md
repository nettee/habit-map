# Habit Add Wizard 改造计划

此文档列出了在 Next.js 框架下将"添加习惯"流程重构为线性向导（Wizard）的改造方案，包括具体步骤、要点及进度记录。

## 1. 提取并封装流程状态到 Context

- 在 `app/habits/add/HabitWizardContext.tsx` 中新建 Context：
  - 管理状态：
    - `habitName`、`habitDescription`
    - `selectedMicroBehaviors`
    - `reminderSettings`
    - `expandedCards`
  - 在 Provider 中实现 `localStorage` 持久化与初始化恢复。
  - 暴露 Actions：
    - `setHabitName`、`setHabitDescription`
    - `selectBehaviors`、`toggleCardExpanded`
    - `setReminderSettings`、`nextStep`、`prevStep`、`complete`

## 2.1 包裹 Provider（最小修改验证）

- 在 `app/habits/add/page.tsx` 最外层用 `HabitWizardProvider` 包裹，不修改其他任何代码。
- 目的：验证 Context 系统正常工作，不破坏现有功能。
- 验证：手动测试完整的添加习惯流程，确保功能正常。

## 2.2 迁移 SetHabitInfo 组件

- 只修改 `components/add-habit/SetHabitInfo.tsx` 文件：
  - 去除对 `habitName`、`setHabitName`、`habitDescription`、`setHabitDescription`、`onNext` 的 props 依赖。
  - 改为使用 `useHabitWizard()` 获取状态与方法。
  - 使用 Context 中的 `nextStep()` 替代 `onNext` prop。
- 验证："填写习惯名称 → 下一步"流程正常。

## 2.3 迁移 SelectBehaviors 组件

- 只修改 `components/add-habit/SelectBehaviors.tsx` 文件：
  - 去除对 `habitName`、`habitDescription`、`onNext`、`onPrev` 的 props 依赖。
  - 改为从 Context 读取 `habitName`、`habitDescription`。
  - 使用 Context 中的 `selectBehaviors()` 和步骤导航方法。
- 验证：选择微行为和步骤导航功能正常。

## 2.4 迁移 SetBehaviorReminders 组件

- 只修改 `components/add-habit/SetBehaviorReminders.tsx` 文件：
  - 去除所有 props 依赖，改为使用 `useHabitWizard()`。
  - 使用 Context 中的状态和方法控制提醒类型和内容。
  - 使用 Context 中的 `complete()` 方法替代 `onComplete` prop。
- 验证：展开/收起、自然提醒/定时提醒和完成创建功能正常。

## 2.5 清理旧状态管理代码

- 只修改 `app/habits/add/page.tsx` 文件：
  - 移除所有旧的 `useState` 状态定义。
  - 移除所有旧的处理函数（`handleNextStep`、`handleSelectBehaviors` 等）。
  - 简化组件 props 传递，只保留必要的静态数据（如 `anchorOptions`）。
- 验证：整体流程正常，代码更简洁。

## 3.1 创建路由 Layout

- 新建 `app/habits/add/layout.tsx`：
  - 挂载 `HabitWizardProvider`，从 `page.tsx` 中移出。
  - 渲染公共布局（进度指示器、Toaster、通用容器）。
  - 渲染子路由插槽：`{children}`。
- 暂时让 layout 直接渲染现有的 `page.tsx` 内容。
- 验证：功能正常，为路由拆分做准备。

## 3.2 拆分子路由

- 创建子路由文件：
  - `app/habits/add/step1/page.tsx` → 渲染 `SetHabitInfo`。
  - `app/habits/add/step2/page.tsx` → 渲染 `SelectBehaviors`。
  - `app/habits/add/step3/page.tsx` → 渲染 `SetBehaviorReminders`。
- 在各步骤中使用 Next.js 路由导航：
  - 修改 Context 中的步骤导航方法使用 `router.push('/habits/add/step2')` 等。
  - 在 `useEffect` 校验前置数据，若缺失则重定向至 `step1`，防止用户跳过。
- 移除原 `page.tsx` 中的条件渲染逻辑。

## 4. 布局融合优化

### 问题分析
目前存在双层布局结构，导致代码重复和维护复杂：
- `layout.tsx`：提供基础容器 + Provider
- `StepLayout.tsx`：提供步骤布局（进度条、标题、按钮）
- 每个步骤页面都需要手动包裹 `<StepLayout>`，存在重复代码

### 优化方案：Context驱动的统一Layout

- **新建**：`app/habits/add/StepLayoutContext.tsx`
- **重构**：`app/habits/add/layout.tsx`（融合布局逻辑）
- **删除**：`components/add-habit/StepLayout.tsx`
- **简化**：`app/habits/add/step*/page.tsx`（移除布局包裹）
- **更新**：相关组件的导入和使用

### Context职责划分与依赖关系

#### HabitWizardContext（业务层）
- **职责**：业务逻辑和数据管理
- **包含**：习惯数据、微行为选择、提醒设置、数据验证、localStorage持久化
- **特点**：与UI无关，可复用，生命周期较长

#### StepLayoutContext（UI层）
- **职责**：UI布局和导航状态管理
- **包含**：进度显示、步骤标题、导航按钮状态、布局配置、页面过渡
- **特点**：与具体UI紧密相关，生命周期较短

#### 依赖关系原则
- **单向依赖**：StepLayoutContext依赖HabitWizardContext，不反向依赖
- **边界清晰**：业务层不关心UI状态，UI层不包含业务逻辑
- **状态共享**：`currentStep`由业务层持有和管理，UI层通过hook获取

#### 交互模式
```typescript
// UI层消费业务层数据
const StepLayoutProvider = ({ children }) => {
  const { currentStep, canProceedToStep } = useHabitWizard();
  
  const canGoNext = canProceedToStep(currentStep + 1);
  const progress = (currentStep / 3) * 100;
  // ...
};
```

## 进度记录

- **步骤1**: ✅ 已完成 - 创建了 `HabitWizardContext.tsx`，实现了：
  - 使用 `useState` 管理所有状态（`currentStep`、`habitName`、`habitDescription`、`selectedMicroBehaviors`、`reminderSettings`、`expandedCards`）
  - 实现了 `localStorage` 持久化和状态恢复
  - 暴露了所有必要的 Actions：`setHabitName`、`setHabitDescription`、`selectBehaviors`、`toggleCardExpanded`、`setReminderSettings`、`nextStep`、`prevStep`、`setStep`、`complete`、`resetState`
  - 使用 `useMemo` 优化性能，防止不必要的重新渲染
- **步骤2.1**: ✅ 已完成 - 包裹 Provider 进行最小修改验证：
  - 在 `app/habits/add/page.tsx` 中添加了 `HabitWizardProvider` 包裹
  - 只修改了导入和最外层的包裹，没有修改任何其他逻辑
  - Context 系统已经可用，但暂时与现有状态管理并存
- **步骤2.2**: ✅ 已完成 - 迁移 SetHabitInfo 组件：
  - 修改了 `components/add-habit/SetHabitInfo.tsx`，去除了 `habitName`、`setHabitName`、`habitDescription`、`setHabitDescription`、`onNext` 等 props 依赖
  - 改为使用 `useHabitWizard()` hook 获取状态和方法
  - 使用 Context 中的 `nextStep()` 替代 `onNext` prop
  - 更新了 `page.tsx` 中的组件调用，简化了 props 传递
- **步骤2.3**: ✅ 已完成 - 迁移 SelectBehaviors 组件：
  - 修改了 `components/add-habit/SelectBehaviors.tsx`，去除了所有 props 依赖（`habitName`、`habitDescription`、`onNext`、`onPrev`）
  - 改为使用 `useHabitWizard()` hook 从 Context 获取状态和方法
  - 使用 Context 中的 `selectBehaviors()` 保存选择的微行为，使用 `nextStep()`、`prevStep()` 进行导航
  - 添加了状态恢复逻辑，当 Context 中有已选择的微行为时自动恢复本地状态
  - 更新了 `page.tsx` 中的组件调用，移除了所有 props 传递
  - **问题解决**：修复了第3步显示空白的问题，让 `page.tsx` 从 Context 读取 `selectedMicroBehaviors`、`reminderSettings`、`expandedCards` 状态
- **步骤2.4**: ✅ 已完成 - 迁移 SetBehaviorReminders 组件：
  - 修改了 `components/add-habit/SetBehaviorReminders.tsx`，去除了所有 props 依赖（`selectedMicroBehaviors`、`reminderSettings`、`setReminderSettings`、`anchorOptions`、`expandedCards`、`onToggleCardExpanded`、`onComplete`、`onPrev`）
  - 改为使用 `useHabitWizard()` hook 从 Context 获取状态和方法
  - 使用 Context 中的 `setReminderSettings`、`toggleCardExpanded`、`prevStep`、`complete` 方法
  - 将 `anchorOptions` 静态数据移动到组件内部，简化依赖
  - **技术细节**：更新了 Context 中 `setReminderSettings` 的类型定义，支持函数更新模式 `(prev: ReminderSettings) => ReminderSettings`
  - 更新了 `page.tsx` 中的组件调用，移除了所有 props 传递
- **步骤2.5**: ✅ 已完成 - 清理旧状态管理代码：
  - 修改了 `app/habits/add/page.tsx`，大幅简化代码结构：
    - **移除的状态**：`habitName`、`habitDescription`、`selectedMicroBehaviors`、`reminderSettings`、`expandedCards`（5个 useState）
    - **移除的处理函数**：`handleNextStep`、`handleSelectBehaviors`、`handlePrevStep`、`handleComplete`、`toggleCardExpanded`（5个处理函数）
    - **移除的静态数据**：`anchorOptions`（已移动到 SetBehaviorReminders 组件内部）
    - **移除的导入**：`useState`、`useToast`、类型定义等不再需要的导入
  - 现在 `AddHabitPageContent` 只需要从 Context 获取 `currentStep` 即可
  - **代码行数**：从 129 行减少到 35 行，减少了 73% 的代码量
  - **功能验证**：TypeScript 编译通过，所有功能正常
- **步骤3.1**: ✅ 已完成 - 创建路由 Layout：
  - 新建了 `app/habits/add/layout.tsx`：
    - **挂载 Provider**：将 `HabitWizardProvider` 从 `page.tsx` 移动到 `layout.tsx`
    - **公共布局**：包含进度指示器容器、Toaster、通用容器样式
    - **子路由插槽**：渲染 `{children}` 为子页面预留位置
    - **布局结构**：`min-h-screen`、`h-[100dvh]`、`flex-1` 等响应式布局
  - 重构了 `app/habits/add/page.tsx`：
    - **移除 Provider**：不再需要包裹 `HabitWizardProvider`
    - **移除布局**：公共布局代码移至 `layout.tsx`
    - **简化结构**：直接返回当前步骤内容，代码更加简洁
    - **保持功能**：使用 `getStepContent()` 函数处理步骤渲染逻辑
  - **代码分离**：页面逻辑与布局逻辑完全分离，为路由拆分做好准备
  - **功能验证**：TypeScript 编译通过，布局正常工作
- **步骤3.2**: ✅ 已完成 - 拆分子路由：
  - 创建了三个子路由页面：
    - **step1/page.tsx**：渲染 `SetHabitInfo` 组件，设置当前步骤为1
    - **step2/page.tsx**：渲染 `SelectBehaviors` 组件，校验习惯信息，缺失时重定向到 step1
    - **step3/page.tsx**：渲染 `SetBehaviorReminders` 组件，校验习惯信息和微行为选择，缺失时重定向到相应步骤
  - **前置数据校验**：
    - step2 校验 `habitName` 和 `habitDescription`
    - step3 校验习惯信息 + 选择的微行为（`selectedMicroBehaviors.some(b => b.selected)`）
    - 缺失数据时显示加载状态并自动重定向，防止用户跳过步骤
  - **使用 Next.js 路由导航**：
    - 修改所有组件使用 `useRouter` 和 `router.push()` 进行导航
    - **SetHabitInfo**：`router.push('/habits/add/step2')`
    - **SelectBehaviors**：`router.push('/habits/add/step1')` | `router.push('/habits/add/step3')`
    - **SetBehaviorReminders**：`router.push('/habits/add/step2')`
  - **移除 Context 导航方法依赖**：
    - 组件不再使用 `nextStep`、`prevStep` Context 方法
    - Context 仍保留 `setStep` 方法用于设置当前步骤状态（用于进度显示）
  - **重构主页面**：
    - `app/habits/add/page.tsx` 改为重定向页面，自动跳转到 `step1`
    - 移除了原来的条件渲染逻辑和 `getStepContent` 函数
  - **功能验证**：TypeScript 编译通过，路由导航正常工作
- **步骤4**: ✅ 已完成 - 布局融合优化：
  - **新建 StepLayoutContext**：
    - 创建了 `app/habits/add/StepLayoutContext.tsx`，负责UI布局和导航状态管理
    - 实现了步骤配置、进度计算、按钮状态等UI层逻辑
    - 支持动态 `fixedContent` 设置，通过 `setFixedContent` 方法管理
    - 遵循单向依赖原则：依赖 `HabitWizardContext`，不反向依赖
  - **重构 layout.tsx**：
    - 融合了原 `StepLayout.tsx` 的布局逻辑到统一的 `layout.tsx` 中
    - 挂载了 `StepLayoutProvider`，形成完整的 Provider 层次结构
    - 实现了进度指示器、步骤标题、固定内容区域、滚动容器、导航按钮的统一布局
    - 支持不同步骤的布局配置（如是否需要滚动）
  - **简化步骤页面**：
    - **SetHabitInfo**：移除 `StepLayout` 包裹，只保留表单内容
    - **SelectBehaviors**：移除 `StepLayout` 包裹，使用 `setFixedContent` 设置固定内容
    - **SetBehaviorReminders**：移除 `StepLayout` 包裹，只保留卡片列表内容
  - **删除冗余文件**：
    - 删除了 `components/add-habit/StepLayout.tsx` 文件
    - 消除了双层布局结构，避免代码重复
  - **架构优化成果**：
    - **代码重复消除**：每个步骤页面不再需要手动包裹布局组件
    - **维护性提升**：布局逻辑集中管理，修改只需在一个地方进行
    - **职责分离**：业务逻辑与UI布局完全分离，符合最佳实践
    - **Context驱动**：通过Context统一管理布局状态，提供更好的开发体验
  - **功能验证**：TypeScript 编译通过，布局融合成功，所有功能正常