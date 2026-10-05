import { useState } from "react";
interface Props extends React.ImgHTMLAttributes<HTMLImageElement> { fallbackSrc?: string; }
function Image({ src, alt, fallbackSrc, className, style, onLoad, onError, ...rest }: Props) {
 const [failed, setFailed] = useState(false);
 const [fallback, setFallback] = useState(false);
 const current = fallback ? fallbackSrc : src;
 if (!current || failed) return <div role="img" aria-label={alt || "Imagen no disponible"} className={`bg-[#F5EFE4] flex items-center justify-center ${className || ""}`} style={style}><span className="text-xs text-[#6B6763] p-3">Imagen no disponible</span></div>;
 // Keep the image in layout while loading: hiding a lazy image prevents loading
 // on some browsers. Native rendering also handles cache hits without onLoad races.
 return <img {...rest} src={current} alt={alt} className={className} style={style} decoding="async" onLoad={onLoad} onError={event => { if (!fallback && fallbackSrc && fallbackSrc !== src) setFallback(true); else setFailed(true); onError?.(event); }} />;
}
export default function ImageWithFallback(props: Props) { return <Image key={`${props.src}|${props.fallbackSrc}`} {...props} />; }
