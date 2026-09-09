export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, tone } = req.body;

    if (!topic || !tone) {
      return res.status(400).json({ error: 'Konu ve ton gerekli' });
    }

    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

    if (!CLAUDE_API_KEY || !HEYGEN_API_KEY) {
      return res.status(500).json({ error: 'API keyler set edilmedi' });
    }

    // STEP 1: Claude ile script olustur
    const scriptResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `Turkce biyoloji ogretmeni icin 60 saniye Reel scripti yaz. Konu: ${topic}. Ton: ${tone}. Kurallar: Guncel dogru bilgi, hook ilk 3 saniyede, dil basit, kisa cumleler. Sadece script yaz.`,
          },
        ],
      }),
    });

    if (!scriptResponse.ok) {
      const errorData = await scriptResponse.json();
      return res.status(scriptResponse.status).json({
        error: 'Claude API hatasi',
        details: errorData.error?.message,
      });
    }

    const scriptData = await scriptResponse.json();
    const script = scriptData.content[0].text;

    // STEP 2: HeyGen'de video yap
    const videoResponse = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'x-api-key': HEYGEN_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        caption: true,
        dimension: { width: 720, height: 1280 },
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: 'Daisy-inskirt-20220818',
              avatar_style: 'normal',
            },
            voice: {
              type: 'text',
              input_text: script,
              voice_id: 'ff5f8a2c26644b0f8f8d1a6a4c7c4e0f',
            },
          },
        ],
      }),
    });

    if (!videoResponse.ok) {
      const errorData = await videoResponse.json();
      return res.status(videoResponse.status).json({
        error: 'HeyGen API hatasi',
        details: errorData,
      });
    }

    const videoData = await videoResponse.json();

    res.status(200).json({
      success: true,
      message: 'Video olusturuluyor',
      script: script,
      videoId: videoData.data?.video_id || 'pending',
      heygenResponse: videoData.data,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server hatasi',
      message: error.message,
    });
  }
}
