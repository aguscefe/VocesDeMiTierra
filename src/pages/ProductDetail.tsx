import QRCode from "qrcode";
import { useEffect } from "react";
import { api } from "../data/api";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { getStore } from "../data/store";
import { useApp } from "../context/AppContext";
import ImageWithFallback from "../components/ImageWithFallback";
import ProductCard from "../components/ProductCard";


function QRDisplay({ productId }: { productId: string }) {
 const qr = getStore().qr_codes.find(q => q.product_id === productId && q.active);
 const [image, setImage] = useState("");
 useEffect(() => { if (qr) void QRCode.toDataURL(qr.public_url, { width: 600 }).then(setImage); }, [qr?.public_url]);
 if (!qr) return <p>QR no disponible para esta publicación.</p>;
 return <div className="bg-[#F5EFE4] rounded-xl p-5"><h3>Código QR de trazabilidad</h3>{image && <><img src={image} alt="QR de la ficha del producto" className="w-40" /><a href={image} download={`qr-${productId}.png`} className="btn-secondary">Descargar PNG</a></>}<button onClick={() => window.print()} className="btn-secondary ml-3">Imprimir ficha</button><p>{qr.scans} escaneos</p><a href={qr.public_url}>{qr.public_url}</a></div>;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  useEffect(() => { if (id) { void api("events", "POST", { product_id: id, event_type: "product_view" }).catch(() => {}); if (new URLSearchParams(location.search).get("qr") === "1") void api("events", "POST", { product_id: id, event_type: "qr_scan" }).catch(() => {}); } }, [id]);
  const navigate = useNavigate();
  const { user, addToCart, favorites, toggleFavorite } = useApp();
  const store = getStore();

  const product = store.products.find(p => p.id === id);
  const producer = product ? store.producer_profiles.find(pp => pp.id === product.producer_id) : null;
  const cultural = product ? store.cultural_records.find(cr => cr.product_id === product.id) : null;
  const reviews = product ? store.reviews.filter(r => r.product_id === product.id && r.status === "published") : [];
  const related = product ? store.products.filter(p => p.id !== product.id && p.category === product.category && p.status === "published").slice(0, 3) : [];

  const [qty, setQty] = useState(1);
  const [postal, setPostal] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product || !producer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display text-2xl font-bold text-[#3A2923] mb-2">Producto no encontrado</h2>
          <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  const gallery = [product.featured_image, ...product.gallery].filter(Boolean);
  const isFav = favorites.includes(product.id);
  const commission = product.price * 0.1;
  const net = product.price - commission;
  const total = product.price * qty + (shipping || 0);

  function calcShipping() {
    if (!product || !/^\d{5}$/.test(postal)) return;
    const dimensions = product.package_dimensions?.split("x").map(Number) || [];
    const volumeWeight = dimensions.length === 3 ? dimensions.reduce((a, b) => a * b, 1) / 5000 : 0;
    const weight = Math.max(.1, product.package_weight || 0, volumeWeight) * qty;
    setShipping(130 + Math.max(0, Math.ceil(weight - 1)) * 20);
  }

  async function handleAddToCart() {
    if (!product) return;
    if (!await addToCart(product.id, qty, product.price)) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleBuyNow() {
    if (!product) return;
    if (!await addToCart(product.id, qty, product.price)) return;
    navigate("/carrito");
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Breadcrumb */}
      <div className="bg-[#F5EFE4] border-b border-[#EDE8DF] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-[#6B6763]">
          <Link to="/" className="hover:text-[#B85C38]">Inicio</Link>
          <span>›</span>
          <Link to="/catalogo" className="hover:text-[#B85C38]">Catálogo</Link>
          <span>›</span>
          <Link to={`/catalogo?categoria=${encodeURIComponent(product.category)}`} className="hover:text-[#B85C38]">{product.category}</Link>
          <span>›</span>
          <span className="text-[#25211F] font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-8 sm:mb-12">
          {/* Galería */}
          <div>
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-[#F5EFE4] mb-3">
              <ImageWithFallback src={gallery[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              {user && (
                <button onClick={() => toggleFavorite(product.id)} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow hover:scale-110 transition-transform">
                  <svg className={`w-5 h-5 ${isFav ? "fill-[#B85C38] stroke-[#B85C38]" : "stroke-[#6B6763] fill-none"}`} viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${imgIdx === i ? "border-[#B85C38]" : "border-transparent"}`}>
                    <ImageWithFallback src={img} alt={`Vista ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1">
                <span className="text-xs text-[#315C4C] font-semibold bg-[#315C4C]/10 px-2 py-0.5 rounded-full">{product.category}</span>
                {product.certificate_status === "approved" && <p className="text-xs text-[#315C4C] mt-3">Documento de autenticidad revisado por la plataforma.</p>}
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3A2923] mt-2 leading-tight">{product.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <p className="font-display text-3xl sm:text-4xl font-bold text-[#B85C38]">${product.price.toLocaleString("es-MX")}</p>
              <span className="text-[#6B6763]">MXN</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {product.stock > 0 ? (
                <span className="text-sm text-[#2F7D50] font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  {product.stock} disponibles
                </span>
              ) : (
                <span className="text-sm text-[#B33A3A] font-medium">Agotado</span>
              )}
              <span className="text-[#EDE8DF]">·</span>
              <span className="text-xs text-[#6B6763]">{product.views} consultas</span>
            </div>

            {/* Info del productor */}
            <Link to={`/productor/${producer.id}`} className="flex items-center gap-3 bg-[#F5EFE4] rounded-xl p-4 mb-5 hover:bg-[#EDE8DF] transition-colors">
              <ImageWithFallback src={producer.profile_image} alt={producer.workshop_name} className="w-12 h-12 rounded-full object-cover border border-[#EDE8DF]" />
              <div>
                <p className="font-semibold text-sm text-[#3A2923]">{producer.workshop_name}</p>
                <p className="text-xs text-[#6B6763]">{producer.community}, {producer.municipality}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[#D6A73C] text-xs">★</span>
                  <span className="text-xs font-semibold">{producer.rating}</span>
                  <span className="text-xs text-[#6B6763]">· {producer.years_experience} años de experiencia</span>
                </div>
              </div>
            </Link>

            {/* Detalles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
              <div className="bg-white border border-[#EDE8DF] rounded-lg p-3">
                <p className="text-xs text-[#6B6763] mb-1">Técnica</p>
                <p className="font-medium text-[#3A2923]">{product.technique}</p>
              </div>
              <div className="bg-white border border-[#EDE8DF] rounded-lg p-3">
                <p className="text-xs text-[#6B6763] mb-1">Tiempo de elaboración</p>
                <p className="font-medium text-[#3A2923]">{product.production_time}</p>
              </div>
              <div className="bg-white border border-[#EDE8DF] rounded-lg p-3 sm:col-span-2">
                <p className="text-xs text-[#6B6763] mb-1">Materiales</p>
                <div className="flex flex-wrap gap-1">
                  {product.materials.map(m => <span key={m} className="text-xs bg-[#F5EFE4] text-[#3A2923] px-2 py-0.5 rounded-full">{m}</span>)}
                </div>
              </div>
            </div>

            {/* Cotización de envío */}
            <div className="bg-white border border-[#EDE8DF] rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold text-[#3A2923] mb-3">Calcular envío</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input className="input-field flex-1" placeholder="Código postal (ej. 77500)" value={postal} onChange={e => setPostal(e.target.value.replace(/\D/g,"").slice(0,5))} maxLength={5} />
                <button onClick={calcShipping} className="btn-selva py-2 px-4 text-sm" disabled={postal.length < 5}>Calcular</button>
              </div>
              {shipping !== null && (
                <div className="mt-3 p-3 bg-[#F5EFE4] rounded-lg">
                  <p className="text-sm text-[#6B6763]">Envío estimado: <span className="font-bold text-[#3A2923]">${shipping.toFixed(2)} MXN</span></p>
                  <p className="text-xs text-[#6B6763]">Entrega estimada: 7-10 días hábiles (simulado)</p>
                </div>
              )}
            </div>

            {/* Cantidad y acciones */}
            {product.stock > 0 && (
              <div className="mb-5">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <label className="text-sm font-medium text-[#3A2923]">Cantidad:</label>
                  <div className="flex items-center border border-[#EDE8DF] rounded-lg overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-[#6B6763] hover:bg-[#F5EFE4] transition-colors">−</button>
                    <span className="px-4 py-2 font-medium text-[#3A2923] min-w-[3rem] text-center">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 text-[#6B6763] hover:bg-[#F5EFE4] transition-colors">+</button>
                  </div>
                  <span className="text-sm text-[#6B6763]">de {product.stock} disponibles</span>
                </div>
                {shipping !== null && (
                  <p className="text-sm text-[#6B6763] mb-4">Total estimado: <span className="font-bold text-[#B85C38]">${total.toLocaleString("es-MX")} MXN</span> (inc. envío)</p>
                )}
                {user?.role === "consumer" ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleAddToCart} className={`btn-primary flex-1 ${added ? "bg-[#2F7D50]" : ""}`}>
                      {added ? "✓ Agregado al carrito" : "Agregar al carrito"}
                    </button>
                    <button onClick={handleBuyNow} className="btn-selva px-5">Comprar ahora</button>
                  </div>
                ) : !user ? (
                  <div className="flex gap-3">
                    <Link to="/login" className="btn-primary flex-1 text-center">Iniciar sesión para comprar</Link>
                  </div>
                ) : null}
              </div>
            )}

            {/* Aviso cultural */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex gap-2">
              <span className="shrink-0">ℹ️</span>
              Información declarada y autorizada por el productor. No constituye una certificación oficial de autenticidad.
            </div>
          </div>
        </div>

        {/* Descripción y proceso */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-[#EDE8DF] rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold text-[#3A2923] mb-3">Descripción</h2>
            <p className="text-[#6B6763] leading-relaxed">{product.description}</p>
          </div>

          {cultural && (
            <div className="bg-[#315C4C]/5 border border-[#315C4C]/20 rounded-xl p-6">
              <h2 className="font-display text-xl font-semibold text-[#3A2923] mb-3">{product.id.startsWith("demo_producto_") ? "Historia e inspiración" : "Historia cultural autorizada"}</h2>
              {cultural.video_url && (
                <video src={cultural.video_url} controls className="mb-4 aspect-video w-full rounded-xl bg-black" aria-label="Video del artesano explicando el proceso" />
              )}
              <p className="text-[#6B6763] leading-relaxed mb-4">{cultural.cultural_description}</p>
              <div>
                <p className="text-xs font-semibold text-[#315C4C] uppercase tracking-wider mb-1">Proceso de elaboración</p>
                <p className="text-sm text-[#6B6763] leading-relaxed">{cultural.process}</p>
              </div>
              {cultural.maya_content_status === "pending" && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                  Contenido en maya pendiente de validación
                </div>
              )}
            </div>
          )}
        </div>

        {/* QR */}
        <div className="mb-12">
          <QRDisplay productId={product.id} />
        </div>

        {/* Reseñas */}
        {reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-semibold text-[#3A2923] mb-5">Reseñas de compradores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map(r => (
                <div key={r.id} className="bg-white border border-[#EDE8DF] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#B85C38] flex items-center justify-center text-white text-xs font-bold">{r.consumer_name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-[#3A2923]">{r.consumer_name}</p>
                      <div className="flex text-[#D6A73C] text-xs">{Array(r.rating).fill("★").join("")}</div>
                    </div>
                    <span className="ml-auto text-xs text-[#6B6763]">{r.created_at}</span>
                  </div>
                  <p className="text-sm text-[#6B6763]">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Política de devolución */}
        <div className="bg-[#F5EFE4] rounded-xl p-5 mb-12 text-sm text-[#6B6763]">
          <h3 className="font-semibold text-[#3A2923] mb-2">Política de devolución</h3>
          <p>Si recibes un producto con defecto de fabricación, tienes 7 días naturales desde la recepción para solicitar una devolución a través de tu panel de comprador. El envío de retorno corre por cuenta de la plataforma en caso de defecto comprobado. No se aceptan devoluciones por cambio de opinión en artículos personalizados o hechos a pedido.</p>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#3A2923] mb-5">Piezas relacionadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => {
                const rp = store.producer_profiles.find(pp => pp.id === p.producer_id);
                return <ProductCard key={p.id} product={p} producer={rp} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
