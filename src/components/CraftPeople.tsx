import { useState } from "react";
const people = [
 {image:"bordados-retrato",title:"Bordados que dan color",text:"Flores, hilos y una pieza que se comparte con orgullo.",position:"50% 30%"},
 {image:"tejido-sombreros",title:"El ritmo del tejido",text:"Manos trabajando una fibra hasta darle forma.",position:"65% 30%"},
 {image:"barro-proceso",title:"Del barro a la pieza",text:"El oficio se descubre también en cada etapa de elaboración.",position:"40% 25%"},
 {image:"feria-madera",title:"Madera para compartir",text:"Cuencos, platos y objetos reunidos en un encuentro artesanal.",position:"46% 30%"},
 {image:"textiles-muestra",title:"Hilos y detalles",text:"Una mirada cercana al bordado y a sus acabados.",position:"50% 25%"},
 {image:"ceramica-muestra",title:"Formas de cerámica",text:"Una pieza terminada, compartida desde el espacio de trabajo.",position:"50% 28%"},
 {image:"feria-textiles",title:"Encuentros artesanales",text:"Textiles y piezas de distintos colores en un puesto de feria.",position:"50% 50%"},
 {image:"taller-figuras",title:"Figuras con carácter",text:"La creatividad toma forma entre herramientas y piezas del taller.",position:"70% 25%"},
 {image:"bordado-proceso",title:"Puntada a puntada",text:"El proceso detrás de una pieza bordada.",position:"65% 30%"},
];
export default function CraftPeople(){return <>{people.map(p=><CraftPerson key={p.image} person={p}/>)}</>}
function CraftPerson({person:p}:{person:typeof people[number]}){
 const [open,setOpen]=useState(false);
 return <article className="artisan-portrait craft-person" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onFocus={()=>setOpen(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}><button className="portrait-button" aria-expanded={open} aria-label={p.title} onClick={()=>setOpen(v=>!v)}><img src={`/design/fotos/${p.image}.png`} alt={p.title} loading="lazy" style={{objectPosition:p.position}}/><span className="portrait-origin">Conoce el oficio</span></button><h3 className="artisan-name">{p.title}</h3>{open&&<div className="origin-popover"><span className="eyebrow">Trabajo artesanal</span><strong>{p.title}</strong><p>{p.text}</p></div>}</article>;
}
