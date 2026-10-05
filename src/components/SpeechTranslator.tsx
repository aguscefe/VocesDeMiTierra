import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../data/api";
import { recordMaya } from "../utils/recordMaya";
import { speakNaturally } from "../utils/speech";

type Direction = "es-maya" | "maya-es";
type Message = { from: "user" | "assistant"; text: string; language?: "es" | "yua" };

export default function SpeechTranslator() {
  const [speaking,setSpeaking]=useState(false);
  const conversationRef=useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);
  const recordingRef = useRef<((deliver?: boolean) => void) | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const recognitionRef = useRef<any>(null);
  useEffect(() => () => { recognitionRef.current?.abort(); recordingRef.current?.(false); window.speechSynthesis?.cancel(); }, []);
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<Direction>("es-maya");
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [microphoneStatus, setMicrophoneStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "unsupported">("idle");
  const [messages, setMessages] = useState<Message[]>([
    { from: "assistant", text: "Escribe texto en español o maya yucateco. Puedes intercambiar los idiomas para traducir en ambas direcciones." },
  ]);
  const sourceLabel = direction === "es-maya" ? "Español" : "Maya";
  const targetLabel = direction === "es-maya" ? "Maya" : "Español";
  const speechSupported = useMemo(
    () => typeof window !== "undefined" && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
    [],
  );

  useEffect(()=>{conversationRef.current?.scrollTo({top:conversationRef.current.scrollHeight,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});},[messages,busy]);
  function animateSpeech(utterance:SpeechSynthesisUtterance|undefined){if(!utterance)return;utterance.onstart=()=>setSpeaking(true);utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>setSpeaking(false);}
  function speak(text: string, language: "es" | "yua" = "es") {
    setError("");
    if (!("speechSynthesis" in window)) { setError("Este navegador no admite lectura en voz alta."); return; }
    if(language === "es") { animateSpeech(speakNaturally(text)); return; }
    const voice = window.speechSynthesis?.getVoices().find(v => v.lang.toLowerCase().startsWith("yua"));
    if(!voice) { animateSpeech(speakNaturally(text, { maya: true })); return; }
    const utterance = new SpeechSynthesisUtterance(text); utterance.voice=voice; utterance.lang=voice.lang;
    animateSpeech(utterance); window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance);
  }
  async function send(value = input) {
    const clean=value.trim(); if(!clean || sending.current) return;
    sending.current=true; setBusy(true); setError("");
    const source=direction === "es-maya" ? "es" : "yua";
    const target=direction === "es-maya" ? "yua" : "es";
    try {
      const result=await api<{text:string}>("translate","POST",{text:clean,source,target});
      setMessages(prev=>[...prev,{from:"user",text:clean,language:source},{from:"assistant",text:result.text,language:target}]);
      setInput(""); speak(result.text,target);
    } catch(e) {setError((e as Error).message);} finally {sending.current=false;setBusy(false);}
  }

  async function listen() {
    if(direction === "maya-es") {
      if(listening) { recordingRef.current?.(); return; }
      if(!navigator.mediaDevices?.getUserMedia) { setMicrophoneStatus("unsupported"); return; }
      setError(""); setMicrophoneStatus("requesting");
      try {
        recordingRef.current=await recordMaya(async audio => {
          setListening(false); setBusy(true); setTranscribing(true);
          try { const form=new FormData(); form.append("audio",audio,"maya.wav"); const result=await api<{text:string}>("transcribe","POST",form); setInput(result.text); }
          catch(e) { setError((e as Error).message); }
          finally {setBusy(false);setTranscribing(false);recordingRef.current=null;}
        }, message=>{setListening(false);setError(message);});
        setMicrophoneStatus("granted"); setListening(true);
      } catch {setMicrophoneStatus("denied");}
      return;
    }
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
    recognitionRef.current = recognition;
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
    <div className="translator-widget fixed bottom-4 right-3 z-50 sm:bottom-5 sm:right-5">
      {open && (
        <section className="translator-panel mb-3 flex max-h-[78svh] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[#EDE8DF] bg-white shadow-2xl">
          <div className="translator-header p-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="mascot-greeting"><div className={`mascot mascot-${listening?"listening":busy?"thinking":speaking?"speaking":"idle"}`}><img src="/design/mascota.png" alt="Compañero artesano de Voces"/><span className="mascot-mouth" aria-hidden="true"/></div><div><p className="font-display text-xl font-semibold">Una voz que te acompaña</p><p className="mt-1 text-xs text-white/90">Español ↔ Maya yucateco</p><span className="mascot-state">{listening?"Te escucho…":busy?"Un momento, estoy pensando…":speaking?"Escucha la respuesta":"¡Vamos a conversar!"}</span></div></div>
              <button onClick={() => {setOpen(false);recordingRef.current?.(false);recognitionRef.current?.abort();setListening(false);window.speechSynthesis?.cancel();setSpeaking(false);}} className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Cerrar intérprete">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <button disabled={busy || listening} onClick={() => setDirection(current => current === "es-maya" ? "maya-es" : "es-maya")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15">
              <span>{sourceLabel}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3" /></svg>
              <span>{targetLabel}</span>
            </button>
          </div>

          <div ref={conversationRef} data-no-translate className="translator-conversation min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#FFFDF8] p-4" aria-live="polite">
            {messages.length===0&&<p className="chat-empty">Escribe una frase y la traducimos juntos.</p>}
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${message.from === "user" ? "chat-user text-white" : "chat-assistant border border-[#EDE8DF] bg-white text-[#3A2923]"}`}>
                  {message.text}
                  {message.from === "assistant" && (
                    <button onClick={() => speak(message.text,message.language)} className="ml-2 inline-flex text-[#315C4C]" aria-label={message.language === "yua" ? "Escuchar maya; lectura aproximada si no hay voz compatible" : "Escuchar respuesta"} title={message.language === "yua" ? "Sin voz maya compatible se usa voz española: pronunciación aproximada" : "Escuchar respuesta"}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5ZM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EDE8DF] p-3">
            <form onSubmit={event => { event.preventDefault(); send(); }} className="flex gap-2">
              <input maxLength={3000} disabled={busy || listening} className="input-field min-w-0 flex-1" value={input} onChange={event => setInput(event.target.value)} placeholder={`Habla o escribe en ${sourceLabel.toLowerCase()}`} />
              <button type="button" onClick={listen} disabled={busy || (listening && direction === "es-maya") || microphoneStatus === "requesting"} className={`rounded-lg p-3 ${listening ? "chat-user text-white" : "bg-[#F5EFE4] text-[#315C4C]"}`} aria-label={listening ? "Detener grabación" : "Hablar"}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></svg>
              </button>
              <button type="submit" disabled={busy || listening || !input.trim()} className="chat-send rounded-lg p-3 text-white" aria-label="Traducir">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>
              </button>
            </form>
            {busy && <p role="status" className="mt-2 text-sm">{transcribing ? "Reconociendo voz maya…" : "Traduciendo…"}</p>}
            {error && <p role="alert" className="mt-2 text-sm text-[#B33A3A]">{error}</p>}
            <button type="button" className="mt-2 text-xs underline" onClick={() => {setMessages([]);setError("");}}>Limpiar conversación</button>
            <p className={`mt-2 text-xs ${microphoneStatus === "denied" || microphoneStatus === "unsupported" ? "text-[#B33A3A]" : "text-[#6B6763]"}`}>
              {(direction === "maya-es" || speechSupported) ? microphoneMessage : "El reconocimiento de voz no está disponible en este navegador. Prueba Chrome o Edge."}
            </p>
            <details className="translator-details"><summary>Sobre la traducción y el micrófono</summary><p className="mt-2 text-[10px] leading-relaxed text-[#6B6763]">Traducción automática de Microsoft Translator. El texto se envía a este servicio. Dictado español en el navegador y maya mediante MMS en el servidor. Graba hasta 15 segundos; revisa el texto y pulsa Traducir. El audio maya se procesa sin guardarse. Sin una voz maya compatible, la lectura usa voz española y pronunciación aproximada; no sirve como guía de pronunciación. Confirma textos culturales con una persona hablante.</p></details>
          </div>
        </section>
      )}

      <button onClick={() => setOpen(current => !current)} className="translator-launch ml-auto flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white shadow-xl" aria-label="Abrir intérprete de voz">
        <img src="/design/mascota.png" alt="" className="launch-mascot"/>
        <span className="hidden sm:inline">Intérprete</span>
      </button>
    </div>
  );
}
