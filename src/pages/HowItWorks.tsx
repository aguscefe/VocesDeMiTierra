import { Link } from "react-router";
import CraftBanner from "../components/CraftBanner";
const buyers=[
 ["Explora el catálogo","Encuentra texturas y colores que conecten contigo. Filtra por categoría, material o municipio.","/demo/productos/abanico.png"],
 ["Conoce su origen","Descubre el taller, los materiales y la historia que acompaña a la pieza.","/demo/artesanos/lucia.png"],
 ["Elige y compra","Calcula el envío, guarda tus favoritos y completa el pago de demostración: no se realizan cargos.","/design/compra-artesanal.png"],
 ["Acompaña su viaje","Consulta tus pedidos, su guía y las direcciones de origen y destino desde tu panel.","/demo/productos/canasta.png"]
];
const sellers=[
 ["Comparte tu taller","Registra tus datos, tu comunidad y la actividad artesanal que quieres compartir.","/demo/artesanos/ana.png"],
 ["Publica tus piezas","Sube fotografías, descripción, materiales y tu certificado para revisión.","/demo/artesanos/elena.png"],
 ["Prepara cada pedido","Recibe notificaciones, prepara el paquete y registra su guía de envío.","/design/compra-artesanal.png"],
 ["Consulta tus ventas","Tu panel muestra el importe de productos, la comisión del 10% y el neto del 90%.","/demo/artesanos/mateo.png"]
];
export default function HowItWorks(){return <div className="craft-page"><CraftBanner title="De unas manos a otras" description="Un camino sencillo para descubrir, compartir y acercarte al trabajo artesanal." eyebrow="¿Cómo funciona?"/><div className="info-container">{[["Para compradores",buyers],["Para productores",sellers]].map(([title,steps])=><section key={String(title)} className="journey-section"><span className="eyebrow">Conecta con lo hecho a mano</span><h2>{String(title)}</h2><div className="journey-grid">{(steps as string[][]).map(([name,desc,image],i)=><article key={name} data-reveal className={`journey-card tone-${i}`}><div className="journey-photo"><img src={image} alt={name} loading="lazy"/><span>{String(i+1).padStart(2,"0")}</span></div><div className="journey-copy"><h3>{name}</h3><p>{desc}</p></div></article>)}</div></section>)}<section className="fees-section" data-reveal><div><span className="eyebrow">Cuentas claras</span><h2>Comisiones y costos</h2><p>La comisión se calcula sobre el precio del producto. El envío se muestra por separado.</p></div><div className="fees-grid"><article className="tone-0"><strong>10%</strong><h3>Servicio de plataforma</h3><p>Comisión sobre el precio de la pieza.</p></article><article className="tone-1"><strong>90%</strong><h3>Para el productor</h3><p>Neto del precio de sus productos.</p></article><article className="tone-2"><strong>Envío</strong><h3>Cotización aparte</h3><p>Lo cubre el comprador al completar el pedido.</p></article></div></section><div className="text-center"><Link to="/registro" className="btn-primary">Compartir mi trabajo →</Link></div></div></div>}
