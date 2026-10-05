import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { getStore } from "../data/store";
import logoImg from "../imports/logo2.png";

type NavItem = { label: string; to: string };

const PUBLIC_NAV: NavItem[] = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Productores", to: "/productores" },
  { label: "Cómo funciona", to: "/como-funciona" },
  { label: "Trazabilidad", to: "/trazabilidad" },
];

export default function Header() {
  const { user, logout, cartCount, unreadCount } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const navigate = useNavigate();

  const dashPath = user?.role === "admin" ? "/admin" : user?.role === "producer" ? "/productor/dashboard" : "/consumidor/dashboard";
  const producerProfile = user?.role === "producer"
    ? getStore().producer_profiles.find(profile => profile.user_id === user.id)
    : undefined;
  const roleLabel = user?.role === "admin" ? "Administración" : user?.role === "producer" ? "Productor" : user?.role === "consumer" ? "Comprador" : "";
  const homePath = user?.role === "admin" || user?.role === "producer" ? dashPath : "/";
  const showShoppingTools = !user || user.role === "consumer";

  const roleNav: NavItem[] = user?.role === "producer"
    ? [
        { label: "Mi panel", to: "/productor/dashboard" },
        { label: "Nueva publicación", to: "/productor/nueva-publicacion" },
        ...(producerProfile ? [{ label: "Vista de mi tienda", to: `/productor/${producerProfile.id}` }] : []),
      ]
    : user?.role === "admin"
      ? [
          { label: "Panel administrativo", to: "/admin" },
          { label: "Ver catálogo público", to: "/catalogo" },
        ]
      : PUBLIC_NAV;

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/catalogo?q=${encodeURIComponent(searchQ.trim())}`);
    setSearchOpen(false);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#EDE8DF] bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to={homePath} className="flex shrink-0 items-center gap-2">
          <img src={logoImg} alt="Logo Voces de mi Tierra" className="h-10 w-10 object-contain" />
          <span className="hidden font-display text-lg font-semibold leading-tight text-[#3A2923] sm:block">
            Voces de<br />mi Tierra
          </span>
          {roleLabel && (
            <span className="hidden rounded-full bg-[#F5EFE4] px-2.5 py-1 text-xs font-semibold text-[#315C4C] md:inline-flex">
              {roleLabel}
            </span>
          )}
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {roleNav.map(item => (
            <Link key={item.to} to={item.to} className="rounded-lg px-3 py-2 text-sm text-[#6B6763] transition-colors hover:bg-[#F5EFE4] hover:text-[#B85C38]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {showShoppingTools && (
            <button onClick={() => setSearchOpen(current => !current)} className="rounded-lg p-2 text-[#6B6763] transition-colors hover:bg-[#F5EFE4] hover:text-[#B85C38]" aria-label="Buscar">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
          )}

          {user?.role === "consumer" && (
            <>
              <Link to="/favoritos" className="relative hidden rounded-lg p-2 text-[#6B6763] transition-colors hover:bg-[#F5EFE4] hover:text-[#B85C38] sm:block" aria-label="Favoritos">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </Link>
              <Link to="/carrito" className="relative rounded-lg p-2 text-[#6B6763] transition-colors hover:bg-[#F5EFE4] hover:text-[#B85C38]" aria-label="Carrito">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B85C38] text-[10px] font-bold text-white">{cartCount}</span>}
              </Link>
            </>
          )}

          {user ? (
            <div className="group relative hidden sm:block">
              <button className="flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-[#F5EFE4]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B85C38] text-xs font-bold text-white">{user.name[0]}</span>
                <span className="hidden text-left md:block">
                  <span className="block max-w-32 truncate text-sm font-semibold text-[#25211F]">{user.name}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-[#6B6763]">{roleLabel}</span>
                </span>
                <svg className="h-4 w-4 text-[#6B6763]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div className="invisible absolute right-0 top-full w-56 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-xl border border-[#EDE8DF] bg-white shadow-xl">
                  <div className="border-b border-[#EDE8DF] px-4 py-3">
                    <p className="truncate text-sm font-semibold text-[#25211F]">{user.name}</p>
                    <p className="truncate text-xs text-[#6B6763]">{user.email}</p>
                  </div>
                  <Link to={dashPath} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#25211F] hover:bg-[#F5EFE4]">
                    Mi panel
                    {unreadCount > 0 && <span className="ml-auto rounded-full bg-[#D18B24] px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>}
                  </Link>
                  {user.role === "producer" && producerProfile && (
                    <Link to={`/productor/${producerProfile.id}`} className="block px-4 py-2.5 text-sm text-[#25211F] hover:bg-[#F5EFE4]">Vista como cliente</Link>
                  )}
                  <button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-sm text-[#B33A3A] hover:bg-[#F5EFE4]">Cerrar sesión</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary hidden px-3 py-2 text-sm sm:flex">Iniciar sesión</Link>
              <Link to="/registro" className="btn-primary hidden px-3 py-2 text-sm sm:flex">Quiero vender</Link>
            </>
          )}

          <div className="ml-1 hidden items-center gap-1 xl:flex">
            <button className="rounded bg-[#B85C3815] px-2 py-1 text-xs font-medium text-[#B85C38]">ES</button>
            <button className="rounded px-2 py-1 text-xs text-[#6B6763] hover:bg-[#F5EFE4]">Maya</button>
          </div>

          <button onClick={() => setMenuOpen(current => !current)} className="rounded-lg p-2 text-[#6B6763] hover:bg-[#F5EFE4] lg:hidden" aria-label="Menú">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && showShoppingTools && (
        <div className="border-t border-[#EDE8DF] bg-white px-4 py-3">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-xl gap-2">
            <input autoFocus className="input-field flex-1" placeholder="Buscar artesanías, técnicas, comunidades..." value={searchQ} onChange={event => setSearchQ(event.target.value)} />
            <button type="submit" className="btn-primary">Buscar</button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-[#EDE8DF] bg-white px-4 py-4 lg:hidden">
          {roleNav.map(item => (
            <Link key={item.to} to={item.to} className="py-2 text-sm font-medium text-[#25211F]" onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          {user?.role === "consumer" && (
            <>
              <Link to="/favoritos" className="py-2 text-sm font-medium text-[#25211F]" onClick={() => setMenuOpen(false)}>Favoritos</Link>
              <Link to="/carrito" className="py-2 text-sm font-medium text-[#25211F]" onClick={() => setMenuOpen(false)}>Carrito ({cartCount})</Link>
            </>
          )}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="py-2 text-left text-sm text-[#B33A3A]">Cerrar sesión</button>
          ) : (
            <>
              <Link to="/login" className="py-2 text-sm font-medium text-[#B85C38]" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
              <Link to="/registro" className="py-2 text-sm font-medium text-[#315C4C]" onClick={() => setMenuOpen(false)}>Quiero vender</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
