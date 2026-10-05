import { api } from "../data/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const STEPS = [
  "Datos personales",
  "Taller o colectivo",
  "Comunidad y municipio",
  "Actividad artesanal",
  "Experiencia digital",
  "Representación autorizada",
  "Autorización de datos",
  "Revisión y envío",
];

const MUNICIPALITIES = ["Felipe Carrillo Puerto", "José María Morelos", "Tulum", "Bacalar", "Lázaro Cárdenas", "Benito Juárez", "Cozumel", "Otro"];
const CRAFT_TYPES = ["Textiles y bordados", "Madera", "Fibras naturales", "Cerámica", "Joyería artesanal", "Decoración", "Accesorios"];

export default function Register() {
  const [role, setRole] = useState("producer");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    workshop: "", workshop_desc: "",
    community: "", municipality: "",
    crafts: [] as string[], technique: "", materials: "",
    digital_exp: "", device: "",
    represented_by: "", representative_name: "",
    consent_name: false, consent_photo: false, consent_history: false, consent_qr: false, consent_platform: false,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const toggleCraft = (c: string) => set("crafts", form.crafts.includes(c) ? form.crafts.filter(x => x !== c) : [...form.crafts, c]);

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  async function handleNext() {
    if (role === "consumer") {
      try { await api("register", "POST", { ...form, role }); setSubmitted(true); setTimeout(() => navigate("/login"), 3000); }
      catch (e) { alert((e as Error).message); } return;
    }
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else {
      try { await api("register", "POST", { ...form, role }); setSubmitted(true); setTimeout(() => navigate("/login"), 3000); }
      catch (e) { alert((e as Error).message); }
    }
  }

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5EFE4]">
      <div className="bg-white border border-[#EDE8DF] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-[#2F7D50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#2F7D50]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-[#3A2923] mb-2">¡Solicitud enviada!</h2>
        <p className="text-[#6B6763]">Tu cuenta se guardó. Los perfiles de productor quedan pendientes de revisión. Redirigiendo al inicio de sesión...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5EFE4] px-3 sm:px-4 py-6 sm:py-10">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-bold text-[#3A2923]">Crear cuenta</h1>
          <label className="block mt-4">Tipo de cuenta<select className="input-field" value={role} onChange={e => { setRole(e.target.value); setStep(0); }}><option value="consumer">Consumidor</option><option value="producer">Productor</option></select></label>
        </div>

        {/* Progress */}
        <div className="bg-white border border-[#EDE8DF] rounded-xl p-4 mb-5">
          <div className="flex justify-between text-xs text-[#6B6763] mb-2">
            <span>Paso {step + 1} de {STEPS.length}: <strong className="text-[#3A2923]">{STEPS[step]}</strong></span>
            <span>{progress}%</span>
          </div>
          <div className="bg-[#F5EFE4] rounded-full h-2 overflow-hidden">
            <div className="h-2 bg-[#B85C38] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white border border-[#EDE8DF] rounded-xl p-4 sm:p-6 shadow-sm">
          {(step === 0 || role === "consumer") && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#3A2923]">Datos personales</h2>
              {role === "consumer" && <label><input type="checkbox" checked={form.consent_platform} onChange={e => set("consent_platform", e.target.checked)} /> Acepto el aviso de privacidad y el registro de mis datos.</label>}
              {[{ label: "Nombre completo", key: "name", type: "text" }, { label: "Correo electrónico", key: "email", type: "email" }, { label: "Teléfono de contacto", key: "phone", type: "tel" }, { label: "Contraseña (mínimo 8 caracteres)", key: "password", type: "password" }].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-[#3A2923] mb-1 block">{f.label}</label>
                  <input className="input-field" type={f.type} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#3A2923]">Información del taller o colectivo</h2>
              <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Nombre del taller o colectivo</label><input className="input-field" value={form.workshop} onChange={e => set("workshop", e.target.value)} placeholder="Ej: Taller Puc Dzul" /></div>
              <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Descripción breve</label><textarea className="input-field h-24 resize-none" value={form.workshop_desc} onChange={e => set("workshop_desc", e.target.value)} placeholder="Describe tu taller, tu trabajo y qué lo hace especial..." /></div>
              <div className="bg-[#F5EFE4] rounded-lg p-3 text-xs text-[#6B6763]">
                <p className="font-semibold text-[#3A2923] mb-1">💡 Consejo:</p>
                Una descripción honesta y detallada ayuda a los compradores a conocerte mejor y aumenta la confianza en tus productos.
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#3A2923]">Comunidad y municipio</h2>
              <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Comunidad de origen</label><input className="input-field" value={form.community} onChange={e => set("community", e.target.value)} placeholder="Ej: Felipe Carrillo Puerto" /></div>
              <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Municipio</label>
                <select className="input-field" value={form.municipality} onChange={e => set("municipality", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {MUNICIPALITIES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#3A2923]">Actividad artesanal</h2>
              <div>
                <label className="text-xs font-semibold text-[#3A2923] mb-2 block">Tipo de artesanía (selecciona los que apliquen)</label>
                <div className="flex flex-wrap gap-2">
                  {CRAFT_TYPES.map(c => (
                    <button key={c} type="button" onClick={() => toggleCraft(c)}
                      className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all ${form.crafts.includes(c) ? "border-[#B85C38] bg-[#B85C38]/10 text-[#B85C38] font-semibold" : "border-[#EDE8DF] text-[#6B6763]"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Técnica principal</label><input className="input-field" value={form.technique} onChange={e => set("technique", e.target.value)} placeholder="Ej: Tejido en telar de cintura" /></div>
              <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Materiales más usados</label><input className="input-field" value={form.materials} onChange={e => set("materials", e.target.value)} placeholder="Ej: Algodón, henequén, barro" /></div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#3A2923]">Experiencia digital</h2>
              <div>
                <label className="text-xs font-semibold text-[#3A2923] mb-2 block">¿Tienes experiencia vendiendo en línea?</label>
                <div className="flex flex-col gap-2">
                  {["Sí, uso redes sociales para vender", "Sí, tengo tienda en línea", "Tengo poca experiencia", "No tengo experiencia digital"].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="digital_exp" className="accent-[#B85C38]" value={opt} checked={form.digital_exp === opt} onChange={() => set("digital_exp", opt)} />
                      <span className="text-sm text-[#3A2923]">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3A2923] mb-2 block">¿Con qué dispositivo accedes a internet?</label>
                <select className="input-field" value={form.device} onChange={e => set("device", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {["Celular Android", "iPhone", "Computadora", "Tableta", "No tengo acceso propio"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="bg-[#F5EFE4] rounded-lg p-3 text-xs text-[#6B6763]">No te preocupes si tienes poca experiencia digital. El acompañamiento de la plataforma es completamente digital y a tu ritmo.</div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#3A2923]">Representación autorizada (opcional)</h2>
              <p className="text-sm text-[#6B6763]">Si un familiar u otra persona administrará el perfil en tu nombre, indícalo aquí.</p>
              <div>
                <label className="text-xs font-semibold text-[#3A2923] mb-2 block">¿Tienes representante?</label>
                <div className="flex gap-4">
                  {["Sí", "No"].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="represented_by" className="accent-[#B85C38]" value={opt} checked={form.represented_by === opt} onChange={() => set("represented_by", opt)} />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              {form.represented_by === "Sí" && (
                <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Nombre del representante</label><input className="input-field" value={form.representative_name} onChange={e => set("representative_name", e.target.value)} /></div>
              )}
            </div>
          )}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#3A2923]">Autorización de datos</h2>
              <p className="text-sm text-[#6B6763]">Selecciona qué información autorizas publicar en la plataforma:</p>
              {[
                { key: "consent_name", label: "Mi nombre o el nombre del taller" },
                { key: "consent_photo", label: "Fotografías de mis productos" },
                { key: "consent_history", label: "Historia y descripción cultural de las piezas" },
                { key: "consent_qr", label: "Código QR de trazabilidad" },
                { key: "consent_platform", label: "Publicación en la plataforma web" },
              ].map(c => (
                <label key={c.key} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="accent-[#B85C38] mt-0.5" checked={(form as any)[c.key]} onChange={e => set(c.key, e.target.checked)} />
                  <span className="text-sm text-[#3A2923]">{c.label}</span>
                </label>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                No publicaremos ningún dato sin tu consentimiento. Puedes solicitar la retirada de cualquier contenido en cualquier momento desde tu panel.
              </div>
            </div>
          )}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#3A2923]">Revisión y envío</h2>
              <div className="bg-[#F5EFE4] rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-[#6B6763]">Nombre:</span><span className="font-medium">{form.name || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#6B6763]">Correo:</span><span className="font-medium">{form.email || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#6B6763]">Taller:</span><span className="font-medium">{form.workshop || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#6B6763]">Comunidad:</span><span className="font-medium">{form.community || "—"}, {form.municipality || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#6B6763]">Artesanías:</span><span className="font-medium">{form.crafts.join(", ") || "—"}</span></div>
              </div>
              <p className="text-xs text-[#6B6763]">Al enviar tu solicitud, aceptas los <Link to="/terminos" className="text-[#B85C38] hover:underline">términos y condiciones</Link> y el <Link to="/privacidad" className="text-[#B85C38] hover:underline">aviso de privacidad</Link>.</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className="btn-secondary px-5">← Atrás</button>}
            <button onClick={handleNext} className="btn-primary flex-1 justify-center">
              {step === STEPS.length - 1 ? "Enviar solicitud" : "Continuar →"}
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-[#6B6763]">¿Ya tienes cuenta? <Link to="/login" className="text-[#B85C38] hover:underline">Iniciar sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
