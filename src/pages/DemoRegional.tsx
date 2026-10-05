import { Link } from "react-router";

const DEMOS = [
  { n: 1, title: "Registrar productor", desc: "Formulario asistido de 8 pasos", path: "/registro", icon: "🎨", role: "any" },
  { n: 2, title: "Publicar una pieza", desc: "Flujo de publicación asistida", path: "/productor/nueva-publicacion", icon: "📸", role: "producer" },
  { n: 3, title: "Autorizar ficha cultural", desc: "Consentimiento cultural en paso 7 del flujo", path: "/productor/nueva-publicacion", icon: "✅", role: "producer" },
  { n: 4, title: "Ver QR de producto", desc: "QR de trazabilidad en ficha del producto", path: "/producto/prod1", icon: "📱", role: "any" },
  { n: 5, title: "Comprar como consumidor", desc: "Catálogo → ficha → carrito → checkout", path: "/catalogo", icon: "🛒", role: "consumer" },
  { n: 6, title: "Pago sandbox", desc: "Usa tarjeta 4242 4242 4242 4242", path: "/carrito", icon: "💳", role: "consumer" },
  { n: 7, title: "Gestionar pedido (productor)", desc: "Panel del productor → Pedidos", path: "/productor/dashboard", icon: "📦", role: "producer" },
  { n: 8, title: "Estadísticas del productor", desc: "Panel del productor → Estadísticas", path: "/productor/dashboard", icon: "📊", role: "producer" },
  { n: 9, title: "Estadísticas del consumidor", desc: "Panel del consumidor → Estadísticas", path: "/consumidor/dashboard", icon: "📈", role: "consumer" },
  { n: 10, title: "Panel administrativo", desc: "Métricas, usuarios, pedidos y comisiones", path: "/admin", icon: "⚙️", role: "admin" },
];

export default function DemoRegional() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="bg-gradient-to-br from-[#3A2923] to-[#315C4C] py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Demo Regional</h1>
          <p className="text-white/70">Recorrido interactivo por todas las funcionalidades de Voces de mi Tierra</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="bg-white border border-[#EDE8DF] rounded-xl p-5">
          <h2 className="font-semibold text-[#3A2923] mb-3">Acceso al recorrido</h2>
          <p className="text-sm text-[#6B6763]">Registra tu cuenta o inicia sesión. Las cuentas de demostración solo existen si el administrador habilitó los datos de ejemplo; utiliza la contraseña que te proporcionó.</p>
          <Link to="/login" className="text-sm text-[#B85C38] hover:underline mt-2 block">Iniciar sesión →</Link>
        </div>

        {/* Flujo de demo */}
        <div>
          <h2 className="font-semibold text-[#3A2923] mb-4">Flujo de demostración</h2>
          <div className="space-y-3">
            {DEMOS.map(demo => (
              <Link to={demo.path} key={demo.n} className="flex items-center gap-4 bg-white border border-[#EDE8DF] rounded-xl p-4 hover:border-[#B85C38] hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#F5EFE4] flex items-center justify-center font-bold text-[#3A2923] text-sm group-hover:bg-[#B85C38] group-hover:text-white transition-colors shrink-0">
                  {demo.n}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#3A2923]">{demo.icon} {demo.title}</p>
                  <p className="text-xs text-[#6B6763]">{demo.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {demo.role !== "any" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: demo.role === "admin" ? "#3A292315" : demo.role === "producer" ? "#315C4C15" : "#B85C3815", color: demo.role === "admin" ? "#3A2923" : demo.role === "producer" ? "#315C4C" : "#B85C38" }}>
                      {demo.role === "consumer" ? "Consumidor" : demo.role === "producer" ? "Productor" : "Admin"}
                    </span>
                  )}
                  <svg className="w-4 h-4 text-[#6B6763] group-hover:text-[#B85C38]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
