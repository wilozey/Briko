import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Compass, Leaf, ChevronRight, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";

const categoryIcons: Record<string, string> = {
  "Immune Support": "🛡️",
  "Mental Wellness": "🧠",
  "Healing": "💚",
  "Digestive Health": "🌿",
  "Respiratory": "🫁",
  "Skin Care": "✨",
  "Pain Relief": "💆",
  "Energy": "⚡",
};

const categoryColors: Record<string, string> = {
  "Immune Support": "from-emerald-500/20 to-green-500/10 border-emerald-500/30",
  "Mental Wellness": "from-violet-500/20 to-purple-500/10 border-violet-500/30",
  "Healing": "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
  "Digestive Health": "from-lime-500/20 to-green-500/10 border-lime-500/30",
  "Respiratory": "from-sky-500/20 to-blue-500/10 border-sky-500/30",
  "Skin Care": "from-rose-500/20 to-pink-500/10 border-rose-500/30",
  "Pain Relief": "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  "Energy": "from-yellow-500/20 to-amber-500/10 border-yellow-500/30",
};

export default function Explore() {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: categories } = trpc.plants.categories.useQuery();
  const { data: plants } = trpc.plants.byCategory.useQuery(
    { category: selectedCategory! },
    { enabled: !!selectedCategory }
  );
  const { data: allPlants } = trpc.plants.list.useQuery();

  // Plant of the Day - deterministic based on date
  const plantOfDay = useMemo(() => {
    if (!allPlants || allPlants.length === 0) return null;
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % allPlants.length;
    return allPlants[dayIndex];
  }, [allPlants]);

  return (
    <AppLayout>
      <div className="container py-8 max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Compass className="w-4 h-4" />
            {t("explore.title")}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("explore.title")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("explore.subtitle")}
          </p>
        </div>

        {/* Plant of the Day */}
        {plantOfDay && (
          <div className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {t("home.plantOfDay")}
            </h2>
            <Link href={`/plant/${plantOfDay.id}`}>
              <div className="botanical-card p-6 bg-gradient-to-r from-amber-500/10 via-primary/5 to-emerald-500/10 border border-amber-500/20 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Leaf className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {lang === "fr" && plantOfDay.commonNameFr ? plantOfDay.commonNameFr : plantOfDay.commonNameEn}
                    </h3>
                    <p className="text-sm text-muted-foreground italic mb-2">{plantOfDay.scientificName}</p>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {lang === "fr" && plantOfDay.descriptionFr ? plantOfDay.descriptionFr : plantOfDay.descriptionEn}
                    </p>
                    {plantOfDay.culturalTradition && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {plantOfDay.culturalTradition.split(",").map((trad: string) => (
                          <span key={trad.trim()} className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-700 border border-amber-500/20">
                            {trad.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-4 rounded-xl border text-center transition-all ${
              !selectedCategory
                ? "bg-primary/10 border-primary/30 ring-2 ring-primary/20"
                : "bg-card border-border hover:border-primary/20 hover:bg-primary/5"
            }`}
          >
            <span className="text-2xl mb-2 block">🌍</span>
            <span className="text-sm font-medium">{t("explore.allCategories")}</span>
          </button>
          {categories?.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-4 rounded-xl border text-center transition-all bg-gradient-to-br ${
                categoryColors[cat] || "from-gray-500/20 to-gray-500/10 border-gray-500/30"
              } ${
                selectedCategory === cat
                  ? "ring-2 ring-primary/20 shadow-md"
                  : "hover:shadow-md"
              }`}
            >
              <span className="text-2xl mb-2 block">{categoryIcons[cat] || "🌱"}</span>
              <span className="text-sm font-medium">{cat}</span>
            </button>
          ))}
        </div>

        {/* Plant List */}
        <div className="space-y-3">
          {(selectedCategory ? plants : allPlants)?.map((plant) => (
            <Link key={plant.id} href={`/plant/${plant.id}`}>
              <div className="botanical-card p-4 hover:shadow-md transition-all cursor-pointer flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-foreground">
                    {lang === "fr" && plant.commonNameFr ? plant.commonNameFr : plant.commonNameEn}
                  </h3>
                  <p className="text-xs text-muted-foreground italic">{plant.scientificName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {plant.category && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                        {plant.category}
                      </span>
                    )}
                    {plant.evidenceLevel && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                        {t(`evidence.${plant.evidenceLevel}` as any)}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
