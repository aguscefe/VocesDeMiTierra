import { useState } from "react";
import { Link } from "react-router";
import type { ProducerProfile } from "../data/types";
import ImageWithFallback from "./ImageWithFallback";
export default function ArtisanCard({producer:p}:{producer:ProducerProfile}) {
 const [show,setShow]=useState(false);
 return <article data-reveal className="artisan-portrait" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)} onFocus={()=>setShow(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setShow(false);}}>
 <button className="portrait-button" aria-expanded={show} aria-label={`Origen de ${p.artisan_name || p.workshop_name}`} onClick={()=>setShow(v=>!v)}><ImageWithFallback src={p.profile_image} alt={p.artisan_name || p.workshop_name}/><span className="portrait-origin">Conoce su origen</span></button>
 {show&&<div className="origin-popover"><span className="eyebrow">Desde Quintana Roo</span><strong translate="no">{p.community}</strong><p translate="no">{p.municipality === p.community ? "Quintana Roo" : `${p.municipality}, Quintana Roo`}</p><p>{p.craft_types.join(" · ")}</p><Link to={`/productor/${p.id}`}>Conocer el taller →</Link></div>}
 <Link className="artisan-name" to={`/productor/${p.id}`} translate="no">{p.artisan_name || p.workshop_name}</Link><p className="artisan-place" translate="no">{p.community}</p><p className="artisan-specialty">{p.craft_types.slice(0,2).join(" · ")}</p><span className="artisan-meta">{p.total_products} piezas · {p.years_experience} años de experiencia</span>
 </article>;
}
