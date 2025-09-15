// 测试SSE流式API的Node.js脚本
const { spawn } = require('child_process');

// 测试数据
const testData = {
  habit: {
    title: "每天阅读30分钟",
    description: "更好地理解这个世界"
  }
};

// 方法1：使用fetch测试（需要启动dev server）
async function testWithFetch() {
  console.log('🚀 开始测试SSE流式API...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/behavior-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    console.log('✅ 连接成功，开始接收流式数据...\n');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let suggestionCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('\n🏁 流式响应结束');
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          
          if (!data) continue;

          try {
            const event = JSON.parse(data);
            
            switch (event.type) {
              case 'suggestion':
                suggestionCount++;
                console.log(`📝 建议 ${suggestionCount}:`);
                console.log(`   标题: ${event.data.title}`);
                console.log(`   描述: ${event.data.description}\n`);
                break;
                
              case 'complete':
                console.log(`✨ 完成！共收到 ${event.count} 个建议\n`);
                break;
                
              case 'error':
                console.error(`❌ 错误: ${event.message}\n`);
                break;
            }
          } catch (parseError) {
            console.warn('⚠️  解析事件失败:', parseError.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 方法2：使用curl测试
function testWithCurl() {
  console.log('🚀 使用curl测试SSE API...\n');
  
  const curl = spawn('curl', [
    '-X', 'POST',
    'http://localhost:3000/api/behavior-suggestions',
    '-H', 'Content-Type: application/json',
    '-d', JSON.stringify(testData),
    '--no-buffer',
    '-v'
  ]);

  curl.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('📦 收到数据:');
    console.log(output);
    console.log('---');
  });

  curl.stderr.on('data', (data) => {
    const output = data.toString();
    if (output.includes('data:')) {
      console.log('📡 SSE事件:', output);
    }
  });

  curl.on('close', (code) => {
    console.log(`\n🏁 curl进程结束，退出码: ${code}`);
  });
}

// 主函数
async function main() {
  const method = process.argv[2] || 'fetch';
  
  console.log('='.repeat(50));
  console.log('🧪 SSE流式API测试工具');
  console.log('='.repeat(50));
  console.log(`📋 测试数据: ${JSON.stringify(testData, null, 2)}`);
  console.log('='.repeat(50));
  
  if (method === 'curl') {
    testWithCurl();
  } else {
    await testWithFetch();
  }
}

// 检查是否在Node.js环境中
if (typeof fetch === 'undefined') {
  // Node.js 18+ 有内置fetch，否则需要polyfill
  console.log('⚠️  当前Node.js版本可能不支持fetch，请使用curl方法:');
  console.log('node test-sse.js curl');
  console.log('或升级到Node.js 18+');
} else {
  main().catch(console.error);
}
