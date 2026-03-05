'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Wat doet Rink Group?',
  'Vertel over AetherLink',
  'Wat is TaigaSchool?',
  'Hoe kan ik samenwerken?',
];

export function AetherBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pulse animation for the orb
  useEffect(() => {
    const interval = setInterval(() => setPulsePhase(p => p + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Chat failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

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
            if (event.text) {
              fullResponse += event.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: fullResponse };
                return updated;
              });
            }
          } catch {
            // skip
          }
        }
      }

      // Auto-speak response
      if (fullResponse && speaking) {
        speakText(fullResponse);
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Er ging iets mis. Probeer het opnieuw of mail info@rinkgroup.io.',
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }, [messages, streaming, speaking]);

  const speakText = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 800) }),
      });

      if (!response.ok) return;

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch {
      // TTS failed silently
    }
  };

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'nl-NL';
    recognition.continuous = false;
    recognition.interimResults = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        setListening(false);
        sendMessage(transcript);
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating orb button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[70] w-16 h-16 rounded-full flex items-center justify-center group"
            style={{ cursor: 'pointer' }}
            aria-label="Open AETHER chat"
          >
            {/* Animated glow rings */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border border-rose-gold/30"
            />
            <motion.div
              animate={{
                scale: [1, 1.7, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute inset-0 rounded-full border border-rose-gold/20"
            />

            {/* Core orb */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-rose-gold via-rose-gold-light to-rose-gold-bright shadow-[0_0_40px_rgba(197,149,107,0.4)] group-hover:shadow-[0_0_60px_rgba(197,149,107,0.6)] transition-shadow duration-500 flex items-center justify-center">
              {/* Inner glow */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              {/* Icon */}
              <svg className="w-7 h-7 text-navy-deep relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l4.93-1.38A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12h.01M12 12h.01M16 12h.01" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Label */}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute right-20 whitespace-nowrap font-[family-name:var(--font-sans)] text-xs tracking-[0.15em] uppercase text-rose-gold/60 hidden md:block"
            >
              Spreek met AETHER
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 z-[70] w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5),0_0_40px_rgba(197,149,107,0.08)]"
            style={{ cursor: 'auto' }}
          >
            {/* Header */}
            <div className="relative px-5 py-4 border-b border-rose-gold/10"
              style={{
                background: 'linear-gradient(135deg, rgba(20,34,66,0.98), rgba(8,14,26,0.98))',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Breathing orb */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 15px rgba(197,149,107,0.3)',
                        '0 0 25px rgba(197,149,107,0.5)',
                        '0 0 15px rgba(197,149,107,0.3)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-gold to-rose-gold-bright flex items-center justify-center"
                  >
                    <span className="text-navy-deep text-sm font-bold font-[family-name:var(--font-display)]">A</span>
                  </motion.div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-base text-rose-gold-light tracking-wider">
                      AETHER
                    </h3>
                    <p className="font-[family-name:var(--font-sans)] text-[9px] tracking-[0.2em] uppercase text-cream/30">
                      Rink Group AI
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice toggle */}
                  <button
                    onClick={() => setSpeaking(!speaking)}
                    className={`p-2 rounded-lg transition-colors ${speaking ? 'bg-rose-gold/20 text-rose-gold' : 'text-cream/30 hover:text-cream/60'}`}
                    aria-label={speaking ? 'Zet spraak uit' : 'Zet spraak aan'}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {speaking ? (
                        <>
                          <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      ) : (
                        <>
                          <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M23 9l-6 6M17 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                  </button>

                  {/* Close button */}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 text-cream/30 hover:text-cream/60 transition-colors"
                    aria-label="Sluit chat"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              style={{
                background: 'linear-gradient(180deg, #080E1A 0%, #0F1B33 50%, #080E1A 100%)',
              }}
            >
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-navy/50 border border-rose-gold/[0.08] rounded-xl px-4 py-3">
                    <p className="font-[family-name:var(--font-serif)] text-sm text-cream/60 leading-relaxed">
                      Welkom bij <strong className="text-rose-gold-light">Rink Group</strong>. Ik ben <strong className="text-rose-gold-light">AETHER</strong>, uw AI-adviseur. Stel mij een vraag over onze ventures, filosofie of samenwerkingsmogelijkheden.
                    </p>
                  </div>

                  {/* Suggestions */}
                  <div className="grid grid-cols-2 gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        onClick={() => sendMessage(s)}
                        className="text-left px-3 py-2.5 rounded-lg border border-rose-gold/[0.08] hover:border-rose-gold/20 hover:bg-rose-gold/[0.03] transition-all duration-300 group"
                      >
                        <span className="font-[family-name:var(--font-sans)] text-[11px] text-cream/40 group-hover:text-cream/70 transition-colors leading-snug block">
                          {s}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Chat messages */}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-rose-gold/15 border border-rose-gold/20'
                        : 'bg-navy/50 border border-rose-gold/[0.06]'
                    }`}
                  >
                    <p
                      className={`font-[family-name:var(--font-serif)] text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user' ? 'text-cream/80' : 'text-cream/60'
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-rose-gold-light">$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Streaming indicator */}
              {streaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start">
                  <div className="bg-navy/50 border border-rose-gold/[0.06] rounded-xl px-4 py-3 flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-gold/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-gold/40" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-gold/40" style={{ animationDelay: '0.4s' }} />
                    </motion.div>
                    <span className="font-[family-name:var(--font-sans)] text-[10px] text-cream/25">AETHER denkt...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div
              className="px-4 py-3 border-t border-rose-gold/10"
              style={{
                background: 'linear-gradient(135deg, rgba(20,34,66,0.98), rgba(8,14,26,0.98))',
              }}
            >
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {/* Voice input button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    listening
                      ? 'bg-rose-gold/30 text-rose-gold shadow-[0_0_20px_rgba(197,149,107,0.3)]'
                      : 'bg-navy-light/50 text-cream/30 hover:text-cream/60 hover:bg-navy-light'
                  }`}
                  aria-label={listening ? 'Stop luisteren' : 'Spreek'}
                >
                  {listening ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="9" y="2" width="6" height="14" rx="3" />
                        <path d="M5 11a7 7 0 0014 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 19v3M8 22h8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="9" y="2" width="6" height="14" rx="3" />
                      <path d="M5 11a7 7 0 0014 0" strokeLinecap="round" />
                      <path d="M12 19v3M8 22h8" strokeLinecap="round" />
                    </svg>
                  )}
                </button>

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={listening ? 'Luisteren...' : 'Stel uw vraag...'}
                  disabled={streaming}
                  className="flex-1 bg-navy-light/30 border border-rose-gold/[0.08] rounded-lg px-4 py-2.5 font-[family-name:var(--font-sans)] text-sm text-cream/80 placeholder:text-cream/20 focus:outline-none focus:border-rose-gold/25 transition-colors disabled:opacity-50"
                  style={{ cursor: 'text' }}
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-gold/20 hover:bg-rose-gold/30 disabled:opacity-30 disabled:hover:bg-rose-gold/20 flex items-center justify-center transition-all duration-300"
                >
                  <svg className="w-4 h-4 text-rose-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-center mt-2">
                <span className="font-[family-name:var(--font-sans)] text-[8px] tracking-[0.2em] uppercase text-cream/10">
                  Powered by AetherLink.ai
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
