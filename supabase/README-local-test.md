# 本地测试习惯建议生成功能

## 安装依赖

在项目根目录运行以下命令安装所需依赖：

```bash
npm install openai dotenv
# 或者使用 pnpm
pnpm add openai dotenv
```

## 环境变量配置

1. 在项目根目录创建 `.env` 文件（如果还没有的话）
2. 添加以下环境变量：

```
SILICONFLOW_API_KEY=your_siliconflow_api_key_here
```

请将 `your_siliconflow_api_key_here` 替换为你的实际 SiliconFlow API 密钥。

## 运行测试

在项目根目录运行：

```bash
node supabase/get-habit-suggestions-local.js
```

## 功能说明

- 该脚本会自动测试一个示例习惯："每天运动30分钟"
- 会显示 API 调用的耗时统计
- 会输出生成的 10 条微行为建议
- 包含详细的日志记录，方便调试

## 自定义测试

你也可以修改 `testHabitSuggestions` 函数中的 `testHabit` 对象来测试不同的习惯：

```javascript
const testHabit = {
  title: "你的习惯标题",
  description: "你的习惯描述"
};
```

## 导入使用

该脚本也可以作为模块导入到其他文件中使用：

```javascript
import { getHabitSuggestions } from './supabase/get-habit-suggestions-local.js';

const result = await getHabitSuggestions({
  title: "每天读书",
  description: "提升知识水平"
});

console.log(`耗时: ${result.duration}ms`);
console.log('建议:', result.suggestions);
```