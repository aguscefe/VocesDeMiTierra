import { Link } from "react-router";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="bg-[#315C4C] py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">¿Cómo funciona?</h1>
          <p className="text-white/70">Todo lo que necesitas saber sobre Voces de mi Tierra</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <div className="bg-white border border-[#EDE8DF] rounded-2xl p-7">
          <h2 className="font-display text-2xl font-semibold text-[#3A2923] mb-4">Para compradores</h2>
          <div className="space-y-5">
            {[
              { n: "1", title: "Explora el catálogo", desc: "Navega por más de 20 artesanías de 7 comunidades de Quintana Roo. Filtra por categoría, técnica, material o municipio." },
              { n: "2", title: "Conoce la pieza y su origen", desc: "Cada producto tiene una ficha con historia cultural autorizada por el productor, técnica, materiales y un código QR de trazabilidad." },
              { n: "3", title: "Agrega al carrito y paga", desc: "Cotiza el envío con tu código postal, agrega al carrito y paga de forma segura. En modo demo puedes usar la tarjeta 4242." },
              { n: "4", title: "Sigue tu pedido", desc: "Recibe notificaciones y sigue el estado de tu pedido hasta la entrega. El productor registra la guía y puedes copiarla en cualquier momento." },
            ].map(s => (
              <div key={s.n} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#B85C38] text-white flex items-center justify-center font-bold text-sm shrink-0">{s.n}</div>
                <div>
                  <h3 className="font-semibold text-[#3A2923]">{s.title}</h3>
                  <p className="text-sm text-[#6B6763] mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#EDE8DF] rounded-2xl p-7">
          <h2 className="font-display text-2xl font-semibold text-[#3A2923] mb-4">Para productores</h2>
          <div className="space-y-5">
            {[
              { n: "1", title: "Regístrate como productor", desc: "Completa el formulario de 8 pasos con tus datos personales, taller, comunidad y actividad artesanal." },
              { n: "2", title: "Publica tus piezas", desc: "El flujo asistido de 8 pasos te guía para fotografiar, describir y dar contexto cultural a cada pieza de forma sencilla." },
              { n: "3", title: "Recibe y prepara pedidos", desc: "Cuando se confirma un pago, recibes una notificación. Preparas el paquete, seleccionas paquetería y registras la guía." },
              { n: "4", title: "Recibe tu pago", desc: "Recibes el 90% del precio de venta. La plataforma retiene un 10% de comisión por el servicio digital de publicación y pago." },
            ].map(s => (
              <div key={s.n} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#315C4C] text-white flex items-center justify-center font-bold text-sm shrink-0">{s.n}</div>
                <div>
                  <h3 className="font-semibold text-[#3A2923]">{s.title}</h3>
                  <p className="text-sm text-[#6B6763] mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F5EFE4] border border-[#EDE8DF] rounded-2xl p-7">
          <h2 className="font-display text-2xl font-semibold text-[#3A2923] mb-3">Comisiones y costos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-display text-3xl font-bold text-[#B85C38]">10%</p>
              <p className="text-[#6B6763] mt-1">Comisión de plataforma sobre el precio del producto</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-display text-3xl font-bold text-[#315C4C]">90%</p>
              <p className="text-[#6B6763] mt-1">Monto que recibe el productor</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-display text-3xl font-bold text-[#3A2923]">0%</p>
              <p className="text-[#6B6763] mt-1">El envío lo paga el comprador directamente</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link to="/registro" className="btn-primary text-base py-3 px-8">Registrarme como productor</Link>
        </div>
      </div>
    </div>
  );
}
