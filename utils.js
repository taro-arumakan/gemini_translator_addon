const properties = PropertiesService.getScriptProperties().getProperties();
const geminiApiKey = properties['GOOGLE_API_KEY'];
const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${geminiApiKey}`;

function callGemini(prompt, temperature=0) {
  const payload = {
    "contents": [
      {
        "parts": [
          {
            "text": prompt
          },
        ]
      }
    ], 
    "generationConfig":  {
      "temperature": temperature,
    },
  };

  const options = { 
    'method' : 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(geminiEndpoint, options);
  const data = JSON.parse(response);
  const content = data["candidates"][0]["content"]["parts"][0]["text"];
  return content;
}

function testGemini() {
  const prompt = `子供服のブランドのMELLOW CAPという商品のページに載せる紹介文を書いてください。
*가벼운 나일론 소재로 제작된 멜로우 캡
*다양한 컬러배색으로 포인트 아이템으로 착용 가능하며,
양옆에 매쉬소재로 되어있어 한여름에도 땀 배출에 용이함
*뒷 스트링으로 아이들 머리 둘레에 맞게 조절가능하며,
코디템으로 가볍게 쓸 수 있는 모자 아이템.

作文にあたっては、箇条書きではなく自然な構文で上記の特徴を盛り込み、余分なヘッダなどは追加しないようにしてください:
`;
  const output = callGemini(prompt);
  console.log(output);
}