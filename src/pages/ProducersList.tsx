import { useApp as useDataRefresh } from "../context/AppContext";
import { Link } from "react-router";
import { getStore } from "../data/store";
import ImageWithFallback from "../components/ImageWithFallback";

export default function ProducersList() {
  useDataRefresh();
  const store = getStore();
  const producers = store.producer_profiles.filter(pp => pp.authorization_status === "approved");

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="bg-[#315C4C] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Productores y talleres</h1>
          <p className="text-white/70">Artesanas y artesanos de comunidades originarias de Quintana Roo</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {producers.map(pp => (
            <Link to={`/productor/${pp.id}`} key={pp.id} className="card p-5 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="relative mb-3">
                <ImageWithFallback src={pp.profile_image} alt={pp.workshop_name} className="w-24 h-24 rounded-full object-cover border-2 border-[#EDE8DF]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2F7D50] rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                </div>
              </div>
              <h3 className="font-semibold text-[#25211F]">{pp.workshop_name}</h3>
              <p className="text-xs text-[#6B6763] mt-0.5 mb-2">{pp.community}, {pp.municipality}</p>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-[#D6A73C] text-sm">★</span>
                <span className="text-sm font-semibold">{pp.rating}</span>
                <span className="text-xs text-[#6B6763]">· {pp.total_products} piezas</span>
              </div>
              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {pp.craft_types.slice(0,2).map(ct => <span key={ct} className="text-[10px] bg-[#F5EFE4] text-[#6B6763] px-2 py-0.5 rounded-full">{ct}</span>)}
              </div>
              <p className="text-xs text-[#6B6763]">{pp.years_experience} años · {pp.languages.join(" / ")}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
