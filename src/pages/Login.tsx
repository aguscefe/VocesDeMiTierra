import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import logoImg from "../imports/logo2.png";
import { getStore } from "../data/store";

const DEMO_ACCOUNTS = [
  { label: "Entrar como consumidor", email: "consumidor@vocesdemo.mx", color: "#B85C38", icon: "🛒" },
  { label: "Entrar como productor", email: "productor@vocesdemo.mx", color: "#315C4C", icon: "🎨" },
  { label: "Entrar como administrador", email: "admin@vocesdemo.mx", color: "#3A2923", icon: "⚙️" },
];

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function destinationFor(accountEmail: string) {
    const role = getStore().users.find(account => account.email === accountEmail)?.role;
    if (role === "producer") return "/productor/dashboard";
    if (role === "admin") return "/admin";
    if (role === "consumer") return "/consumidor/dashboard";
    return "/";
  }

  async function authenticate(email: string, password: string) {
    setError(""); setLoading(true);
    try { await login(email, password); navigate(destinationFor(email)); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); void authenticate(email, password); }
  function quickLogin(email: string) { void authenticate(email, "Demo1234"); }

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoImg} alt="Voces de mi Tierra" className="w-20 h-20 object-contain mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold text-[#3A2923]">Voces de mi Tierra</h1>
          <p className="text-[#6B6763] mt-1">Plataforma artesanal de Quintana Roo</p>
        </div>

        {/* Acceso rápido demo */}
        {import.meta.env.VITE_DEMO_LOGIN === "true" && <>
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-5 mb-5 shadow-sm">
          <p className="text-xs font-semibold text-[#6B6763] uppercase tracking-wider mb-3 text-center">Acceso rápido</p>
          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} onClick={() => quickLogin(acc.email)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all hover:shadow-sm"
                style={{ borderColor: acc.color, color: acc.color }}>
                <span className="text-xl">{acc.icon}</span>
                <span>{acc.label}</span>
                <span className="ml-auto text-xs font-normal opacity-60">Demo1234</span>
              </button>
            ))}
          </div>
        </div>

        </>}
        {/* Formulario */}
        <div className="bg-white rounded-xl border border-[#EDE8DF] p-6 shadow-sm">
          <h2 className="font-semibold text-[#3A2923] mb-5">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#3A2923] mb-1 block">Correo electrónico</label>
              <input className="input-field" type="email" placeholder="correo@ejemplo.mx" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#3A2923] mb-1 block">Contraseña</label>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && <p className="text-sm text-[#B33A3A] bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
              {loading ? <><div className="spinner mr-2" style={{ width: 16, height: 16 }} />Verificando...</> : "Iniciar sesión"}
            </button>
          </form>
          <div className="border-t border-[#EDE8DF] mt-5 pt-4 text-center">
            <p className="text-sm text-[#6B6763]">¿No tienes cuenta?{" "}
              <Link to="/registro" className="text-[#B85C38] font-medium hover:underline">Crear una cuenta</Link>
            </p>
          </div>
        </div>

        {import.meta.env.VITE_DEMO_LOGIN === "true" && <p className="text-center text-xs text-[#6B6763] mt-5">
          Contraseña de acceso rápido: <span className="font-mono font-bold text-[#3A2923]">Demo1234</span> para las cuentas de acceso rápido
        </p>}
      </div>
    </div>
  );
}
