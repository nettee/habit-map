# Habit Map 品牌色彩主题改造计划

## 项目背景

当前项目中存在大量硬编码的 hex 颜色值（如 `bg-[#69B578]`、`text-[#292F36]` 等），需要统一管理并支持深浅主题切换。

## 设计色彩规范

基于提供的配色设计，定义以下色彩系统：

| 角色 | 颜色名称 | HEX 色值 | HSL 色值 | 用途说明 |
|------|----------|----------|----------|----------|
| 核心主绿 | Primary Green | #69B578 | 132 34% 56% | 品牌主色，代表成长、积极 |
| 核心强调色 | Primary Accent | #E5B061 | 43 71% 62% | 行动召唤 (CTA)，庆祝，高亮 |
| 主要背景色 | Main Background | #EBF2FA | 210 59% 95% | 大部分页面背景，卡片间隙 |
| 主要文本色 | Primary Text | #292F36 | 210 13% 19% | 标题、正文等主要信息 |
| 辅助/信息浅蓝 | Secondary Blue | #81ACDA | 210 55% 68% | 辅助信息，次要交互，柔和引导 |
| 次要文本 | Secondary Text | #5A6872 | 210 10% 38% | 辅助文字，描述，时间戳 |
| 分隔线 | Divider | #D8DEE9 | 210 24% 85% | 列表分隔，卡片边框 |

## 技术方案

采用 **CSS 变量 + Tailwind** 的组合方案：

### 优势
- 支持深浅主题动态切换
- 语义化的颜色命名
- 运行时可调整颜色
- 与现有 `next-themes` 系统兼容

### 颜色分类体系

#### 1. 品牌色系 (brand)
- `brand-primary`: 核心主绿色
- `brand-accent`: 核心强调色  
- `brand-secondary`: 辅助信息蓝色

#### 2. 文本色系 (text)
- `text-primary`: 主要文本色
- `text-secondary`: 次要文本色

#### 3. 表面色系 (surface)
- `surface-main`: 主要背景色
- `surface-divider`: 分隔线颜色

## 修改步骤

### 步骤 1: 更新 Tailwind 配置

**文件**: `tailwind.config.ts`

**修改内容**:
1. 将现有的硬编码颜色值改为 CSS 变量引用
2. 添加自定义品牌色系配置
3. 保持与 shadcn/ui 的兼容性

**新增颜色类**:
```typescript
colors: {
  // 现有的 shadcn/ui 颜色保持不变
  // ...
  
  // 新增自定义品牌色系
  brand: {
    primary: "hsl(var(--brand-primary))",
    accent: "hsl(var(--brand-accent))",
    secondary: "hsl(var(--brand-secondary))",
  },
  text: {
    primary: "hsl(var(--text-primary))",
    secondary: "hsl(var(--text-secondary))",
  },
  surface: {
    main: "hsl(var(--surface-main))",
    divider: "hsl(var(--surface-divider))",
  },
}
```

### 步骤 2: 定义 CSS 变量

**文件**: `app/globals.css`

**修改内容**:
1. 在 `:root` 中添加浅色主题的颜色变量
2. 在 `.dark` 中添加深色主题的颜色变量
3. 使用 HSL 格式以便更好地调整亮度

**浅色主题变量**:
```css
:root {
  /* 品牌色系 */
  --brand-primary: 132 34% 56%;      /* #69B578 */
  --brand-accent: 43 71% 62%;        /* #E5B061 */
  --brand-secondary: 210 55% 68%;    /* #81ACDA */
  
  /* 文本色系 */
  --text-primary: 210 13% 19%;       /* #292F36 */
  --text-secondary: 210 10% 38%;     /* #5A6872 */
  
  /* 表面色系 */
  --surface-main: 210 59% 95%;       /* #EBF2FA */
  --surface-divider: 210 24% 85%;    /* #D8DEE9 */
}
```

