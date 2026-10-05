import { Link } from "react-router";
import { useApp } from "../context/AppContext";
import { getStore } from "../data/store";
import ImageWithFallback from "../components/ImageWithFallback";

export default function Cart() {
  const { user, cart, removeFromCart, updateQuantity, cartTotal } = useApp();
  const store = getStore();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-display text-2xl font-bold text-[#3A2923] mb-3">Inicia sesión para ver tu carrito</h2>
        <Link to="/login" className="btn-primary">Iniciar sesión</Link>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl font-bold text-[#3A2923] mb-3">Tu carrito está vacío</h2>
        <p className="text-[#6B6763] mb-6">Explora el catálogo y agrega las piezas que te gusten.</p>
        <Link to="/catalogo" className="btn-primary">Explorar artesanías</Link>
      </div>
    </div>
  );

  const shipping = 130;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3A2923] mb-6 sm:mb-8">Tu carrito</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => {
              const product = store.products.find(p => p.id === item.product_id);
              const producer = product ? store.producer_profiles.find(pp => pp.id === product.producer_id) : null;
              if (!product) return null;
              return (
                <div key={item.product_id} className="bg-white border border-[#EDE8DF] rounded-xl p-3 sm:p-4 grid grid-cols-[4rem_1fr] sm:flex gap-3 sm:gap-4">
                  <Link to={`/producto/${product.id}`} className="shrink-0">
                    <ImageWithFallback src={product.featured_image} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/producto/${product.id}`} className="font-semibold text-[#3A2923] text-sm hover:text-[#B85C38] line-clamp-2">{product.name}</Link>
                    {producer && <p className="text-xs text-[#6B6763] mt-0.5">{producer.workshop_name} · {producer.community}</p>}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-[#EDE8DF] rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-2.5 py-1 text-[#6B6763] hover:bg-[#F5EFE4] text-sm">−</button>
                        <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-2.5 py-1 text-[#6B6763] hover:bg-[#F5EFE4] text-sm">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.product_id)} className="text-xs text-[#B33A3A] hover:underline">Eliminar</button>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-auto shrink-0 text-left sm:text-right border-t border-[#EDE8DF] pt-2 sm:border-0 sm:pt-0">
                    <p className="font-semibold text-[#B85C38]">${(item.unit_price * item.quantity).toLocaleString("es-MX")}</p>
                    <p className="text-xs text-[#6B6763]">${item.unit_price.toLocaleString("es-MX")} c/u</p>
                  </div>
                </div>
              );
            })}
            <Link to="/catalogo" className="btn-secondary text-sm inline-flex">← Seguir comprando</Link>
          </div>

          {/* Resumen */}
          <div className="bg-white border border-[#EDE8DF] rounded-xl p-5 h-fit sticky top-24">
            <h2 className="font-semibold text-[#3A2923] mb-4">Resumen del pedido</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-[#6B6763]">Subtotal</span>
                <span className="font-medium">${cartTotal.toLocaleString("es-MX")} MXN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6763]">Envío estimado</span>
                <span className="font-medium">${shipping.toLocaleString("es-MX")} MXN</span>
              </div>
              <div className="border-t border-[#EDE8DF] pt-2 flex justify-between">
                <span className="font-semibold text-[#3A2923]">Total</span>
                <span className="font-bold text-[#B85C38] text-lg">${total.toLocaleString("es-MX")} MXN</span>
              </div>
            </div>
            <div className="text-xs text-[#6B6763] bg-[#F5EFE4] rounded-lg p-2 mb-4">
              El costo de envío final se calculará con tu código postal al momento del pago.
            </div>
            <Link to="/checkout" className="btn-primary w-full justify-center">Proceder al pago</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
