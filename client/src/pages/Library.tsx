import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import EvidenceBadge from "@/components/EvidenceBadge";
import { Search, Leaf, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function Library() {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allPlants, isLoading: loadingAll } = trpc.plants.list.useQuery();
  const { data: searchResults, isLoading: loadingSearch } = trpc.plants.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  const plants = searchQuery.length >= 2 ? searchResults : allPlants;
  const isLoading = searchQuery.length >= 2 ? loadingSearch : loadingAll;

  return (
    <AppLayout>
    <div className="container py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {t("library.title")}
        </h1>
        <p className="text-muted-foreground">
          {lang === "en"
            ? "Browse our curated collection of medicinal plants from around the world."
            : "Parcourez notre collection de plantes médicinales du monde entier."}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={t("library.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-card border-border/60 text-base"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* No results */}
      {!isLoading && plants && plants.length === 0 && (
        <div className="text-center py-20">
          <Leaf className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">{t("library.noResults")}</p>
        </div>
      )}

      {/* Plant Grid */}
      {!isLoading && plants && plants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} lang={lang} />
          ))}
        </div>
      )}
    </div>
    </AppLayout>
  );
}

function PlantCard({ plant, lang }: { plant: any; lang: string }) {
  const name = lang === "fr" && plant.commonNameFr ? plant.commonNameFr : plant.commonNameEn;
  const description = lang === "fr" && plant.descriptionFr ? plant.descriptionFr : plant.descriptionEn;

  return (
    <Link href={`/plant/${plant.id}`}>
      <div className="botanical-card overflow-hidden cursor-pointer group h-full">
        {/* Plant image placeholder */}
        <div className="h-48 bg-gradient-to-br from-botanical-light to-botanical/20 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <Leaf className="w-16 h-16 text-primary/30" />
          <div className="absolute bottom-3 left-3">
            <EvidenceBadge level={plant.evidenceLevel} />
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground italic mb-3">{plant.scientificName}</p>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
