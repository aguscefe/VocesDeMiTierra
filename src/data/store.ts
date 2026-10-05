import { api } from "./api";
import type { AppStore, Cart, CartItem, Order } from "./types";
let store: AppStore = { certificates: [], users: [], producer_profiles: [], products: [], cultural_records: [], orders: [], payments: [], reviews: [], notifications: [], qr_codes: [], favorites: [], carts: [], support_tickets: [], consents: [], audit_logs: [] };
let revision = 0;
export const getStore = () => store;
export const getRevision = () => revision;
export function applyState(data: { store: AppStore }) { store = data.store; revision++; window.dispatchEvent(new CustomEvent("vmt-state", { detail: data })); }
export async function refreshStore() { const data = await api("state"); applyState(data); return data; }
export async function mutate(path: string, method: string, body?: unknown) { const data = await api(path, method, body); await refreshStore(); return data; }
export const resetStore = () => { throw new Error("El reinicio de datos del servidor requiere un administrador y una copia de seguridad."); };
export function getCart(consumer_id: string): Cart { return store.carts.find(c => c.consumer_id === consumer_id) || { id: "", consumer_id, items: [] }; }
export async function updateCart(_id: string, items: CartItem[]) { await mutate("cart", "PUT", { items }); }
export function getFavorites(id: string) { return store.favorites.filter(f => f.consumer_id === id).map(f => f.product_id); }
export async function toggleFavorite(_id: string, product_id: string) { await mutate(`favorites/${product_id}`, "POST"); }
export async function updateOrderStatus(order_id: string, status: Order["status"], extra?: Partial<Order>) { try { let fields = extra || {}; if (status === "shipped") { const carrier = prompt("Paquetería:"); const tracking_number = prompt("Número de guía:"); if (!carrier || !tracking_number) return; fields = { carrier, tracking_number }; } await mutate(`orders/${order_id}`, "PATCH", { status, ...fields }); } catch (e) { alert((e as Error).message); } }
export function getUnreadCount(id: string) { return store.notifications.filter(n => n.user_id === id && !n.read).length; }
export async function markNotificationsRead(_id: string) { await mutate("notifications/read", "POST"); }
