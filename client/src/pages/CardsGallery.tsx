import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "../../../shared/i18n";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import EvidenceBadge from "@/components/EvidenceBadge";
import {
  Sparkles,
  BookOpen,
  Leaf,
  Apple,
  Pin,
  Bookmark,
  BookmarkCheck,
  Eye,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import StarRating from "@/components/StarRating";
import CardComments from "@/components/CardComments";

function CardTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "folklore":
      return <Sparkles className="h-4 w-4 text-amber-600" />;
    case "remedy":
      return <Leaf className="h-4 w-4 text-emerald-600" />;
    case "nutrition":
      return <Apple className="h-4 w-4 text-orange-600" />;
    default:
      return <BookOpen className="h-4 w-4 text-green-700" />;
  }
}

function CardTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    folklore: "bg-amber-100 text-amber-800 border-amber-300",
    remedy: "bg-emerald-100 text-emerald-800 border-emerald-300",
    nutrition: "bg-orange-100 text-orange-800 border-orange-300",
    plant: "bg-green-100 text-green-800 border-green-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[type] || colors.plant}`}>
      <CardTypeIcon type={type} />
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function CardRatingSection({ cardId, isAuthenticated }: { cardId: number; isAuthenticated: boolean }) {
  const { data: avgRating } = trpc.ratings.getAverage.useQuery({ cardId });
  const { data: userRating } = trpc.ratings.getUserRating.useQuery(
    { cardId },
    { enabled: isAuthenticated }
  );
  const utils = trpc.useUtils();
  const rateMutation = trpc.ratings.rate.useMutation({
    onSuccess: () => {
      utils.ratings.getAverage.invalidate({ cardId });
      utils.ratings.getUserRating.invalidate({ cardId });
    },
  });

  return (
    <div className="flex items-center gap-2 mb-3">
      <StarRating
        value={userRating?.score || 0}
        onChange={(score) => {
          if (!isAuthenticated) {
            toast.error("Sign in to rate");
            return;
          }
          rateMutation.mutate({ cardId, score });
        }}
        readonly={!isAuthenticated}
        size="sm"
      />
      {avgRating && avgRating.average > 0 && (
        <span className="text-xs text-muted-foreground">
          {avgRating.average.toFixed(1)} ({avgRating.count})
        </span>
      )}
    </div>
  );
}

