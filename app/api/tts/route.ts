const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'ErXwobaYiN019PkySvjV'; // Antoni - warm professional voice

export async function POST(request: Request) {
  if (!ELEVENLABS_API_KEY) {
    return new Response(JSON.stringify({ error: 'TTS not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { text } = await request.json();

  if (!text || text.length > 800) {
    return new Response(JSON.stringify({ error: 'Text too long or empty' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Strip markdown for cleaner speech
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>-]/g, '')
    .trim();

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_v3',
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.82,
          style: 0.4,
          use_speaker_boost: true,
        },
        output_format: 'mp3_44100_192',
      }),
    }
  );

  if (!response.ok) {
    // Try v2 fallback
    const fallbackResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.82,
          },
        }),
      }
    );

    if (!fallbackResponse.ok) {
      return new Response(JSON.stringify({ error: 'TTS failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const audioBuffer = await fallbackResponse.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  const audioBuffer = await response.arrayBuffer();
  return new Response(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
