import { useApp as useDataRefresh } from "../context/AppContext";
import { useState } from "react";
import { Link } from "react-router";
import { getStore } from "../data/store";
import ProductCard from "../components/ProductCard";
import ImageWithFallback from "../components/ImageWithFallback";
import fondoImg from "../imports/fondo.png";
import { speakNaturally } from "../utils/speech";

const LANG_CARDS = [
  { glyph: "B", name: "Saludo", phrase: "Bix a beel?", trans: "¿Cómo estás?", region: "Maya yucateco", c1: "#B85C38", c2: "#D6A73C" },
  { glyph: "K", name: "Buen día", phrase: "Ma'alob k'iin", trans: "Buenos días", region: "Maya yucateco", c1: "#315C4C", c2: "#2F7D50" },
  { glyph: "Y", name: "Agradecimiento", phrase: "Yuum bo'otik", trans: "Gracias", region: "Maya yucateco", c1: "#8B4513", c2: "#D6A73C" },
  { glyph: "K", name: "Invitación", phrase: "Ko'ox", trans: "Vamos", region: "Maya yucateco", c1: "#3A2923", c2: "#B85C38" },
];

const STORY_POINTS = [
  "Pago justo y transparente al artesano",
  "Trazabilidad completa de cada pieza",
  "Apoyo a la preservación lingüística y cultural",
];

const CATEGORIES = [
  { key: "all", label: "Todo" },
  { key: "Textiles y bordados", label: "Textiles" },
  { key: "Cerámica", label: "Cerámica" },
  { key: "Madera", label: "Madera" },
  { key: "Joyería artesanal", label: "Joyería" },
  { key: "Fibras naturales", label: "Fibras" },
];

