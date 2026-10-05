import { useEffect, useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function ImageWithFallback({ src, alt, fallbackSrc, className, style, ...rest }: Props) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {setError(false);setLoaded(false);}, [src]);

  if (error || !src) {
    return (
      <div className={`bg-[#F5EFE4] flex items-center justify-center ${className || ""}`} style={style}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#EDE8DF"/>
          <path d="M10 28l8-10 6 7 4-5 8 8H10z" fill="#D6C9B8"/>
          <circle cx="27" cy="14" r="3" fill="#D6C9B8"/>
        </svg>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className={`bg-[#F5EFE4] animate-pulse ${className || ""}`} style={style} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className || ""} ${loaded ? "" : "hidden"}`}
        style={style}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...rest}
      />
    </>
  );
}
