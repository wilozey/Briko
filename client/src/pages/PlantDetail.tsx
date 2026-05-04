import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EvidenceBadge from "@/components/EvidenceBadge";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { toast } from "sonner";
import {
  Leaf,
  ArrowLeft,
  Bookmark,
  Share2,
  AlertTriangle,
  MapPin,
  Globe,
  ShoppingBag,
  ExternalLink,
  Package,
  Bell,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useSEO } from "@/hooks/useSEO";
import { Info } from "lucide-react";

export default function PlantDetail({ id }: { id: string }) {
  const plantId = parseInt(id);
  const { t, lang } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showAllAliases, setShowAllAliases] = useState(false);
  const [restockEmail, setRestockEmail] = useState("");

  const { data: plant, isLoading } = trpc.plants.getById.useQuery({ id: plantId });
  const { data: products } = trpc.plants.getProducts.useQuery({ plantId });
  const createCard = trpc.cards.create.useMutation();
  const requestRestock = trpc.products.requestRestock.useMutation();
  const trackEvent = trpc.analytics.track.useMutation();

  useSEO({
    titleEn: plant ? `${plant.commonNameEn} — Plant Profile` : "Plant Detail",
    titleFr: plant ? `${plant.commonNameFr || plant.commonNameEn} — Profil de plante` : "Détail de la plante",
    descriptionEn: plant?.descriptionEn?.slice(0, 160),
    descriptionFr: plant?.descriptionFr?.slice(0, 160),
  });

  const mysticalVirtues = lang === "fr" && (plant as any)?.mysticalVirtuesFr ? (plant as any).mysticalVirtuesFr : (plant as any)?.mysticalVirtuesEn;
  const originRegion = (plant as any)?.originRegion;
  const culturalTradition = (plant as any)?.culturalTradition;

  if (isLoading) {
    return (
      <AppLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
      </AppLayout>
    );
  }

  if (!plant) {
    return (
      <AppLayout>
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">Plant not found</p>
      </div>
      </AppLayout>
    );
  }

  const name = lang === "fr" && plant.commonNameFr ? plant.commonNameFr : plant.commonNameEn;
  const description = lang === "fr" && plant.descriptionFr ? plant.descriptionFr : plant.descriptionEn;
  const traditionalUses = lang === "fr" && plant.traditionalUsesFr ? plant.traditionalUsesFr : plant.traditionalUsesEn;
  const prepTypes = plant.preparationTypes ? (typeof plant.preparationTypes === "string" ? JSON.parse(plant.preparationTypes) : plant.preparationTypes) : [];

  const handleSaveCard = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save cards");
      return;
    }
    try {
      await createCard.mutateAsync({
        plantId: plant.id,
        cardType: "plant",
        titleEn: plant.commonNameEn,
        titleFr: plant.commonNameFr || plant.commonNameEn,
        contentEn: plant.descriptionEn || "",
        contentFr: plant.descriptionFr || "",
        traditionalUsesEn: plant.traditionalUsesEn || "",
        traditionalUsesFr: plant.traditionalUsesFr || "",
        evidenceLevel: plant.evidenceLevel as any,
        sourceType: "plant_name",
      });
      toast.success(lang === "en" ? "Card saved!" : "Carte sauvegardée !");
    } catch {
      toast.error(lang === "en" ? "Failed to save card" : "Échec de la sauvegarde");
    }
  };

  const handleRestock = async (productId: number) => {
    if (!restockEmail) return;
    try {
      await requestRestock.mutateAsync({ email: restockEmail, plantId: plant.id, productId });
      toast.success(lang === "en" ? "You'll be notified when back in stock!" : "Vous serez notifié quand le produit sera de retour !");
      setRestockEmail("");
    } catch {
      toast.error("Failed to register notification");
    }
  };

  return (
    <AppLayout>
    <div className="container py-6 max-w-4xl mx-auto px-4">
      {/* Back button */}
      <Link href="/library">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </span>
      </Link>

      {/* Plant Header */}
      <div className="mb-8">
        <div className="h-56 md:h-72 bg-gradient-to-br from-botanical-light to-botanical/20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
          <Leaf className="w-24 h-24 text-primary/20" />
          <div className="absolute bottom-4 left-4">
            <EvidenceBadge level={plant.evidenceLevel as any} size="md" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{name}</h1>
            <p className="text-lg text-muted-foreground italic mt-1">{plant.scientificName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSaveCard}
              disabled={createCard.isPending}
              className="bg-primary text-primary-foreground"
            >
              <Bookmark className="w-4 h-4 mr-1.5" />
              {t("plant.saveCard")}
            </Button>
            <Button variant="outline" className="border-border/60">
              <Share2 className="w-4 h-4 mr-1.5" />
              {t("plant.share")}
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mb-8">
        <p className="text-foreground leading-relaxed">{description}</p>
      </section>

      {/* Aliases */}
      {plant.aliases && plant.aliases.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            {t("plant.aliases")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(showAllAliases ? plant.aliases : plant.aliases.slice(0, 6)).map((alias: any, i: number) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm"
              >
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium">{alias.alias}</span>
                {alias.region && (
                  <span className="text-muted-foreground">({alias.region})</span>
                )}
              </span>
            ))}
            {plant.aliases.length > 6 && (
              <button
                onClick={() => setShowAllAliases(!showAllAliases)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {showAllAliases ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {showAllAliases ? "Show less" : `+${plant.aliases.length - 6} more`}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Traditional Uses */}
      {traditionalUses && (
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
            {t("plant.traditionalUses")}
          </h2>
          <div className="bg-botanical-light/30 rounded-xl p-5">
            <p className="text-foreground leading-relaxed">{traditionalUses}</p>
          </div>
        </section>
      )}

      {/* Preparation Types */}
      {prepTypes.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
            {t("plant.preparation")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {prepTypes.map((prep: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full bg-amber-warm/15 text-sm font-medium text-foreground capitalize"
              >
                {prep.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Safety Notes */}
      {plant.safety && plant.safety.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {t("plant.safety")}
          </h2>
          <div className="space-y-3">
            {plant.safety.map((note: any, i: number) => {
              const warning = lang === "fr" && note.warningFr ? note.warningFr : note.warningEn;
              const severityColors: Record<string, string> = {
                low: "border-yellow-200 bg-yellow-50",
                medium: "border-amber-200 bg-amber-50",
                high: "border-orange-200 bg-orange-50",
                critical: "border-red-200 bg-red-50",
              };
              return (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-lg border ${severityColors[note.severity] || severityColors.low}`}>
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                  <p className="text-sm text-foreground leading-relaxed">{warning}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Products Section */}
      {products && (
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {t("plant.products")}
          </h2>

          {/* Own Products (always first) */}
          {products.ownProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                {t("plant.ourProducts")}
              </h3>
              <div className="space-y-3">
                {products.ownProducts.map((product: any) => (
                  <div key={product.id} className="botanical-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {t("product.ownLabel")}
                          </span>
                          <StockBadge status={product.stockStatus} />
                        </div>
                        <h4 className="font-semibold text-foreground">{product.name}</h4>
                        {product.subtitle && (
                          <p className="text-sm text-muted-foreground mt-0.5">{product.subtitle}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          {product.originCountry && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {product.originCountry}
                              {product.originLocalName && ` (${product.originLocalName})`}
                            </span>
                          )}
                          {product.weightLabel && (
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {product.weightLabel}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold text-foreground">£{product.priceGbp}</p>
                        {product.stockStatus !== "out_of_stock" ? (
                          <a href={product.buyUrl} target="_blank" rel="noopener noreferrer">
                            <Button
                              size="sm"
                              className="mt-2 bg-primary text-primary-foreground"
                              onClick={() => trackEvent.mutate({ eventName: "product_clicked", entityType: "own_product", entityId: product.id })}
                            >
                              {t("product.buy")}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </a>
                        ) : (
                          <div className="mt-2 space-y-2">
                            <Input
                              placeholder="Email"
                              value={restockEmail}
                              onChange={(e) => setRestockEmail(e.target.value)}
                              className="h-8 text-xs"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestock(product.id)}
                              className="w-full text-xs"
                            >
                              <Bell className="w-3 h-3 mr-1" />
                              {t("product.notifyRestock")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Products */}
          {products.affiliateLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {t("plant.affiliateProducts")}
              </h3>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/40 text-xs text-muted-foreground mb-3">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  {lang === "en"
                    ? "Affiliate disclosure: We may earn a small commission from purchases made through these links at no extra cost to you. This helps support Plantinel."
                    : "Divulgation d'affiliation : Nous pouvons recevoir une petite commission sur les achats effectués via ces liens, sans frais supplémentaires pour vous. Cela aide à soutenir Plantinel."}
                  {" "}
                  <Link href="/affiliate-disclosure" className="underline text-primary">
                    {lang === "en" ? "Learn more" : "En savoir plus"}
                  </Link>
                </span>
              </div>
              <div className="space-y-3">
                {products.affiliateLinks.map((link: any) => (
                  <div key={link.id} className="botanical-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {t("product.affiliate")} — {link.supplierName}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground">{link.productName}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          {link.productFormat && <span>{link.productFormat}</span>}
                          {link.packSize && <span>{link.packSize}</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-foreground">{link.priceLabel}</p>
                        <a href={link.affiliateUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => trackEvent.mutate({ eventName: "affiliate_clicked", entityType: "affiliate_link", entityId: link.id })}
                          >
                            {t("product.view")}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Mystical Virtues / Folklore */}
      {mysticalVirtues && (
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            {lang === "en" ? "Mystical Virtues & Folklore" : "Vertus Mystiques & Folklore"}
          </h2>
          <div className="bg-violet-500/5 rounded-xl p-5 border border-violet-500/10">
            <p className="text-foreground leading-relaxed">{mysticalVirtues}</p>
            {(originRegion || culturalTradition) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {originRegion && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-700 text-xs font-medium">
                    <MapPin className="w-3 h-3" />
                    {originRegion}
                  </span>
                )}
                {culturalTradition && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-medium">
                    {culturalTradition}
                  </span>
                )}
              </div>
            )}
          </div>
          <DisclaimerBanner type="folklore" className="mt-3" />
        </section>
      )}

      {/* Disclaimer */}
      <DisclaimerBanner type="general" className="mt-8" />
    </div>
    </AppLayout>
  );
}

function StockBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    in_stock: { label: "In Stock", className: "bg-green-100 text-green-700" },
    low_stock: { label: "Low Stock", className: "bg-amber-100 text-amber-700" },
    out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-700" },
  };
  const { label, className } = config[status] || config.in_stock;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>{label}</span>;
}
