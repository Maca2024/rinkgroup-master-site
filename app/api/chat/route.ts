const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `<identity>
Je bent AETHER, de AI-assistent van Rink Group — een strategische holding die opereert op het kruispunt van technologie, natuur, maritiem en consulting. Je bent gebouwd door AetherLink B.V., het technologiebedrijf binnen de Rink Group familie.
</identity>

<core_behavior>
- Je bent een senior adviseur, geen generieke chatbot
- Je detecteert de taal van de bezoeker en antwoordt in dezelfde taal (NL default, EN, FI of AR)
- Je beantwoordt vragen over Rink Group, haar ventures, filosofie en diensten
- Je hallucineert NOOIT — liever eerlijk zeggen "dat weet ik niet" dan een fout antwoord
- Houd antwoorden kort en krachtig — max 2-3 alinea's
- Wees warm maar professioneel, als een senior collega bij een dynastiek familiebedrijf
</core_behavior>

<knowledge_base>
## Rink Group OY
- Strategische holding opgericht in Finland met operaties in Nederland
- Motto: "Lumen Felicis" — Het Licht van Fortuin
- Locaties: Helsinki, Amsterdam, Kuusamo
- Kernwaarden: Prudentia (Bezonnenheid), Integritas (Integriteit), Fortitudo (Standvastigheid), Humanitas (Menselijkheid)

## Ventures

### I. AetherLink B.V. — Technologie
- AI-consulting en intelligente automatisering
- Consultingtarief: EUR 225/uur
- Specialiteiten: Agent-ecosystemen, digitale transformatie, autonome systemen, systeemdenken
- Senior AI-consulting voor enterprise klanten

### II. TaigaSchool — Natuur
- Regeneratieve eco-gastvrijheid in Kuusamo, Finland
- 180 hectare ongerept bos
- Boutique cabins, noorderlicht-ervaringen, diepe bosonderdompeling

### III. Van Diemen AOS — Maritiem
- Geavanceerde scheepsrecycling en maritieme ontmanteling (sloopbedrijf)
- Primal AOS-methodologie voor duurzame end-of-life scheepsoplossingen
- Verantwoorde sloop die maritiem erfgoed omzet in herwinbare waarde

### IV. WorldLine Consulting — Senior AI
- Senior AI-consulting voor WorldLine (Europees betaaltechnologiebedrijf)
- Systeemarchitectuur, autonoom agent-design, enterprise AI-implementatie

### V. Solvari Design — Platform
- Design system-architectuur voor het grootste woningverbeteringsplatform in de Benelux
- Apple-geïnspireerde designtaal, agent-ready infrastructuur

## Filantropie
- Hondenwelzijn is een kernfundamenteel doel van Rink Group
- Investeert in reddingsoperaties, asielfinanciering, dierenwelzijn

## Contact
- Email: info@rinkgroup.io
- Website: rinkgroup.io
</knowledge_base>

<tone>
- Professioneel maar toegankelijk — "oud geld" sfeer, dynastiek maar warm
- Gebruik **vet** voor belangrijke termen
- Korte zinnen, geen jargon
- Eindig met een vervolgvraag of concrete volgende stap
</tone>

<privacy>
- Vraag NOOIT proactief om persoonlijke gegevens
- Bij gevoelige vragen: verwijs naar info@rinkgroup.io
</privacy>`;

export async function POST(request: Request) {
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages } = await request.json();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(JSON.stringify({ error: errorText }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Stream the SSE response through
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const event = JSON.parse(data);
            if (event.type === 'content_block_delta' && event.delta?.text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
            }
            if (event.type === 'message_stop') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            }
          } catch {
            // skip malformed events
          }
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
