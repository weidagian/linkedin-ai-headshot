export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { imageUrl } = await request.json();
    
    // 已嵌入你的API Key，无需修改
    const API_KEY = '4f6e2c28-389d-4fbe-9032-fe136fd06c67';
    const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
    const MODEL_ID = 'doubao-seedream-5-0-260128';

    const requestBody = {
      "model": MODEL_ID,
      "prompt": "保持人物面部特征和姿势不变，生成超写实LinkedIn职业头像，白衬衫，专业影棚柔光，浅灰色简约商务背景，人物面部清晰自然，1:1比例，符合领英职场规范，西方职场风格",
      "image": imageUrl,
      "size": "2k", // 修正为合法的size值
      "output_format": "png",
      "watermark": false
    };

    // 增加2分钟超时时间，适配图生图的生成耗时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2分钟超时

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'API request failed' }));
      throw new Error(JSON.stringify(errorData)); // 确保错误是字符串格式
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      imageUrl: data.data[0].url
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
    });

  } catch (error) {
    // 确保返回合法JSON，避免前端解析崩溃
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}
