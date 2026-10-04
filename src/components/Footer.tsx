import { Link } from "react-router";
import logoImg from "../imports/logo2.png";

export default function Footer() {
  return (
    <footer className="bg-[#3A2923] text-[#F5EFE4] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain" />
            <span className="font-display text-lg font-semibold leading-tight">Voces de<br/>mi Tierra</span>
          </div>
          <p className="text-sm text-[#C4A99A] leading-relaxed">Plataforma digital de comercialización artesanal de comunidades originarias de Quintana Roo.</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-[#D6A73C]">Explorar</h4>
          <div className="flex flex-col gap-2">
            <Link to="/catalogo" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Catálogo</Link>
            <Link to="/productores" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Productores</Link>
            <Link to="/como-funciona" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Cómo funciona</Link>
            <Link to="/trazabilidad" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Trazabilidad cultural</Link>
            <Link to="/quienes-somos" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Quiénes somos</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-[#D6A73C]">Soporte</h4>
          <div className="flex flex-col gap-2">
            <Link to="/preguntas-frecuentes" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Preguntas frecuentes</Link>
            <Link to="/envios-devoluciones" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Envíos y devoluciones</Link>
            <Link to="/contacto" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Contacto</Link>
            <Link to="/demo-regional" className="text-sm text-[#D6A73C] hover:text-white transition-colors">Demo regional ↗</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-[#D6A73C]">Legal</h4>
          <div className="flex flex-col gap-2">
            <Link to="/privacidad" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Aviso de privacidad</Link>
            <Link to="/terminos" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Términos y condiciones</Link>
            <Link to="/envios-devoluciones" className="text-sm text-[#C4A99A] hover:text-white transition-colors">Política de envíos</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p className="text-xs text-[#C4A99A]">© 2026 Voces de mi Tierra. Todos los derechos reservados.</p>
        <p className="text-xs text-[#C4A99A]">Hecho con respeto para las comunidades originarias de Quintana Roo 🌿</p>
      </div>
    </footer>
  );
}
