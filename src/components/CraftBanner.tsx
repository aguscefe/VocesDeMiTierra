import type { ReactNode } from "react";
export default function CraftBanner({title,description,eyebrow="Hecho con alma · Quintana Roo",image="/demo/artesanos/ana.png",tone="teal",children}:{title:string;description:string;eyebrow?:string;image?:string;tone?:string;children?:ReactNode}) {
 return <section data-reveal className={`craft-banner banner-${tone}`}><div className="banner-inner"><div className="banner-copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p>{children}</div><div className="banner-photo"><img src={image} alt="Trabajo artesanal en Quintana Roo"/><span className="banner-photo-label">Manos que crean historias</span></div></div></section>;
}
