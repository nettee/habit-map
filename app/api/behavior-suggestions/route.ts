import { NextRequest } from 'next/server'

// OpenAI 兼容接口配置
const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const MODEL_NAME = 'Pro/deepseek-ai/DeepSeek-V3'
// const MODEL_NAME = 'Pro/Qwen/Qwen2.5-7B-Instruct'

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const { habit } = await request.json()
    
    if (!habit || !habit.title) {
      return new Response(
        JSON.stringify({ error: '请求参数错误：缺少习惯信息' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: '服务器配置错误：缺少 API 密钥' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // 创建SSE响应流
    const encoder = new TextEncoder()
    let controller: ReadableStreamDefaultController<Uint8Array>

    const stream = new ReadableStream({
      start(ctrl) {
        controller = ctrl
      }
    })

    // 发送SSE数据的辅助函数
    const sendSSEData = (data: any) => {
      const message = `data: ${JSON.stringify(data)}\n\n`
      controller.enqueue(encoder.encode(message))
    }

    // 异步处理LLM请求
    const processLLMRequest = async () => {
      try {
        const systemPrompt = `
        你是一个福格行为模型专家。
        `

        const userPrompt = `
        请根据用户想养成的目标习惯，根据福格行为模型中的 Ability，为其设计 10 个简单易行的微行为。这 10 个微行为要足够发散，好让用户进行挑选。

        注意：输出格式为 XML 格式，每个微行为用 <behavior> 标签包装，包含 title 和 description 两个字段。严格按照示例输出格式输出。

        示例输入：
        习惯内容：每天阅读30分钟
        习惯描述：更好地理解这个世界。

        示例输出：
        <behaviors>
          <behavior>
            <title>只读一句话</title>
            <description>打开书，只要求自己读完一个完整的句子，就算成功</description>
          </behavior>
          <behavior>
            <title>标记一个重点</title>
            <description>用笔或便签标记一个有趣的内容</description>
          </behavior>
        </behaviors>

        用户的目标习惯：
        习惯内容：${habit.title}
        ${habit.description ? `习惯描述：${habit.description}` : ''}
        `

        console.log(`[${new Date().toISOString()}] 开始调用 LLM API (stream模式)，模型：${MODEL_NAME}`)
        
        // 调用 OpenAI 兼容接口，启用stream模式
        const response = await fetch(`${OPENAI_API_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            stream: true, // 启用流式响应
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
          })
        })

        console.log(`[${new Date().toISOString()}] LLM API 响应: status=${response.status}, content-type=${response.headers.get('content-type')}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('LLM API 请求失败:', response.status, errorText)
          sendSSEData({ 
            type: 'error', 
            message: `LLM API 请求失败: ${response.status} ${response.statusText}` 
          })
          controller.close()
          return
        }

        if (!response.body) {
          sendSSEData({ type: 'error', message: 'LLM API 响应体为空' })
          controller.close()
          return
        }

        // 处理流式响应
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = '' // 存储未完成的数据
        let behaviorCount = 0
        const preview = (s: string, n = 160) => s.replace(/\n/g, '\\n').slice(0, n)
        
        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              console.log(`[${new Date().toISOString()}] 流式响应完成，共解析 ${behaviorCount} 个建议`)
              sendSSEData({ type: 'complete', count: behaviorCount })
              controller.close()
              break
            }

            // 解析SSE数据
            const chunk = decoder.decode(value, { stream: true })
            console.log(`[${new Date().toISOString()}] [SSE] 收到chunk: bytes=${value?.byteLength ?? 'n/a'}, textLen=${chunk.length}, preview="${preview(chunk)}"`)
            const lines = chunk.split('\n')
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                
                if (data === '[DONE]') {
                  console.log(`[${new Date().toISOString()}] [SSE] 收到 [DONE] 标记`)
                  continue
                }
                
                try {
                  console.log(`[${new Date().toISOString()}] [SSE] data行长度=${data.length}, preview="${preview(data)}"`)
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  
                  if (content) {
                    console.log(`[${new Date().toISOString()}] [SSE] 追加content长度=${content.length}, preview="${preview(content)}"`)
                    buffer += content
                    
                    // 尝试解析完整的behavior标签
                    const behaviorRegex = /<behavior>\s*<title>([\s\S]*?)<\/title>\s*<description>([\s\S]*?)<\/description>\s*<\/behavior>/gi
                    let match
                    let lastIndex = 0
                    
                    while ((match = behaviorRegex.exec(buffer)) !== null) {
                      const title = match[1]?.trim()
                      const description = match[2]?.trim()
                      
                      if (title && description) {
                        behaviorCount++
                        console.log(`解析到第 ${behaviorCount} 个建议: ${title}`)
                        
                        // 立即发送这个建议
                        sendSSEData({
                          type: 'suggestion',
                          data: {
                            title: title,
                            description: description
                          }
                        })
                        
                        lastIndex = match.index + match[0].length
                      }
                    }
                    
                    // 保留未匹配的部分到buffer中
                    if (lastIndex > 0) {
                      console.log(`[${new Date().toISOString()}] [SSE] 已消费buffer至索引 ${lastIndex}，剩余长度=${buffer.length - lastIndex}`)
                      buffer = buffer.substring(lastIndex)
                    }
                  }
                } catch (parseError) {
                  console.warn(`[${new Date().toISOString()}] [SSE] 解析chunk失败:`, parseError)
                  console.warn(`[${new Date().toISOString()}] [SSE] 原始data预览: "${preview(line)}"`)
                  // 继续处理，不中断流
                }
              }
            }
          }
        } catch (streamError) {
          console.error('处理流式响应失败:', streamError)
          sendSSEData({ type: 'error', message: '处理流式响应失败' })
          controller.close()
        }
        
      } catch (error) {
        console.error('LLM请求处理失败:', error)
        sendSSEData({ type: 'error', message: '服务器内部错误' })
        controller.close()
      }
    }

    // 启动异步处理
    processLLMRequest()

    // 返回SSE响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('API 请求失败:', error)
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}