# Habit Map 项目架构文档

## 项目概述

Habit Map 是一个基于福格行为模型（Fogg Behavior Model）的习惯养成应用，帮助用户通过微行为的方式建立和维持良好的习惯。项目采用现代化的 Web 技术栈，提供直观易用的用户界面和流畅的用户体验。

## 技术选型

### 核心框架与平台
- **Next.js 15** - React 全栈框架，采用 App Router 架构
- **React 19** - 用户界面构建库
- **TypeScript** - 类型安全的 JavaScript 超集
- **Node.js** - 服务端运行时环境

### UI 组件库与样式
- **shadcn/ui** - 基于 Radix UI 的组件库，提供无障碍访问支持
- **Radix UI** - 底层原语组件库，包含 28+ 组件
- **Tailwind CSS 3** - 实用工具优先的 CSS 框架
- **Lucide React** - 现代化图标库
- **CVA (Class Variance Authority)** - 组件样式变体管理
- **next-themes** - 主题切换支持

### 表单处理与验证
- **React Hook Form** - 高性能表单库
- **Zod** - TypeScript 优先的模式验证库
- **@hookform/resolvers** - Hook Form 与 Zod 集成

### 用户体验增强
- **Sonner** - Toast 通知组件
- **Embla Carousel** - 轮播图组件
- **Recharts** - 图表可视化库
- **React Day Picker** - 日期选择器
- **React Resizable Panels** - 可调整大小的面板

### 工具库
- **date-fns** - 日期处理工具库
- **clsx & tailwind-merge** - CSS 类名处理
- **cmdk** - 命令面板组件

## 架构设计

### 整体架构模式

项目采用 **前端单页应用 (SPA)** 架构，基于 Next.js App Router 的文件系统路由，遵循 **组件化开发** 和 **分层架构** 原则。

### 目录结构与模块划分

```
habit-map/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局组件
│   ├── globals.css        # 全局样式
│   └── habits/            # 习惯相关页面
│       └── add/           # 添加习惯页面
├── components/            # 可复用组件
│   ├── ui/               # shadcn/ui 组件库
│   └── theme-provider.tsx # 主题提供者
├── hooks/                # 自定义 React Hooks
│   ├── use-mobile.tsx    # 移动端检测
│   └── use-toast.ts      # Toast 通知
├── lib/                  # 工具函数库
│   └── utils.ts          # 通用工具函数
├── styles/               # 样式文件
├── public/               # 静态资源
└── docs/                 # 项目文档
```

## 核心模块说明

### 1. 路由模块 (App Router)
- **位置**: `app/` 目录
- **架构**: 基于文件系统的路由
- **特点**: 
  - 支持嵌套布局
  - 服务端组件优先
  - 自动代码分割

### 2. 组件系统
#### 2.1 基础组件库 (`components/ui/`)
- **设计系统**: 基于 shadcn/ui 设计规范
- **组件数量**: 48+ 个可复用组件
- **特点**:
  - 无障碍访问支持 (a11y)
  - 完全类型安全
  - 主题化支持
  - 响应式设计

#### 2.2 业务组件 (`components/`)
- **主题管理**: `theme-provider.tsx` 提供深浅主题切换
- **布局组件**: 页面级布局组件

### 3. 状态管理模块
- **本地状态**: React useState/useReducer
- **表单状态**: React Hook Form
- **主题状态**: next-themes
- **特点**: 去中心化状态管理，避免过度复杂性

### 4. 工具与配置模块 (`lib/`)
- **样式工具**: clsx + tailwind-merge 集成
- **类型定义**: TypeScript 类型声明
- **配置文件**: 
  - `tailwind.config.ts` - 样式系统配置
  - `components.json` - shadcn/ui 配置
  - `next.config.mjs` - Next.js 配置

### 5. 样式系统
- **CSS 框架**: Tailwind CSS
- **设计令牌**: CSS 变量驱动的设计系统
- **主题支持**: 明暗主题切换
- **颜色系统**:
  - Primary: `#69B578` (绿色 - 成长与健康)
  - Secondary: `#81ACDA` (蓝色 - 平静与专注)
  - Accent: `#E5B061` (黄色 - 活力与动机)

## 核心功能架构

### 习惯创建流程
基于多步骤表单的设计模式：

1. **步骤1 - 习惯定义**
   - 习惯名称和描述输入
   - 表单验证和状态管理

2. **步骤2 - 微行为选择**
   - 推荐算法模拟
   - 多选交互设计
   - 选择限制逻辑

3. **步骤3 - 提醒设置**
   - 自然提醒（锚点习惯）
   - 定时提醒
   - 动态表单配置

4. **步骤4 - 完成确认**
   - 习惯总结展示
   - 成功反馈设计

## 性能优化策略

### 1. 构建优化
- **代码分割**: Next.js 自动代码分割
- **Tree Shaking**: 只打包使用的代码
- **静态生成**: 适当页面使用 SSG

### 2. 运行时优化
- **组件懒加载**: React.lazy + Suspense
- **状态优化**: 避免不必要的重渲染
- **图标优化**: 按需导入 Lucide 图标

### 3. 样式优化
- **CSS 优化**: Tailwind CSS JIT 编译
- **字体优化**: Next.js 字体优化
- **主题缓存**: localStorage 主题持久化

## 可维护性设计

### 1. 代码组织
- **模块化**: 按功能模块组织代码
- **组件复用**: 统一的组件设计系统
- **类型安全**: 完整的 TypeScript 类型覆盖

### 2. 开发体验
- **配置标准化**: ESLint + Prettier 代码规范
- **路径别名**: `@/` 别名简化导入路径
- **组件文档**: 内联类型文档

### 3. 扩展性考虑
- **组件库**: 易于扩展的组件系统
- **主题系统**: 可配置的设计令牌
- **国际化预留**: 组件结构支持多语言

## 部署与环境

### 开发环境
- **包管理**: pnpm (高效的包管理器)
- **开发服务器**: Next.js dev server
- **热重载**: 快速开发反馈

### 生产环境
- **构建**: Next.js build 静态优化
- **部署**: 支持 Vercel、Netlify 等平台
- **CDN**: 静态资源 CDN 加速