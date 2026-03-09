export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    // 1. 获取前端传过来的图片base64和参数
    const { imageUrl } = await request.json();
    
    // 2. 配置豆包API信息（替换成你的Key！）
    const API_KEY = '4f6e2c28-389d-4fbe-9032-fe136fd06c67'; // 替换为你的火山方舟API Key
    const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
    const MODEL_ID = 'doubao-seedream-5-0-260128'; // 正确的图生图模型ID

    // 3. 构造图生图请求参数（适配LinkedIn职业头像）
    const requestBody = {
      "model": MODEL_ID,
      "prompt": "保持人物面部特征和姿势不变，生成超写实4K LinkedIn职业头像，白衬衫，专业影棚柔光，浅灰色简约商务背景，人物面部清晰自然，1:1比例，符合领英职场规范，西方职场风格",
      "image": imageUrl, // 直接传base64的图片URL
      "size": "4K",
      "output_format": "png",
      "watermark": false
    };

    // 4. 调用豆包图生图API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // 5. 处理API响应
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // 6. 返回生成的图片URL给前端
    return new Response(JSON.stringify({
      success: true,
      imageUrl: data.data[0].url
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // 解决跨域
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
    });

  } catch (error) {
    // 错误处理
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}
