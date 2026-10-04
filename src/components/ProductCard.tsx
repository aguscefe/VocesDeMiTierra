import { Link } from "react-router";
import type { Product, ProducerProfile } from "../data/types";
import { useApp } from "../context/AppContext";
import ImageWithFallback from "./ImageWithFallback";

interface Props {
  product: Product;
  producer?: ProducerProfile;
}

export default function ProductCard({ product, producer }: Props) {
  const { user, favorites, toggleFavorite, addToCart } = useApp();
  const isFav = favorites.includes(product.id);

  return (
    <div className="card flex flex-col group">
      <div className="relative overflow-hidden aspect-square">
        <ImageWithFallback src={product.featured_image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 bg-[#315C4C] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Procedencia declarada
          </span>
        </div>
        {user && (
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow hover:scale-110 transition-transform"
            aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <svg className={`w-4 h-4 transition-colors ${isFav ? "fill-[#B85C38] stroke-[#B85C38]" : "stroke-[#6B6763] fill-none"}`} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute bottom-2 left-2 bg-[#D18B24] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Últimas {product.stock}</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[#3A2923] text-xs font-bold px-3 py-1 rounded-full">Agotado</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[#25211F] leading-tight line-clamp-2 flex-1">{product.name}</h3>
        </div>
        {producer && (
          <p className="text-xs text-[#6B6763] mb-1">{producer.workshop_name}</p>
        )}
        <div className="flex items-center gap-1 mb-2">
          <svg className="w-3 h-3 text-[#B85C38]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="text-xs text-[#6B6763]">{product.category}</span>
          {producer && <><span className="text-[#EDE8DF]">·</span><span className="text-xs text-[#6B6763]">{producer.community}</span></>}
        </div>
        <div className="mt-auto">
          <p className="font-display text-xl font-semibold text-[#B85C38] mb-3">${product.price.toLocaleString("es-MX")} <span className="text-xs font-sans font-normal text-[#6B6763]">MXN</span></p>
          <div className="flex gap-2">
            <Link to={`/producto/${product.id}`} className="btn-secondary flex-1 text-center text-xs py-2 px-2">Ver pieza</Link>
            {product.stock > 0 && user?.role === "consumer" && (
              <button onClick={() => addToCart(product.id, 1, product.price)} className="btn-primary text-xs py-2 px-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
