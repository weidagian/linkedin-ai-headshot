export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { imageUrl } = await request.json();
  const API_KEY = '4f6e2c28-389d-4fbe-9032-fe136fd06c67'; // 替换为你的豆包API Key
  const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses';

  const prompt = `Generate a hyper-realistic 4K LinkedIn professional headshot, keep the person's facial features unchanged, white shirt, professional studio soft light, light gray minimalist business background, clear and natural facial features, 1:1 ratio, in line with LinkedIn professional standards, Western workplace style`;

  const requestBody = {
    "model": "Doubao-Seedream-5.0-lite",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_image",
            "image_url": imageUrl
          },
          {
            "type": "input_text",
            "text": prompt
          }
        ]
      }
    ]
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