export default function Home() {
  useDataRefresh();
  const store = getStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [speakingPhrase, setSpeakingPhrase] = useState("");

  function pronounce(phrase: string) {
    const utterance = speakNaturally(phrase, { maya: true });
    if (!utterance) return;
    utterance.onstart = () => setSpeakingPhrase(phrase);
    utterance.onend = () => setSpeakingPhrase("");
  }

  const allPublished = store.products.filter(p => p.status === "published");
  const featured = activeFilter === "all"
    ? allPublished.slice(0, 6)
    : allPublished.filter(p => p.category === activeFilter).slice(0, 6);

  const featuredProducers = store.producer_profiles
    .filter(p => p.authorization_status === "approved")
    .slice(0, 4);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ backgroundImage: `url(${fondoImg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0f0a05]/75" />
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #B85C38, transparent)" }} />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #315C4C, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #D6A73C, transparent)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <span className="inline-block text-[#D6A73C] text-xs sm:text-sm font-semibold tracking-widest mb-5 sm:mb-6 opacity-90">
            ✦ Comercio justo · Cultura viva ✦
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5 sm:mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Cada hilo cuenta<br />
            una{" "}
            <span style={{
              background: "linear-gradient(135deg, #D6A73C 0%, #B85C38 50%, #315C4C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              historia ancestral
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Descubre arte, lenguas y tradiciones del sureste mexicano directamente
            de las manos que las crean. Compra con propósito y honra a quienes
            sostienen la memoria de un pueblo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16">
            <Link to="/catalogo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #B85C38, #D6A73C)" }}>
              Compra con propósito
            </Link>
            <Link to="/productores"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all">
              Conoce a los artesanos →
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-6 sm:gap-10 text-center">
            {[
              { num: "8+", label: "Productores" },
              { num: "20+", label: "Artesanías" },
              { num: "7", label: "Comunidades" },
              { num: "100%", label: "Comercio justo" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-[#D6A73C]" style={{ fontFamily: "'Playfair Display', serif" }}>{s.num}</div>
                <div className="text-xs text-white/60 mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm animate-bounce z-10">↓ Desliza ↓</div>
      </section>

      {/* ── ARTESANOS DESTACADOS ── */}
      <section className="bg-[#FFFDF8] py-14 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#B85C38] text-sm font-semibold tracking-widest">— Nuestras comunidades —</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[#3A2923]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Voces que tejen <em>identidad</em>
            </h2>
            <p className="text-[#6B6763] mt-3">Artesanos con trayectoria y procedencia verificada</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducers.map(pp => (
              <Link to={`/productor/${pp.id}`} key={pp.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE8DF] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="h-36 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #3A2923, #315C4C)" }}>
                  <ImageWithFallback src={pp.profile_image} alt={pp.workshop_name}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-semibold text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                      {pp.craft_types[0]}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#25211F] text-sm leading-tight">{pp.workshop_name}</h3>
                  <p className="text-xs text-[#6B6763] mt-0.5">{pp.community}, Q.Roo</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[#D6A73C] text-xs">★ {pp.rating}</span>
                    <span className="text-xs text-[#6B6763]">· {pp.total_products} piezas</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/productores" className="text-[#B85C38] font-semibold hover:underline text-sm">
              Ver todos los artesanos →
            </Link>
          </div>
        </div>
      </section>

      {/* ── LENGUAS ORIGINARIAS ── */}
      <section className="py-14 sm:py-20 px-4" style={{ background: "linear-gradient(135deg, #3A2923 0%, #1a0f08 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D6A73C] text-sm font-semibold tracking-widest">— Lenguas originarias —</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Palabras que <em>laten</em>
            </h2>
            <p className="text-white/60 mt-3">Frases en lenguas vivas de las comunidades aliadas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LANG_CARDS.map(card => (
              <button type="button" onClick={() => pronounce(card.phrase)} key={card.name} className="rounded-2xl p-6 flex flex-col gap-3 border border-white/10 hover:-translate-y-1 transition-all duration-300 text-left"
                style={{ background: `linear-gradient(135deg, ${card.c1}22, ${card.c2}15)` }}>
                <div className="text-4xl font-bold" style={{ color: card.c1 }}>{card.glyph}</div>
                <span className="text-white font-semibold text-base">{card.name}</span>
                <p className="text-lg font-medium" style={{ color: card.c2 }}>{card.phrase}</p>
                <span className="text-white/60 text-sm">{card.trans}</span>
                <span className="text-xs text-white/40 mt-auto pt-2 border-t border-white/10">
                  {speakingPhrase === card.phrase ? "Reproduciendo pronunciación..." : `${card.region} · Toca para escuchar`}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTESANÍAS DESTACADAS ── */}
      <section className="bg-[#F5EFE4] py-14 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#B85C38] text-sm font-semibold tracking-widest">— Mercancías destacadas —</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[#3A2923]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Arte hecho a <em>mano</em>
            </h2>
            <p className="text-[#6B6763] mt-3">Cada pieza es única. Cada compra cambia una historia.</p>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === cat.key
                    ? "text-white shadow-md"
                    : "bg-white text-[#6B6763] border border-[#EDE8DF] hover:border-[#B85C38] hover:text-[#B85C38]"
                }`}
                style={activeFilter === cat.key ? { background: "linear-gradient(135deg, #B85C38, #D6A73C)" } : {}}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(p => {
              const producer = store.producer_profiles.find(pp => pp.id === p.producer_id);
              return <ProductCard key={p.id} product={p} producer={producer} />;
            })}
            {featured.length === 0 && (
              <div className="col-span-3 text-center py-12 text-[#6B6763]">
                No hay productos en esta categoría aún.
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link to="/catalogo"
              className="inline-block px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #B85C38, #D6A73C)" }}>
              Ver todas las artesanías
            </Link>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="bg-[#315C4C] py-14 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[#D6A73C] text-sm font-semibold tracking-widest">— Proceso —</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[
              { n: "01", icon: "🔍", title: "Descubre", desc: "Explora el catálogo de piezas artesanales de comunidades originarias de Quintana Roo." },
              { n: "02", icon: "📖", title: "Conoce su procedencia", desc: "Lee la historia, técnica y origen cultural de cada pieza, autorizada por su creador." },
              { n: "03", icon: "🤝", title: "Compra directamente", desc: "Adquiere directamente del productor. Tu pago llega casi completo al artesano." },
            ].map(step => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl mb-4">
                  {step.icon}
                </div>
                <div className="text-[#D6A73C] text-xs font-bold font-mono tracking-widest mb-2">{step.n}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/como-funciona" className="text-[#D6A73C] font-semibold hover:text-white transition-colors text-sm">
              Saber más →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HISTORIA / NOSOTROS ── */}
      <section className="bg-[#FFFDF8] py-14 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-[#B85C38] text-sm font-semibold tracking-widest">— Nuestra historia —</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[#3A2923] leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Tejer puentes entre <em>mundos</em>
              </h2>
              <p className="text-[#6B6763] leading-relaxed mb-4">
                <strong className="text-[#3A2923]">Voces de mi Tierra</strong> nació de la convicción de que el
                arte indígena de Quintana Roo no necesita intermediarios: necesita oídos,
                ojos y manos que escuchen.
              </p>
              <p className="text-[#6B6763] leading-relaxed mb-6">
                Trabajamos directamente con cooperativas y artesanos del sureste mexicano
                para llevar al mundo piezas auténticas, garantizando que el 90% del valor
                de cada compra regrese a quien la creó.
              </p>
              <ul className="space-y-2.5 mb-8">
                {STORY_POINTS.map(pt => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-[#3A2923]">
                    <span className="mt-0.5 text-[#315C4C] font-bold">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link to="/trazabilidad"
                className="inline-block px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #315C4C, #2F7D50)" }}>
                Conocer la trazabilidad
              </Link>
            </div>
            {/* Visual cards */}
            <div className="relative h-80 lg:h-96">
              <div className="absolute top-0 left-0 w-48 h-48 rounded-2xl overflow-hidden shadow-xl"
                style={{ background: "linear-gradient(135deg, #B85C38, #D6A73C)" }}>
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-40">🧵</div>
              </div>
              <div className="absolute top-16 right-0 w-44 h-44 rounded-2xl overflow-hidden shadow-xl"
                style={{ background: "linear-gradient(135deg, #315C4C, #3A2923)" }}>
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">🏺</div>
              </div>
              <div className="absolute bottom-0 left-16 w-52 h-40 rounded-2xl overflow-hidden shadow-xl"
                style={{ background: "linear-gradient(135deg, #3A2923, #B85C38)" }}>
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">🪵</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full border-4 border-[#D6A73C]/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#D6A73C]/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA PRODUCTORES ── */}
      <section className="py-14 sm:py-20 px-4" style={{ background: "linear-gradient(135deg, #3A2923 0%, #B85C38 50%, #D6A73C 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-white/60 text-sm font-semibold tracking-widest">— Únete a la red —</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Eres artesano o cooperativa?
          </h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            Súmate a la plataforma. Publica tus piezas con procedencia cultural declarada
            y llega a compradores que valoran el arte auténtico.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/registro"
              className="px-8 py-3.5 rounded-full font-semibold bg-white text-[#B85C38] hover:bg-[#F5EFE4] transition-all hover:scale-105">
              Quiero publicar mis artesanías
            </Link>
            <Link to="/como-funciona"
              className="px-8 py-3.5 rounded-full font-semibold text-white border border-white/40 hover:bg-white/10 transition-all">
              Cómo funciona para productores
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
