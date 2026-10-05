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
      <CraftBanner title="Manos, voces y talleres" description="Acércate a quienes dan forma a cada pieza y descubre su origen en Quintana Roo." image="/demo/artesanos/mateo.png"/>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {producers.map(pp=><ArtisanCard key={pp.id} producer={pp}/>)}
        </div>
      </div>
    </div>
  );
}
