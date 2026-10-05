import { Link } from "react-router";

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="bg-[#3A2923] py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-white">{title}</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 text-[#6B6763] space-y-4 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <PageShell title="Aviso de privacidad">
      <p className="text-[#3A2923] font-semibold">Voces de mi Tierra — Aviso de Privacidad</p>
      <p>Los datos personales que podría recabar la plataforma incluyen: nombre, correo electrónico, teléfono, dirección de envío y datos de identificación del productor. Estos se usan exclusivamente para la funcionalidad de la plataforma.</p>
      <p>Los artesanos mantienen el control sobre qué información cultural se publica bajo su nombre o comunidad, mediante el sistema de consentimientos.</p>
      <p>Para ejercer derechos ARCO (Acceso, Rectificación, Cancelación, Oposición), contacta al administrador mediante la sección de soporte.</p>
    </PageShell>
  );
}

export function Terms() {
  return (
    <PageShell title="Términos y condiciones">
      <p className="text-[#3A2923] font-semibold">Voces de mi Tierra — Términos de uso</p>
      <p><strong className="text-[#3A2923]">Comisiones:</strong> La plataforma retiene el 10% del precio de venta como comisión. El productor recibe el 90% restante. El envío lo paga el comprador directamente y no afecta la ganancia del productor.</p>
      <p><strong className="text-[#3A2923]">Pagos:</strong> Todos los pagos se procesan en modo de prueba. No se realizan cargos reales.</p>
      <p><strong className="text-[#3A2923]">Contenido cultural:</strong> La plataforma no certifica la autenticidad de ninguna pieza. La información de procedencia es "declarada y autorizada por el productor".</p>
      <p><strong className="text-[#3A2923]">Envíos:</strong> El productor es responsable de preparar el paquete y registrar la guía de envío. El comprador paga el costo de envío.</p>
    </PageShell>
  );
}

export function ShippingReturns() {
  return (
    <PageShell title="Envíos y devoluciones">
      <p className="text-[#3A2923] font-semibold">Política de envíos y devoluciones</p>
      <p><strong className="text-[#3A2923]">Envíos:</strong> El costo de envío se calcula antes del pago con base en el código postal del comprador, el peso y las dimensiones del paquete. El productor selecciona la paquetería y registra la guía de envío desde su panel.</p>
      <p><strong className="text-[#3A2923]">Tiempos:</strong> El tiempo estimado de entrega es de 5 a 10 días hábiles desde el envío, dependiendo del destino.</p>
      <p><strong className="text-[#3A2923]">Devoluciones:</strong> Se aceptan devoluciones en casos de defecto de fabricación comprobado. El comprador tiene 7 días naturales desde la recepción para iniciar el proceso desde su panel. No se aceptan devoluciones por cambio de opinión en piezas personalizadas.</p>
      <p><strong className="text-[#3A2923]">Cancelaciones:</strong> Los pedidos pueden cancelarse antes de que el productor confirme la preparación. Una vez enviado, no es posible cancelar.</p>
    </PageShell>
  );
}

export function AboutUs() {
  return (
    <PageShell title="Quiénes somos">
      <p className="text-[#3A2923] font-semibold text-lg">Voces de mi Tierra</p>
      <p>Voces de mi Tierra es una plataforma digital de comercialización artesanal que conecta el trabajo artesanal con quienes buscan piezas con identidad.</p>
      <p>Nuestro propósito es conectar a artesanas y artesanos de comunidades originarias de Quintana Roo con compradores de todo México y el mundo, preservando la identidad cultural y garantizando un pago justo al productor.</p>
      <p>La plataforma no pretende certificar la autenticidad de ninguna pieza, ni substituye la relación directa entre el artesano y la comunidad. Su función es facilitar la visibilidad digital y la comercialización con respeto a la procedencia cultural declarada.</p>
    </PageShell>
  );
}

export function FAQ() {
  const faqs = [
    { q: "¿Dónde consulto mis pedidos?", a: "En tu panel encontrarás el resumen de tus compras, sus productos y el estado de cada pedido." },
    { q: "¿Dónde conozco a los productores?", a: "En la sección Productores puedes explorar los talleres y consultar sus piezas, materiales y técnicas de elaboración." },
    { q: "¿Cómo funciona el QR?", a: "Cada producto tiene un código QR único. Al escanearlo, accedes directamente a la ficha pública del producto con información cultural autorizada." },
    { q: "¿Qué es la trazabilidad cultural?", a: "Es la información de procedencia declarada por el productor: quién hizo la pieza, en qué comunidad, con qué técnica y materiales. No es una certificación oficial." },
    { q: "¿Por qué el texto en maya está como 'pendiente de validación'?", a: "Respetamos la lengua maya y no publicamos traducciones sin validación de hablantes autorizados. La plataforma está preparada para mostrar contenido bilingüe cuando esté validado." },
    { q: "¿Cuánto recibe el productor?", a: "El productor recibe el 90% del precio de venta. La plataforma retiene el 10% como comisión. El envío lo paga el comprador aparte." },
  ];
  return (
    <PageShell title="Preguntas frecuentes">
      <div className="space-y-4">
        {faqs.map(f => (
          <details key={f.q} className="border border-[#EDE8DF] rounded-xl overflow-hidden group">
            <summary className="px-5 py-4 font-semibold text-[#3A2923] cursor-pointer list-none flex items-center justify-between hover:bg-[#F5EFE4] transition-colors">
              {f.q}
              <span className="text-[#B85C38] text-lg group-open:rotate-180 transition-transform">›</span>
            </summary>
            <div className="px-5 pb-4 text-sm text-[#6B6763]">{f.a}</div>
          </details>
        ))}
      </div>
    </PageShell>
  );
}

export function Contact() {
  return (
    <PageShell title="Contacto">
      <p>Para dudas, sugerencias o reportes relacionados con la plataforma, utiliza el formulario de soporte dentro de la plataforma.</p>
      <div className="bg-white border border-[#EDE8DF] rounded-xl p-5 space-y-3">
        <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Nombre</label><input className="input-field" placeholder="Tu nombre" /></div>
        <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Correo</label><input className="input-field" type="email" placeholder="correo@ejemplo.mx" /></div>
        <div><label className="text-xs font-semibold text-[#3A2923] mb-1 block">Mensaje</label><textarea className="input-field h-24 resize-none" placeholder="Escribe tu mensaje..." /></div>
        <button className="btn-primary">Enviar mensaje (demo)</button>
      </div>
    </PageShell>
  );
}
