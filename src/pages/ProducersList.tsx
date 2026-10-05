import CraftPeople from "../components/CraftPeople";
import CraftBanner from "../components/CraftBanner";
import ArtisanCard from "../components/ArtisanCard";
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
      <CraftBanner variant="people" title="Manos, voces y talleres" description="Acércate a quienes dan forma a cada pieza y descubre su origen en Quintana Roo." image="/design/fotos/feria-madera.png"/>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <section className="people-gallery"><span className="eyebrow">Una mirada a los oficios</span><h2 className="font-display text-3xl mt-3">Personas, materiales y procesos</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><CraftPeople/></div></section><section className="mt-12"><span className="eyebrow">Talleres del catálogo</span><h2 className="font-display text-3xl mt-3 mb-5">Explora sus piezas</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {producers.map(pp=><ArtisanCard key={pp.id} producer={pp}/>)}
        </div></section>
      </div>
    </div>
  );
}
