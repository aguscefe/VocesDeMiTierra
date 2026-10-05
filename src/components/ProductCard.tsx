import { Link, useNavigate } from "react-router";
import type { Product, ProducerProfile } from "../data/types";
import { useApp } from "../context/AppContext";
import ImageWithFallback from "./ImageWithFallback";
export default function ProductCard({product:p,producer}:{product:Product;producer?:ProducerProfile}) {
 const {user,favorites,toggleFavorite,addToCart}=useApp(); const navigate=useNavigate();const fav=favorites.includes(p.id);
 return <article data-reveal className="piece-card product-motion group">
 <Link className="piece-link" to={`/producto/${p.id}`} aria-label={p.name}><span className="sr-only">{p.name}</span></Link>
 <div className="piece-photo"><ImageWithFallback loading="lazy" src={p.featured_image} alt={p.name}/><span className="piece-category">{p.category}</span>
 <button className={`piece-heart ${fav ? "is-favorite" : ""}`} onClick={()=>user?void toggleFavorite(p.id):navigate("/login")} aria-pressed={fav} aria-label={fav?"Quitar de favoritos":"Guardar en favoritos"}><svg className={fav?"favorite-pop":""} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
 {p.stock===0?<span className="piece-stock">Agotado</span>:p.stock<=3?<span className="piece-stock">Últimas {p.stock} piezas</span>:null}</div>
 <div className="piece-copy"><p className="piece-author" translate="no">{producer?.artisan_name || producer?.workshop_name}</p><h3>{p.name}</h3><p className="piece-location" translate="no">{producer?.community} · Quintana Roo</p><div className="piece-bottom"><strong translate="no">{p.price.toLocaleString("es-MX",{style:"currency",currency:"MXN"})}<small> MXN</small></strong>{p.stock>0&&user?.role==="consumer"&&<button className="piece-add" aria-label="Agregar al carrito" onClick={()=>void addToCart(p.id,1,p.price)}>＋</button>}</div><span className="piece-provenance">{p.certificate_status==="approved"?"Documento validado":"Procedencia declarada"}</span></div>
 </article>;
}
