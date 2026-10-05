export default function Traceability() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="bg-gradient-to-br from-[#3A2923] to-[#315C4C] py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Trazabilidad cultural</h1>
          <p className="text-white/70">Cómo conectamos cada pieza con su origen y creador</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          <strong>Aviso importante:</strong> La información de procedencia en esta plataforma es <em>declarada y autorizada por el productor</em>. No constituye una certificación oficial de autenticidad por parte de ninguna institución gubernamental o cultural.
        </div>
        <div className="bg-white border border-[#EDE8DF] rounded-xl p-6 space-y-4">
          <h2 className="font-display text-xl font-semibold text-[#3A2923]">¿Qué es la trazabilidad cultural?</h2>
          <p className="text-[#6B6763] leading-relaxed">Cada pieza en nuestra plataforma tiene asociada una <strong>ficha de trazabilidad</strong> que incluye:</p>
          <ul className="space-y-2 text-[#6B6763] text-sm">
            {["Nombre del productor o taller", "Comunidad y municipio de origen", "Técnica artesanal utilizada", "Materiales empleados", "Historia o contexto cultural de la pieza (autorizado por el productor)", "Código QR único que conecta la pieza física con su ficha digital", "Estado del contenido en lengua maya (cuando aplica)"].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="text-[#2F7D50] shrink-0 mt-0.5">✓</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-[#EDE8DF] rounded-xl p-6 space-y-4">
          <h2 className="font-display text-xl font-semibold text-[#3A2923]">Código QR de trazabilidad</h2>
          <p className="text-[#6B6763] leading-relaxed">Al escanear el código QR de cualquier pieza física adquirida en nuestra plataforma, accedes directamente a su ficha digital con toda la información cultural disponible. Este código es único e intransferible para cada pieza publicada.</p>
          <div className="bg-[#F5EFE4] rounded-lg p-4 text-sm text-[#6B6763]">
            <p className="font-semibold text-[#3A2923] mb-1">En modo demo:</p>
            <p>Los QR de demostración redirigen a la ficha pública del producto en esta plataforma. En producción, cada QR tendría una URL única y permanente.</p>
          </div>
        </div>
        <div className="bg-white border border-[#EDE8DF] rounded-xl p-6">
          <h2 className="font-display text-xl font-semibold text-[#3A2923] mb-3">Consentimiento cultural</h2>
          <p className="text-[#6B6763] text-sm leading-relaxed">Cada productor autoriza explícitamente qué información puede publicarse sobre su trabajo y su comunidad. El sistema de consentimiento permite:</p>
          <ul className="mt-3 space-y-1 text-sm text-[#6B6763]">
            {["Seleccionar qué datos se comparten (nombre, comunidad, fotografías, historia, técnica)", "Establecer vigencia del consentimiento", "Solicitar retiro de información en cualquier momento", "Indicar si se autoriza uso en redes sociales"].map(item => <li key={item} className="flex items-start gap-2"><span className="text-[#B85C38]">→</span>{item}</li>)}
          </ul>
        </div>
        <div className="bg-[#315C4C]/5 border border-[#315C4C]/20 rounded-xl p-5 text-sm text-[#315C4C]">
          <p className="font-semibold mb-1">Sobre el contenido en lengua maya</p>
          <p>La interfaz está preparada para mostrar contenido en español y maya. El contenido en maya requiere validación de hablantes autorizados antes de su publicación. En esta versión de demostración, todos los textos están etiquetados como <em>"Contenido en maya pendiente de validación"</em> hasta contar con traducciones verificadas.</p>
        </div>
      </div>
    </div>
  );
}
