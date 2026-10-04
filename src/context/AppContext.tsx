import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import type { User, CartItem } from "../data/types";
import { api } from "../data/api";
import { applyState, refreshStore, getStore, getCart, getFavorites, getUnreadCount, updateCart, toggleFavorite as favorite } from "../data/store";
interface AppContextType {
 user: User | null; login: (email: string, password: string) => Promise<boolean>; logout: () => void;
 cart: CartItem[]; addToCart: (id: string, quantity: number, price: number) => Promise<boolean>;
 removeFromCart: (id: string) => void; updateQuantity: (id: string, quantity: number) => void;
 clearCart: () => void; cartTotal: number; cartCount: number; favorites: string[];
 toggleFavorite: (id: string) => void; unreadCount: number; refreshUnread: () => void;
}
const Context = createContext<AppContextType | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<User | null>(null);
 const [ready, setReady] = useState(false); const [error, setError] = useState("");
 const [revision, setRevision] = useState(0); const queue = useRef(Promise.resolve());
 useEffect(() => {
  const update = (event: Event) => { setRevision(v => v + 1); const data = (event as CustomEvent).detail; if (data && "user" in data) setUser(data.user); }; window.addEventListener("vmt-state", update);
  refreshStore().then(data => { setUser(data.user); setReady(true); }).catch(e => setError(e.message));
  return () => window.removeEventListener("vmt-state", update);
 }, []);
 void revision;
 const cart = user ? getCart(user.id).items : []; const favorites = user ? getFavorites(user.id) : [];
 const unreadCount = user ? getUnreadCount(user.id) : 0;
 function run(fn: () => Promise<unknown>): Promise<boolean> {
  const next = queue.current.then(fn).then(() => true).catch(e => { setError(e.message); return false; });
  queue.current = next.then(() => {}); return next;
 }
 async function login(email: string, password: string) { const data = await api("login", "POST", { email, password }); applyState(data); setUser(data.user); return true; }
 function logout() { run(async () => { await api("logout", "POST"); setUser(null); await refreshStore(); }); }
 function change(fn: (items: CartItem[]) => CartItem[]) { if (!user || user.role !== "consumer") { setError("Inicia sesión como consumidor para comprar."); return Promise.resolve(false); } const uid = user.id; return run(() => updateCart(uid, fn(getCart(uid).items))); }
 const value: AppContextType = { user, login, logout, cart, favorites, unreadCount,
  cartTotal: cart.reduce((s, i) => s + i.quantity * i.unit_price, 0), cartCount: cart.reduce((s, i) => s + i.quantity, 0),
  addToCart: (id, quantity, price) => change(items => items.some(i => i.product_id === id) ? items.map(i => i.product_id === id ? { ...i, quantity: i.quantity + quantity } : i) : [...items, { product_id: id, quantity, unit_price: price }]),
  removeFromCart: id => change(items => items.filter(i => i.product_id !== id)),
  updateQuantity: (id, quantity) => change(items => quantity <= 0 ? items.filter(i => i.product_id !== id) : items.map(i => i.product_id === id ? { ...i, quantity } : i)),
  clearCart: () => change(() => []), toggleFavorite: id => { if (user) run(() => favorite(user.id, id)); }, refreshUnread: () => run(refreshStore),
 };
 if (!ready) return <div className="p-12 text-center" role="status">{error || "Cargando catálogo…"}{error && <button className="btn-primary ml-4" onClick={() => location.reload()}>Reintentar</button>}</div>;
 return <Context.Provider value={value}>{error && <div role="alert" className="bg-red-100 p-4 text-red-900">{error}<button className="ml-4" onClick={() => setError("")}>Cerrar</button></div>}{children}</Context.Provider>;
}
export function useApp() { const ctx = useContext(Context); if (!ctx) throw new Error("AppProvider requerido"); return ctx; }
