# 重新实现 `habits/add` 路由功能

## 现状分析

### 一、背景

目前的多步向导采用了双层 Context、按路由拆页、本地持久化等多重抽象，虽然功能完备，但样板代码过多、维护成本高。对于只有三步、业务流程固定的场景，这种「提前优化」反而增加了阅读和修改的难度。

### 二、架构建议

- 用一个顶层组件统一管理 `currentStep` 和向导数据（标题、微行为、提醒设置等）；
- 每个步骤拆成独立子组件，仅负责渲染表单内容和更新数据；
- 顶层组件负责进度指示、按钮渲染及路由跳转（可选）。

### 三、技术选型

- **状态管理**：原生 `useState` + 最少量的 Context；
- **表单处理**：推荐 React Hook Form（配合 Zod/Yup 做 Schema 校验），减少重复校验逻辑；
- **网络请求**：直接调用 `fetch` 或者引入 SWR/React Query 做缓存和加载状态管理；
- **样式/UI**：继续使用 TailwindCSS + 可复用的 Button、ProgressIndicator 等基础组件。

### 四、实现思路

1. **数据模型设计**：
   - 定义一个包含 `title`、`description`、`behaviors`、`reminders` 的简单对象；
2. **导航和路由**：
   - 单页面：通过 `step` 渲染不同子组件；
   - 多路由：页面级 `useEffect` 做 `router.push` 和前置校验；
3. **表单校验**：
   - 每步校验集中在父组件或表单库中，通过校验结果控制"下一步"按钮的 `disabled`；
4. **进度与按钮**：
   - 根据当前 `step` 动态计算进度条比例和按钮文案，无需额外 Context；
5. **最终提交**：
   - 在最后一步点击"完成"时，将数据 `POST /api/habits`，并根据结果展示成功或错误提示；
6. **错误处理 & 加载态**：
   - 显示全局或局部的 Loading Spinner，捕获网络或校验错误并给出友好提示；

### 五、具体实施步骤

1. 新建或更新 `app/habits/add/page.tsx`（单页面）；
2. 定义顶层 `WizardData` 类型，初始化 `useState`；
3. 拆分 `Step1`、`Step2`、`Step3` 表单组件，传入 `data` 和 `setData`；
4. 实现进度指示器和导航按钮，根据校验结果控制可用性；
5. 调用后端 API 提交数据，并处理响应；
6. 根据实际复用场景，逐步抽象共享逻辑（Hook、组件）。

### 六、后续扩展

- 若向导流程增多或复用需求提升，可提炼 `useWizard` Hook；
- 抽取通用向导布局组件，并引入配置驱动；
- 国际化、多语言支持、可配置字段等。

## 新版实现

### 新版实现核心思路

- 用一个顶层组件 `NewHabitWizard` 管理 `currentStep` 和所有表单数据，子组件只负责渲染和上报各自的表单状态；
- 完全抛弃了双层 Context，避免过度抽象，结构更直观；
- `NewHabitHeader` + `ProgressIndicator` 专注于进度和标题展示；
- `NewHabitFooter` 只渲染"取消/上一步"与"下一步/完成"按钮，并通过回调把导航逻辑交给顶层；
- `SetHabitInfo`、`SelectBehaviors`、`SetReminders` 三个子组件各司其职，内聚性高；
- 子组件内部用 `useState` 管理表单字段，通过 `useEffect` 向父组件上报最新数据；
- 顶层在 `next()` 里调用 `checkStepX` 校验并合并数据，集中管理校验逻辑；
- 校验逻辑集中在顶层 `checkStep1/2/3`，通过 `toast` 统一提示；
- 使用 TailwindCSS 和已有 UI 组件（`Button`、`ProgressIndicator`）保证视觉与体验一致；

### 新版如何体现 React 的最佳实践

- 状态提升（Lifting State Up）：在 `NewHabitWizard` 中集中管理 `currentStep`、各步表单数据和最终的 `habitData`，子组件只负责本地输入和上报，避免散落的状态来源；
- 单向数据流：子组件用 `useState` 管理自身输入值，通过回调将最新值发送给父组件，父组件根据当前步数进行校验、合并数据、切换步数；
- 受控组件：所有表单控件均绑定到 state，通过事件处理函数更新，符合 Controlled Component 模式；
- 职责分离：`NewHabitHeader`、`NewHabitFooter`、`SetHabitInfo`、`SelectBehaviors`、`SetReminders` 各自职责单一，互不耦合，组件内无需关心导航或进度条；
- 优化建议：减少不必要的 `useEffect`、使用 `useCallback` memoization 回调、若表单逻辑更复杂可引入 React Hook Form + Zod，提升代码效率和可维护性。 