function GalleryCard({
  card,
  lang,
  isAuthenticated,
}: {
  card: any;
  lang: "en" | "fr";
  isAuthenticated: boolean;
}) {
  const title = lang === "fr" && card.titleFr ? card.titleFr : card.titleEn;
  const content = lang === "fr" && card.contentFr ? card.contentFr : card.contentEn;
  const utils = trpc.useUtils();

  const saveMutation = trpc.gallery.save.useMutation({
    onSuccess: () => {
      toast.success(t("gallery.saved", lang));
      utils.savedCards.list.invalidate();
    },
  });

  const unsaveMutation = trpc.gallery.unsave.useMutation({
    onSuccess: () => {
      toast.success(t("gallery.unsave", lang));
      utils.savedCards.list.invalidate();
    },
  });

  const { data: isSaved } = trpc.gallery.isSaved.useQuery(
    { cardId: card.id },
    { enabled: isAuthenticated }
  );

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error(lang === "fr" ? "Connectez-vous pour sauvegarder" : "Sign in to save cards");
      return;
    }
    if (isSaved) {
      unsaveMutation.mutate({ cardId: card.id });
    } else {
      saveMutation.mutate({ cardId: card.id });
    }
  };

  const isFolklore = card.cardType === "folklore";

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isFolklore
          ? "border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30"
          : "border-border"
      } ${card.isPinned ? "ring-2 ring-primary/20" : ""}`}
    >
      {card.isPinned && (
        <div className="absolute top-2 right-2 z-10">
          <Pin className="h-4 w-4 text-primary fill-primary" />
        </div>
      )}
      {card.isFeatured && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px]">
            <Sparkles className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTypeBadge type={card.cardType} />
            <CardTitle className="mt-2 text-base font-serif leading-tight line-clamp-2">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{content}</p>

        {card.evidenceLevel && (
          <div className="mb-3">
            <EvidenceBadge level={card.evidenceLevel} />
          </div>
        )}

        {card.cautionLevel && card.cautionLevel !== "low" && (
          <Badge
            variant="outline"
            className={`text-[10px] mb-3 ${
              card.cautionLevel === "critical"
                ? "border-red-400 text-red-700"
                : card.cautionLevel === "high"
                ? "border-orange-400 text-orange-700"
                : "border-yellow-400 text-yellow-700"
            }`}
          >
            {card.cautionLevel === "critical" ? "⚠️ Critical" : card.cautionLevel === "high" ? "⚠ High Caution" : "⚡ Moderate Caution"}
          </Badge>
        )}

        {/* Rating */}
        <CardRatingSection cardId={card.id} isAuthenticated={isAuthenticated} />

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Link href={card.shareSlug ? `/shared/${card.shareSlug}` : "#"}>
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground hover:text-foreground">
              <Eye className="h-3 w-3" />
              {t("gallery.viewDetail", lang)}
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            {card.shareSlug && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/shared/${card.shareSlug}`);
                  toast.success(lang === "fr" ? "Lien copié !" : "Link copied!");
                }}
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${isSaved ? "text-primary" : "text-muted-foreground"}`}
              onClick={handleSave}
              disabled={saveMutation.isPending || unsaveMutation.isPending}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 fill-current" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Comments (folklore cards get expanded comments) */}
        {isFolklore && <CardComments cardId={card.id} />}
      </CardContent>
    </Card>
  );
}

export default function CardsGallery() {
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "highest_rated" | "most_commented">("newest");
  const [culturalFilter, setCulturalFilter] = useState("");

  const { data: searchResults, isLoading: searchLoading } = trpc.search.gallery.useQuery(
    {
      query: searchQuery || undefined,
      cardType: activeFilter === "all" ? undefined : activeFilter,
      culturalTradition: culturalFilter || undefined,
      sortBy,
    },
    { enabled: !!searchQuery || sortBy !== "newest" || !!culturalFilter }
  );
  const isSearchActive = !!searchQuery || sortBy !== "newest" || !!culturalFilter;

  const { data: folkloreCards, isLoading: folkloreLoading } = trpc.gallery.folklore.useQuery({ limit: 6 });
  const { data: pinnedCards, isLoading: pinnedLoading } = trpc.gallery.pinned.useQuery();
  const { data: allCards, isLoading: allLoading } = trpc.gallery.list.useQuery(
    { cardType: activeFilter === "all" ? undefined : activeFilter }
  );
  const { data: dynamicCards } = trpc.gallery.dynamic.useQuery({ limit: 12 });

  const isLoading = folkloreLoading || pinnedLoading || allLoading;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
        {/* Hero Section */}
        <section className="relative py-16 px-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-green-50/20 to-transparent" />
          <div className="relative max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/60 text-amber-800 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              {lang === "fr" ? "Sagesse Botanique" : "Botanical Wisdom"}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t("gallery.title", lang)}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("gallery.subtitle", lang)}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-24">
          {/* ─── Search & Filters ─── */}
          <section className="mb-8 p-4 rounded-xl bg-card border border-border/50">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === "fr" ? "Rechercher des cartes..." : "Search cards by name, plant, or topic..."}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              >
                <option value="newest">{lang === "fr" ? "Plus récent" : "Newest"}</option>
                <option value="highest_rated">{lang === "fr" ? "Mieux noté" : "Highest Rated"}</option>
                <option value="most_commented">{lang === "fr" ? "Plus commenté" : "Most Commented"}</option>
              </select>
              <select
                value={culturalFilter}
                onChange={(e) => setCulturalFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              >
                <option value="">{lang === "fr" ? "Toutes traditions" : "All Traditions"}</option>
                <option value="Ayurveda">Ayurveda</option>
                <option value="TCM">Traditional Chinese Medicine</option>
                <option value="African">African Traditional</option>
                <option value="European">European Herbalism</option>
                <option value="Indigenous">Indigenous</option>
                <option value="Islamic">Islamic Medicine</option>
              </select>
            </div>
            {isSearchActive && searchResults && (
              <p className="text-xs text-muted-foreground mt-2">
                {searchResults.length} {lang === "fr" ? "résultat(s)" : "result(s)"}
              </p>
            )}
          </section>

          {/* ─── Search Results ─── */}
          {isSearchActive ? (
            <section className="mb-12">
              {searchLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((card: any) => (
                    <GalleryCard key={card.id} card={card} lang={lang} isAuthenticated={isAuthenticated} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {lang === "fr" ? "Aucun résultat trouvé" : "No results found"}
                  </p>
                </div>
              )}
            </section>
          ) : (
            <>
          {/* ─── Folklore Featured Section ─── */}
          {folkloreCards && folkloreCards.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {t("gallery.folklore.title", lang)}
                </h2>
              </div>
              <p className="text-muted-foreground mb-6 ml-9">
                {t("gallery.folklore.subtitle", lang)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {folkloreCards.map((card: any) => (
                  <GalleryCard
                    key={card.id}
                    card={card}
                    lang={lang}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ─── Pinned / Curated Section ─── */}
          {pinnedCards && pinnedCards.length > 0 && (
            <section className="mb-12">
              <Separator className="mb-8" />
              <div className="flex items-center gap-3 mb-2">
                <Pin className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {t("gallery.pinned.title", lang)}
                </h2>
              </div>
              <p className="text-muted-foreground mb-6 ml-8">
                {t("gallery.pinned.subtitle", lang)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedCards.map((card: any) => (
                  <GalleryCard
                    key={card.id}
                    card={card}
                    lang={lang}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            </section>
          )}

          <Separator className="mb-8" />

          {/* ─── Filter Tabs ─── */}
          <section>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                {t("gallery.dynamic.title", lang)}
              </h2>
              <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="all" className="text-xs">
                    {t("gallery.filter.all", lang)}
                  </TabsTrigger>
                  <TabsTrigger value="folklore" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t("gallery.filter.folklore", lang)}
                  </TabsTrigger>
                  <TabsTrigger value="remedy" className="text-xs">
                    <Leaf className="h-3 w-3 mr-1" />
                    {t("gallery.filter.remedy", lang)}
                  </TabsTrigger>
                  <TabsTrigger value="nutrition" className="text-xs">
                    <Apple className="h-3 w-3 mr-1" />
                    {t("gallery.filter.nutrition", lang)}
                  </TabsTrigger>
                  <TabsTrigger value="plant" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {t("gallery.filter.plant", lang)}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                      <div className="h-5 bg-muted rounded w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded w-full mb-2" />
                      <div className="h-3 bg-muted rounded w-4/5" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : allCards && allCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCards.map((card: any) => (
                  <GalleryCard
                    key={card.id}
                    card={card}
                    lang={lang}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">{t("gallery.empty", lang)}</p>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  {lang === "fr"
                    ? "Les cartes apparaîtront ici une fois que l'Apothicaire les aura sélectionnées."
                    : "Cards will appear here once the Apothecary curates them."}
                </p>
              </div>
            )}
          </section>

          <div className="mt-12">
            <DisclaimerBanner type="general" />
          </div>
            </>  
          )}
        </div>
      </div>
    </AppLayout>
  );
}
