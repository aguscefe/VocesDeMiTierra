import { useMemo, useState } from "react";
import { speakNaturally } from "../utils/speech";

type Direction = "es-maya" | "maya-es";
type Message = { from: "user" | "assistant"; text: string };

function translate(_value: string, _direction: Direction) {
 return "Contenido en maya pendiente de validación. No hay traducciones autorizadas disponibles todavía.";
}

export default function SpeechTranslator() {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<Direction>("es-maya");
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [microphoneStatus, setMicrophoneStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "unsupported">("idle");
  const [messages, setMessages] = useState<Message[]>([
    { from: "assistant", text: "Puedes usar lectura de texto en español. El contenido en maya está pendiente de validación." },
  ]);
  const sourceLabel = direction === "es-maya" ? "Español" : "Maya";
  const targetLabel = direction === "es-maya" ? "Maya" : "Español";
  const speechSupported = useMemo(
    () => typeof window !== "undefined" && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
    [],
  );

  function speak(text: string) {
    speakNaturally(text, { maya: direction === "es-maya" });
  }

  function send(value = input) {
    const clean = value.trim();
    if (!clean) return;
    const translated = translate(clean, direction);
    setMessages(prev => [...prev, { from: "user", text: clean }, { from: "assistant", text: translated }]);
    setInput("");
    speak(translated);
  }

  async function listen() {
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition || !navigator.mediaDevices?.getUserMedia) {
      setMicrophoneStatus("unsupported");
      return;
    }

    try {
      setMicrophoneStatus("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicrophoneStatus("granted");
    } catch {
      setMicrophoneStatus("denied");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "es-MX";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => send(event.results[0][0].transcript);
    recognition.start();
  }

  const microphoneMessage = {
    idle: "Pulsa el micrófono y permite el acceso para comenzar.",
    requesting: "Esperando permiso para usar el micrófono...",
    granted: listening ? `Escuchando en ${sourceLabel.toLowerCase()}...` : "Micrófono habilitado.",
    denied: "El micrófono está bloqueado. Permítelo desde el candado de la barra de direcciones.",
    unsupported: "Este navegador no admite reconocimiento de voz. Prueba Chrome o Edge.",
  }[microphoneStatus];

  return (
    <div className="fixed bottom-20 right-3 z-50 sm:bottom-5 sm:right-5">
      {open && (
        <section className="mb-3 flex max-h-[70svh] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[#EDE8DF] bg-white shadow-2xl">
          <div className="bg-[#315C4C] p-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold">Intérprete de voz</p>
                <p className="mt-1 text-xs text-white/70">Español y maya yucateco</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Cerrar intérprete">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <button onClick={() => setDirection(current => current === "es-maya" ? "maya-es" : "es-maya")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15">
              <span>{sourceLabel}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3" /></svg>
              <span>{targetLabel}</span>
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#FFFDF8] p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${message.from === "user" ? "bg-[#B85C38] text-white" : "border border-[#EDE8DF] bg-white text-[#3A2923]"}`}>
                  {message.text}
                  {message.from === "assistant" && (
                    <button onClick={() => speak(message.text)} className="ml-2 inline-flex text-[#315C4C]" aria-label="Escuchar respuesta">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5ZM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EDE8DF] p-3">
            <form onSubmit={event => { event.preventDefault(); send(); }} className="flex gap-2">
              <input className="input-field min-w-0 flex-1" value={input} onChange={event => setInput(event.target.value)} placeholder={`Habla o escribe en ${sourceLabel.toLowerCase()}`} />
              <button type="button" onClick={listen} disabled={listening || microphoneStatus === "requesting"} className={`rounded-lg p-3 ${listening ? "bg-[#B85C38] text-white" : "bg-[#F5EFE4] text-[#315C4C]"}`} aria-label="Hablar">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></svg>
              </button>
              <button type="submit" className="rounded-lg bg-[#315C4C] p-3 text-white" aria-label="Traducir">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>
              </button>
            </form>
            <p className={`mt-2 text-xs ${microphoneStatus === "denied" || microphoneStatus === "unsupported" ? "text-[#B33A3A]" : "text-[#6B6763]"}`}>
              {speechSupported ? microphoneMessage : "El reconocimiento de voz no está disponible en este navegador. Prueba Chrome o Edge."}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-[#6B6763]">Glosario de apoyo. Confirma traducciones culturales o legales con una persona hablante autorizada.</p>
          </div>
        </section>
      )}

      <button onClick={() => setOpen(current => !current)} className="ml-auto flex items-center gap-2 rounded-full bg-[#315C4C] px-4 py-3 font-semibold text-white shadow-xl hover:bg-[#244437]" aria-label="Abrir intérprete de voz">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" /><path d="M8 9h8M8 13h5" /></svg>
        <span className="hidden sm:inline">Intérprete</span>
      </button>
    </div>
  );
}
