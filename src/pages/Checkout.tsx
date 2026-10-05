import { api } from "../data/api";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useApp } from "../context/AppContext";
import { getStore, refreshStore } from "../data/store";

type Step = "datos" | "pago" | "confirmacion";
type PayMethod = "card" | "transfer" | "pending" | "paypal";

const TEST_CARDS = [
  { number: "4242 4242 4242 4242", desc: "Pago aprobado", result: "approved" as const },
  { number: "4000 0000 0000 0002", desc: "Pago rechazado", result: "declined" as const },
];

export default function Checkout() {
  const { user, cart, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();
  const store = getStore();

  const [step, setStep] = useState<Step>("datos");
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.delivery_address || "");
  const [postal, setPostal] = useState(user?.delivery_postal || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [method, setMethod] = useState<PayMethod>("card");
  const [cardNum, setCardNum] = useState("4242 4242 4242 4242");
  const [paypalAuthorized, setPaypalAuthorized] = useState(false);
  const [cardExp] = useState("12/28");
  const [cardCvc] = useState("123");
  const [processing, setProcessing] = useState(false);
  const [payResult, setPayResult] = useState<"approved" | "declined" | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{ order_number: string; tx_id: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shipping, setShipping] = useState(0);
  const [paidTotal, setPaidTotal] = useState(0);
  const checkoutKey = useRef(crypto.randomUUID());
  const total = cartTotal + shipping;

  if (!user || (cart.length === 0 && step !== "confirmacion")) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl text-[#3A2923] mb-4">Carrito vacío</h2>
          <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  function validateDatos() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nombre requerido";
    if (!address.trim()) e.address = "Dirección requerida";
    if (!/^\d{5}$/.test(postal)) e.postal = "Código postal válido requerido (5 dígitos)";
    if (!phone.trim()) e.phone = "Teléfono requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePago() {
    if (method === "paypal" && !paypalAuthorized) { setErrors({paypal:"Autoriza el pago para continuar."}); return false; }
    if (method !== "card") return true;
    const e: Record<string, string> = {};
    const raw = cardNum.replace(/\s/g, "");
    if (raw.length !== 16) e.cardNum = "Número de tarjeta inválido";
    if (!cardExp.match(/^\d{2}\/\d{2}$/)) e.cardExp = "Fecha inválida (MM/AA)";
    if (!/^\d{3}$/.test(cardCvc)) e.cardCvc = "CVC de 3 dígitos requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleDatosContinuar() {
    if (!validateDatos()) return;
    try { const quote = await api("checkout/quote", "POST", { postal }); setShipping(quote.shipping); setStep("pago"); }
    catch (e) { alert((e as Error).message); }
  }

  async function simulatePayment() {
    if (!validatePago() || processing) return;
    const raw = cardNum.replace(/\s/g, "");
    if (method === "card" && !["4242424242424242", "4000000000000002"].includes(raw)) { alert("Usa únicamente una tarjeta de prueba indicada."); return; }
    setProcessing(true);
    try {
      const result = await api("checkout", "POST", { address, postal, method, scenario: raw === "4000000000000002" ? "declined" : method === "pending" ? "pending" : "approved", idempotency_key: checkoutKey.current });
      if (result.declined) { setPayResult("declined"); return; }
      setPaidTotal(result.orders.reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0));
      setConfirmedOrder({ order_number: result.orders.map((o: { order_number: string }) => o.order_number).join(", "), tx_id: result.tx_id || "Pedido recuperado" });
      setStep("confirmacion"); setPayResult("approved"); await refreshStore();
    } catch (e) { alert((e as Error).message); } finally { setProcessing(false); }
  }

  if (step === "confirmacion" && confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white border border-[#EDE8DF] rounded-2xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-[#2F7D50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#2F7D50]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#3A2923] mb-2">¡Pedido registrado!</h2>
            <p className="text-[#6B6763] mb-4">Tu pedido ha sido recibido. Puedes consultar su estado en tu panel.</p>
            <div className="bg-[#F5EFE4] rounded-xl p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6763]">Número de pedido</span>
                <span className="font-mono font-bold text-[#3A2923]">{confirmedOrder.order_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6763]">ID de transacción</span>
                <span className="font-mono text-xs text-[#B85C38]">{confirmedOrder.tx_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6763]">Total del pedido</span>
                <span className="font-bold text-[#3A2923]">${paidTotal.toLocaleString("es-MX")} MXN</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/consumidor/dashboard" className="btn-primary w-full justify-center">Ver mis pedidos</Link>
              <Link to="/catalogo" className="btn-secondary w-full justify-center">Seguir comprando</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = ["datos", "pago"];
  const stepIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-[#3A2923] mb-2">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Datos del comprador", "Pago"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= stepIdx ? "bg-[#B85C38] text-white" : "bg-[#EDE8DF] text-[#6B6763]"}`}>{i + 1}</div>
              <span className={`text-sm hidden sm:block ${i === stepIdx ? "text-[#B85C38] font-semibold" : "text-[#6B6763]"}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-0.5 bg-[#EDE8DF] mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "datos" && (
              <div className="bg-white border border-[#EDE8DF] rounded-xl p-6 space-y-4">
                <h2 className="font-semibold text-[#3A2923] mb-2">Datos del comprador y dirección</h2>
                {([
                  { label: "Nombre completo", key: "name", value: name, set: setName, type: "text", required: true },
                  { label: "Dirección completa", key: "address", value: address, set: setAddress, type: "text", required: true },
                  { label: "Código postal", key: "postal", value: postal, set: setPostal, type: "text", required: true, maxLength: 5 },
                  { label: "Teléfono de contacto", key: "phone", value: phone, set: setPhone, type: "tel", required: true },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-[#3A2923] mb-1 block">{f.label}</label>
                    <input
                      className={`input-field ${errors[f.key] ? "border-[#B33A3A]" : ""}`}
                      type={f.type}
                      value={f.value as string}
                      onChange={e => (f.set as (v: string) => void)(e.target.value)}
                      required={f.required}
                    />
                    {errors[f.key] && <p className="text-xs text-[#B33A3A] mt-1">{errors[f.key]}</p>}
                  </div>
                ))}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  El productor es responsable de preparar y enviar el paquete. El comprador cubre el costo de envío.
                </div>
                <button onClick={handleDatosContinuar} className="btn-primary w-full justify-center">Continuar al pago</button>
              </div>
            )}

            {step === "pago" && (
              <div className="bg-white border border-[#EDE8DF] rounded-xl p-6 space-y-5">
                <p className="text-xs text-[#6B6763]">Pago de prueba · No se realizan cargos ni se solicitan datos financieros reales.</p>

                <div>
                  <label className="text-xs font-semibold text-[#3A2923] mb-2 block">Método de pago</label>
                  <div className="flex flex-col gap-2">
                    {([["card", "💳 Tarjeta de crédito o débito"], ["paypal", "PayPal"], ["transfer", "🏦 Transferencia"], ["pending", "⏳ Pagar después"]] as const).map(([v, l]) => (
                      <label key={v} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${method === v ? "border-[#B85C38] bg-[#B85C38]/5" : "border-[#EDE8DF]"}`}>
                        <input type="radio" name="method" value={v} checked={method === v} onChange={() => { setMethod(v); setErrors({}); }} className="accent-[#B85C38]" />
                        <span className="text-sm">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {method === "card" && (
                  <div className="space-y-3">
                    <p id="payment-test-fields" className="text-xs text-[#6B6763]">Datos de prueba precargados.</p>
                    <div className="bg-[#F5EFE4] rounded-lg p-3 text-xs">
                      <p className="font-semibold text-[#3A2923] mb-1">Selecciona el resultado de la compra:</p>
                      {TEST_CARDS.map(tc => (
                        <div key={tc.number} className="flex items-center gap-2 mt-1">
                          <button onClick={() => setCardNum(tc.number)} className="font-mono text-[#B85C38] hover:underline">{tc.desc}</button>
                          <span className={tc.result === "approved" ? "text-[#2F7D50]" : "text-[#B33A3A]"}>→ {tc.desc}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#3A2923] mb-1 block">Número de tarjeta</label>
                      <input className={`input-field font-mono ${errors.cardNum ? "border-[#B33A3A]" : ""}`} placeholder="4242 4242 4242 4242" value={cardNum}
                        readOnly aria-describedby="payment-test-fields" maxLength={19} />
                      {errors.cardNum && <p className="text-xs text-[#B33A3A] mt-1">{errors.cardNum}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#3A2923] mb-1 block">Fecha (MM/AA)</label>
                        <input className={`input-field ${errors.cardExp ? "border-[#B33A3A]" : ""}`} placeholder="12/28" value={cardExp}
                          readOnly maxLength={5} />
                        {errors.cardExp && <p className="text-xs text-[#B33A3A] mt-1">{errors.cardExp}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#3A2923] mb-1 block">CVC</label>
                        <input className={`input-field ${errors.cardCvc ? "border-[#B33A3A]" : ""}`} placeholder="123" value={cardCvc}
                          readOnly maxLength={3} />
                        {errors.cardCvc && <p className="text-xs text-[#B33A3A] mt-1">{errors.cardCvc}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {method === "paypal" && <section className="rounded-xl border border-blue-200 bg-blue-50 p-5"><h3 className="text-2xl font-bold text-[#003087] mb-3">PayPal</h3><p className="text-sm mb-4">Cuenta de prueba</p><label className="text-xs">Correo de la cuenta<input className="input-field mt-1" value="comprador@voces.example" readOnly /></label><p className="text-sm my-4">Importe: ${total.toLocaleString("es-MX")} MXN</p><button type="button" className="w-full rounded-full bg-[#FFC439] px-4 py-3 font-semibold text-[#003087]" onClick={()=>{setPaypalAuthorized(true);setErrors({});}}>{paypalAuthorized ? "Pago autorizado ✓" : "Autorizar pago"}</button>{errors.paypal&&<p className="text-red-700 text-sm mt-2">{errors.paypal}</p>}</section>}
                {method === "transfer" && <section className="rounded-xl border p-4"><h3 className="font-semibold">Transferencia</h3><p className="text-sm mt-2">La referencia se asignará al confirmar el pedido. Este pago de prueba no requiere depósitos.</p></section>}
                {payResult === "declined" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-[#B33A3A] font-semibold mb-1">Pago rechazado</p>
                    <p className="text-sm text-[#B33A3A] mb-3">Selecciona Pago aprobado para reintentar.</p>
                    <button onClick={() => setPayResult(null)} className="btn-primary text-sm">Reintentar</button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep("datos")} className="btn-secondary px-5">← Atrás</button>
                  {payResult !== "declined" && (
                    <button onClick={simulatePayment} className="btn-primary flex-1 justify-center" disabled={processing}>
                      {processing ? <><div className="spinner mr-2" style={{width:16,height:16}} />Procesando...</> : `Pagar $${total.toLocaleString("es-MX")} MXN`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="bg-white border border-[#EDE8DF] rounded-xl p-5 h-fit">
            <h2 className="font-semibold text-[#3A2923] mb-4">Resumen</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => {
                const product = store.products.find(p => p.id === item.product_id);
                return product ? (
                  <div key={item.product_id} className="flex gap-2 text-sm">
                    <span className="flex-1 text-[#3A2923] line-clamp-1">{product.name}</span>
                    <span className="text-[#6B6763] shrink-0">×{item.quantity}</span>
                    <span className="font-medium shrink-0">${(item.unit_price * item.quantity).toLocaleString("es-MX")}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="border-t border-[#EDE8DF] pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#6B6763]">
                <span>Subtotal</span><span>${cartTotal.toLocaleString("es-MX")} MXN</span>
              </div>
              <div className="flex justify-between text-[#6B6763]">
                <span>Envío</span><span>${shipping} MXN</span>
              </div>
              <div className="flex justify-between font-bold text-[#B85C38] text-base pt-1 border-t border-[#EDE8DF]">
                <span>Total</span><span>${total.toLocaleString("es-MX")} MXN</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-[#6B6763] bg-[#F5EFE4] rounded-lg p-2">
              El productor recibirá el {(cartTotal * 0.9).toLocaleString("es-MX")} MXN (90%) del subtotal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
