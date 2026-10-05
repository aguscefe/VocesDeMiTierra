import { useApp as useDataRefresh } from "../context/AppContext";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { getStore } from "../data/store";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Textiles y bordados", "Madera", "Fibras naturales", "Cerámica", "Joyería artesanal", "Decoración", "Accesorios"];
const MUNICIPALITIES = ["Felipe Carrillo Puerto", "José María Morelos", "Tulum", "Bacalar", "Lázaro Cárdenas", "Benito Juárez", "Cozumel"];
const SORT_OPTIONS = [
  { value: "recent", label: "Más reciente" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "popular", label: "Más popular" },
];

export default function Catalog() {
  useDataRefresh();
  const [params, setParams] = useSearchParams();
  const store = getStore();

  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("categoria") || "");
  const [municipality, setMunicipality] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const products = useMemo(() => {
    let list = store.products.filter(p => p.status === "published");
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()) || p.technique.toLowerCase().includes(q.toLowerCase()));
    if (category) list = list.filter(p => p.category === category);
    if (municipality) {
      const producers = store.producer_profiles.filter(pp => pp.community === municipality || pp.municipality === municipality).map(pp => pp.id);
      list = list.filter(p => producers.includes(p.producer_id));
    }
    if (minPrice) list = list.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) list = list.filter(p => p.price <= parseFloat(maxPrice));
    if (onlyAvailable) list = list.filter(p => p.stock > 0);
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "popular") list = [...list].sort((a, b) => b.favorites_count - a.favorites_count);
    else list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }, [store, q, category, municipality, minPrice, maxPrice, onlyAvailable, sort]);

  function clearFilters() { setQ(""); setCategory(""); setMunicipality(""); setMinPrice(""); setMaxPrice(""); setOnlyAvailable(false); setSort("recent"); }
  const hasFilters = q || category || municipality || minPrice || maxPrice || onlyAvailable;

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="bg-[#3A2923] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Catálogo de artesanías</h1>
          <p className="text-[#C4A99A]">Piezas únicas de comunidades originarias de Quintana Roo</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filtros sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:hidden mb-4">
              <button onClick={() => setFiltersOpen(s => !s)} className="btn-secondary w-full justify-center">
                {filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
                {hasFilters && <span className="ml-1 bg-[#B85C38] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">•</span>}
              </button>
            </div>
            <div className={`${filtersOpen ? "block" : "hidden"} lg:block bg-white rounded-xl border border-[#EDE8DF] p-5 space-y-6`}>
              <div>
                <label className="text-xs font-semibold text-[#3A2923] uppercase tracking-wider mb-2 block">Búsqueda</label>
                <input className="input-field" placeholder="Nombre, técnica..." value={q} onChange={e => setQ(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3A2923] uppercase tracking-wider mb-2 block">Categoría</label>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(category === cat ? "" : cat)} className="accent-[#B85C38]" />
                      <span className={category === cat ? "text-[#B85C38] font-medium" : "text-[#6B6763]"}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3A2923] uppercase tracking-wider mb-2 block">Municipio / Comunidad</label>
                <select className="input-field" value={municipality} onChange={e => setMunicipality(e.target.value)}>
                  <option value="">Todos</option>
                  {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3A2923] uppercase tracking-wider mb-2 block">Precio MXN</label>
                <div className="flex gap-2">
                  <input className="input-field" placeholder="Mín" type="number" min="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  <input className="input-field" placeholder="Máx" type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#B85C38]" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} />
                <span className="text-sm text-[#25211F]">Solo disponibles</span>
              </label>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-[#B33A3A] hover:underline w-full text-left">Limpiar filtros</button>
              )}
            </div>
          </aside>

          {/* Resultados */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm text-[#6B6763]">
                <span className="font-semibold text-[#25211F]">{products.length}</span> {products.length === 1 ? "pieza" : "piezas"} encontradas
              </p>
              <select className="input-field w-auto text-sm py-2" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display text-xl font-semibold text-[#3A2923] mb-2">Sin resultados</h3>
                <p className="text-[#6B6763] mb-6">No encontramos artesanías con esos filtros.</p>
                <button onClick={clearFilters} className="btn-primary">Limpiar filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map(p => {
                  const producer = store.producer_profiles.find(pp => pp.id === p.producer_id);
                  return <ProductCard key={p.id} product={p} producer={producer} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
