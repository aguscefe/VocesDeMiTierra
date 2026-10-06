import { Link } from "react-router";
import { useApp } from "../context/AppContext";
import { getStore } from "../data/store";
import CraftBanner from "../components/CraftBanner";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const { user, favorites } = useApp();
  const store = getStore();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">❤️</div>
        <h2 className="font-display text-2xl font-bold text-[#3A2923] mb-3">Inicia sesión para ver tus favoritos</h2>
        <Link to="/login" className="btn-primary">Iniciar sesión</Link>
      </div>
    </div>
  );

  const favProducts = store.products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <CraftBanner title="Mis favoritos" eyebrow="Piezas que conectan contigo" description={`${favProducts.length} ${favProducts.length === 1 ? "pieza guardada" : "piezas guardadas"}. Un lugar para volver a lo que te inspira.`} image="/demo/productos/rebozo.png" />
      <div className="max-w-7xl mx-auto px-4 py-10">
        {favProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="font-display text-2xl font-bold text-[#3A2923] mb-3">Aún no tienes favoritos</h2>
            <p className="text-[#6B6763] mb-6">Explora el catálogo y guarda las piezas que más te gusten.</p>
            <Link to="/catalogo" className="btn-primary">Explorar catálogo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favProducts.map(p => {
              const producer = store.producer_profiles.find(pp => pp.id === p.producer_id);
              return <ProductCard key={p.id} product={p} producer={producer} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
