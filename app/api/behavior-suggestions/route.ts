import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_API_URL = 'https://fzbvjcftjcxymsogwvpj.supabase.co/functions/v1/get-habit-suggestions'

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json()
    
    // 转发请求到Supabase API
    const response = await fetch(SUPABASE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `API请求失败: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // 返回数据，Next.js会自动设置CORS头
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('代理API请求失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}