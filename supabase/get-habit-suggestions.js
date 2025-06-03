// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { OpenAI } from "npm:openai@4.8.0";
const openai = new OpenAI({
  baseURL: 'https://api.siliconflow.cn/v1',
  apiKey: Deno.env.get('SILICONFLOW_API_KEY')
});
Deno.serve(async (req)=>{
  const { habit } = await req.json();
  const systemPrompt = `
  你是一个习惯拆分专家，擅长根据用户输入的习惯内容与习惯描述，生成该习惯拆分为微行为的建议。
  `;
  const userPrompt = `
  请根据福格行为模型原理，分析用户输入的习惯内容与习惯描述，生成10条将该习惯拆分为微行为的建议。
  注意：输出格式为 JSON 数组，每个元素为一个对象，对象包含 title 和 description 两个字段。严格按照示例输出格式输出，禁止输出任何其他内容。

  示例输入：
  习惯内容：每天阅读30分钟；习惯描述：更好地理解这个世界。

  示例输出：
  [
    {
      title: "打开书本",
      description: "每天只需要打开一本书，翻到任意一页"
    },
    {
      title: "阅读一段话",
      description: "读完一个段落就算完成"
    },
    {
      title: "阅读2分钟",
      description: "设置计时器，专注阅读2分钟"
    },
    {
      title: "准备阅读环境",
      description: "找一个安静的地方，准备好书本和水杯"
    },
    {
      title: "记录一个想法",
      description: "阅读后写下一句话的感受或想法"
    },
    {
      title: "朗读一句话",
      description: "大声朗读书中的任意一句话"
    },
    {
      title: "标记一个重点",
      description: "用笔或便签标记一个有趣的内容"
    },
    {
      title: "翻阅目录",
      description: "浏览书本目录，选择感兴趣的章节"
    },
    {
      title: "设置阅读提醒",
      description: "在手机上设置明天的阅读提醒"
    },
    {
      title: "分享阅读计划",
      description: "告诉朋友或家人你今天的阅读计划"
    },
  ]

  用户输入的习惯内容：${habit.title}
  用户输入的习惯描述：${habit.description}
  `;

  // 记录大模型请求开始时间
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] 开始调用大模型 API`);
  
  const response = await openai.chat.completions.create({
    model: "Pro/deepseek-ai/DeepSeek-V3",
    response_format: {
      "type": "json_object"
    },
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ]
  });

  // 记录大模型请求结束时间并计算耗时
  const endTime = Date.now();
  const duration = endTime - startTime;
  console.log(`[${new Date().toISOString()}] 大模型 API 调用完成，耗时: ${duration}ms`);

  const result = response.choices[0].message.content;
  console.log(result);
  const suggestions = JSON.parse(result);
  return new Response(JSON.stringify({
    suggestions: suggestions
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  });
});