**深色主题变量**:
```css
.dark {
  /* 品牌色系 - 降低亮度以适应深色背景 */
  --brand-primary: 132 34% 46%;      /* 降低 10% 亮度 */
  --brand-accent: 43 71% 52%;        /* 降低 10% 亮度 */
  --brand-secondary: 210 54% 57%;    /* 降低 10% 亮度 */
  
  /* 文本色系 - 反转为浅色 */
  --text-primary: 0 0% 95%;          /* 浅色文本 */
  --text-secondary: 0 0% 70%;        /* 中等浅色文本 */
  
  /* 表面色系 - 深色背景 */
  --surface-main: 210 15% 8%;        /* 深色背景 */
  --surface-divider: 210 15% 15%;    /* 深色分隔线 */
}
```

### 步骤 3: 更新组件代码

**文件**: `app/habits/add/page.tsx`

**修改策略**:
1. 逐步替换硬编码颜色
2. 使用语义化的颜色类名
3. 保持视觉效果一致性

**颜色映射表**:

| 原硬编码颜色 | 新颜色类名 | 用途 |
|-------------|-----------|------|
| `bg-[#69B578]` | `bg-brand-primary` | 主要按钮、成功状态 |
| `hover:bg-[#5a9a68]` | `hover:bg-brand-primary/80` | 主要按钮悬停 |
| `bg-[#E5B061]` | `bg-brand-accent` | 强调按钮、完成状态 |
| `hover:bg-[#d49d4f]` | `hover:bg-brand-accent/80` | 强调按钮悬停 |
| `bg-[#81ACDA]` | `bg-brand-secondary` | 信息提示、次要元素 |
| `bg-[#EBF2FA]` | `bg-surface-main` | 页面背景、卡片背景 |
| `border-[#D8DEE9]` | `border-surface-divider` | 卡片边框、分隔线 |
| `text-[#292F36]` | `text-text-primary` | 主要文本 |
| `text-[#5A6872]` | `text-text-secondary` | 次要文本、描述 |

### 步骤 4: 验证和测试

1. **功能测试**: 确保所有颜色正确显示
2. **主题切换测试**: 验证深浅主题切换效果
3. **视觉回归测试**: 确保改造后视觉效果与原设计一致
4. **响应式测试**: 确保在不同设备上显示正常

## 实施注意事项

### 1. 兼容性考虑
- 保持与现有 shadcn/ui 组件的兼容性
- 不影响其他页面的现有样式

### 2. 渐进式迁移
- 可以分模块逐步替换，不需要一次性全部修改
- 优先替换使用频率高的颜色

### 3. 命名规范
- 使用语义化命名而非颜色名称（如 `primary` 而非 `green`）
- 保持命名的一致性和可预测性

### 4. 文档维护
- 更新组件文档中的颜色使用说明
- 建立颜色使用规范指南

## 预期效果

改造完成后将实现：

1. **统一的颜色管理**: 所有颜色在配置文件中统一定义
2. **主题切换支持**: 完整的深浅主题切换功能
3. **更好的可维护性**: 语义化命名，易于理解和修改
4. **设计系统化**: 建立完整的颜色设计系统
5. **未来扩展性**: 支持更多主题变体和个性化设置

## 实施进度记录

### 步骤 1: 更新 Tailwind 配置
- [x] 1.1 将现有的硬编码颜色值改为 CSS 变量引用
- [x] 1.2 添加自定义品牌色系配置
- [x] 1.3 保持与 shadcn/ui 的兼容性
- [x] 1.4 验证配置更新

### 步骤 2: 定义 CSS 变量
- [x] 2.1 在 :root 中添加浅色主题的颜色变量
- [x] 2.2 在 .dark 中添加深色主题的颜色变量
- [x] 2.3 使用 HSL 格式定义所有颜色
- [x] 2.4 验证变量定义

### 步骤 3: 更新组件代码
- [x] 3.1 替换 app/habits/add/page.tsx 中的硬编码颜色
- [x] 3.2 验证组件视觉效果
- [x] 3.3 测试深色模式切换
- [x] 3.4 代码审查和优化

### 步骤 4: 验证和测试
- [ ] 4.1 功能测试
- [ ] 4.2 主题切换测试
- [ ] 4.3 视觉回归测试
- [ ] 4.4 响应式测试
- [ ] 4.5 性能测试