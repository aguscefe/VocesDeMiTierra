import { useApp as useDataRefresh } from "../context/AppContext";
import { useParams, Link } from "react-router";
import { getStore } from "../data/store";
import ImageWithFallback from "../components/ImageWithFallback";
import ProductCard from "../components/ProductCard";

export default function ProducerProfile() {
  useDataRefresh();
  const { id } = useParams<{ id: string }>();
  const store = getStore();
  const producer = store.producer_profiles.find(pp => pp.id === id);
  const user = producer ? store.users.find(u => u.id === producer.user_id) : null;
  const products = producer ? store.products.filter(p => p.producer_id === producer.id && p.status === "published") : [];

  if (!producer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-[#3A2923] mb-4">Productor no encontrado</h2>
          <Link to="/productores" className="btn-primary">Ver productores</Link>
        </div>
      </div>
    );
  }

  const avgRating = producer.rating;
  const totalReviews = store.reviews.filter(r => products.some(p => p.id === r.product_id)).length;

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Hero del productor */}
      <div className="bg-gradient-to-br from-[#315C4C] to-[#3A2923] py-14 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <ImageWithFallback src={producer.profile_image} alt={producer.workshop_name} className="w-28 h-28 rounded-full object-cover border-4 border-white/30" />
            {producer.authorization_status === "approved" && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2F7D50] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              </div>
            )}
          </div>
          <div className="text-center sm:text-left text-white">
            <h1 className="font-display text-3xl font-bold mb-1">{producer.workshop_name}</h1>
            <p className="text-white/90 mb-2">{producer.artisan_name || user?.name}</p>
            <p className="text-white/70 mb-3">{producer.community}, {producer.municipality}</p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm">
              <span className="flex items-center gap-1"><span className="text-[#D6A73C]">★</span> <strong>{avgRating}</strong> ({totalReviews} reseñas)</span>
              <span className="text-white/50">·</span>
              <span>{producer.total_products} piezas publicadas</span>
              <span className="text-white/50">·</span>
              <span>{producer.years_experience} años de experiencia</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {producer.languages.map(l => <span key={l} className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full">{l}</span>)}
            </div>
          </div>
          <div className="sm:ml-auto flex gap-2">
            <button className="btn-secondary border-white/30 text-white hover:bg-white/10 text-sm py-2 px-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              Compartir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Biografía */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-semibold text-[#3A2923] mb-3">Acerca del taller</h2>
            <p className="text-[#6B6763] leading-relaxed">{producer.biography}</p>
          </div>
          <div className="bg-[#F5EFE4] rounded-xl p-5 space-y-3">
            <div>
              <p className="text-xs font-semibold text-[#6B6763] uppercase tracking-wider">Técnicas</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {producer.craft_types.map(ct => <span key={ct} className="text-xs bg-white border border-[#EDE8DF] text-[#3A2923] px-2 py-0.5 rounded-full">{ct}</span>)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B6763] uppercase tracking-wider">Idiomas</p>
              <p className="text-sm text-[#3A2923] mt-1">{producer.languages.join(", ")}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B6763] uppercase tracking-wider">Experiencia</p>
              <p className="text-sm text-[#3A2923] mt-1">{producer.years_experience} años</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B6763] uppercase tracking-wider">Municipio</p>
              <p className="text-sm text-[#3A2923] mt-1">{producer.municipality}</p>
            </div>
            {!producer.verified_contact && (
              <p className="text-xs text-[#D18B24] bg-amber-50 border border-amber-200 rounded-lg p-2">Contacto en proceso de verificación</p>
            )}
          </div>
        </div>

        {/* Catálogo */}
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#3A2923] mb-5">
            Catálogo disponible <span className="text-base font-normal text-[#6B6763]">({products.length} {products.length === 1 ? "pieza" : "piezas"})</span>
          </h2>
          {products.length === 0 ? (
            <div className="text-center py-12 bg-[#F5EFE4] rounded-xl">
              <p className="text-[#6B6763]">Este productor aún no tiene piezas publicadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
