import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  Shield,
  Leaf,
  ShoppingBag,
  BarChart3,
  AlertTriangle,
  Plus,
  Check,
  X,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  LayoutGrid,
  Pin,
  Sparkles,
  Globe,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

type AdminTab = "plants" | "products" | "cards" | "analytics" | "reports";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const { t, lang } = useLanguage();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("plants");

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <AppLayout>
      <div className="container py-16 text-center px-4">
        <Shield className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">{t("admin.title")}</h1>
        <p className="text-muted-foreground">
          {lang === "en" ? "Admin access required." : "Accès administrateur requis."}
        </p>
      </div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: "plants" as AdminTab, label: t("admin.plants"), icon: Leaf },
    { id: "products" as AdminTab, label: t("admin.products"), icon: ShoppingBag },
    { id: "cards" as AdminTab, label: t("admin.cards"), icon: LayoutGrid },
    { id: "analytics" as AdminTab, label: t("admin.analytics"), icon: BarChart3 },
    { id: "reports" as AdminTab, label: t("admin.moderation"), icon: AlertTriangle },
  ];

  return (
    <AppLayout>
    <div className="container py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{t("admin.title")}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "plants" && <AdminPlants />}
      {activeTab === "products" && <AdminProducts />}
      {activeTab === "cards" && <AdminCards />}
      {activeTab === "analytics" && <AdminAnalytics />}
      {activeTab === "reports" && <AdminReports />}
    </div>
    </AppLayout>
  );
}

function AdminPlants() {
  const { lang } = useLanguage();
  const { data: plants, isLoading, refetch } = trpc.admin.plants.list.useQuery();
  const updatePlant = trpc.admin.plants.update.useMutation({
    onSuccess: () => {
      toast.success("Plant updated");
      refetch();
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          {lang === "en" ? "All Plants" : "Toutes les Plantes"} ({plants?.length || 0})
        </h2>
      </div>

      <div className="space-y-3">
        {plants?.map((plant: any) => (
          <div key={plant.id} className="botanical-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{plant.commonNameEn}</h3>
                  <span className="text-sm text-muted-foreground italic">({plant.scientificName})</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    plant.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {plant.approved ? "Approved" : "Pending"}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">{plant.evidenceLevel}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updatePlant.mutate({
                    id: plant.id,
                    data: { approved: !plant.approved },
                  })}
                >
                  {plant.approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProducts() {
  const { lang } = useLanguage();
  const { data: ownProducts, isLoading: loadingOwn, refetch: refetchOwn } = trpc.admin.products.listOwn.useQuery();
  const { data: affiliates, isLoading: loadingAff } = trpc.admin.products.listAffiliates.useQuery();
  const updateProduct = trpc.admin.products.updateOwn.useMutation({
    onSuccess: () => {
      toast.success("Product updated");
      refetchOwn();
    },
  });

  if (loadingOwn || loadingAff) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Own Products */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {lang === "en" ? "Own Products" : "Nos Produits"} ({ownProducts?.length || 0})
        </h2>
        <div className="space-y-3">
          {ownProducts?.map((product: any) => (
            <div key={product.id} className="botanical-card p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium">£{product.priceGbp}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      product.stockStatus === "in_stock" ? "bg-green-100 text-green-700" :
                      product.stockStatus === "low_stock" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {product.stockStatus?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={product.stockStatus}
                    onValueChange={(value) => updateProduct.mutate({
                      id: product.id,
                      data: { stockStatus: value as any },
                    })}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate Links */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {lang === "en" ? "Affiliate Links" : "Liens Affiliés"} ({affiliates?.length || 0})
        </h2>
        <div className="space-y-3">
          {affiliates?.map((link: any) => (
            <div key={link.id} className="botanical-card p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">{link.productName}</h3>
                  <p className="text-sm text-muted-foreground">{link.supplierName} — {link.priceLabel}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  link.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {link.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminAnalytics() {
  const { lang } = useLanguage();
  const { data, isLoading } = trpc.admin.analytics.summary.useQuery();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="botanical-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {lang === "en" ? "Total Events" : "Total des Événements"}
        </h2>
        <p className="text-4xl font-bold text-primary">{data?.totalEvents || 0}</p>
      </div>

      <div className="botanical-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {lang === "en" ? "Top Events" : "Événements Principaux"}
        </h2>
        <div className="space-y-3">
          {data?.topEvents?.map((event: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-foreground font-medium">{event.eventName}</span>
              <span className="text-sm font-bold text-primary">{event.count}</span>
            </div>
          ))}
          {(!data?.topEvents || data.topEvents.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {lang === "en" ? "No events tracked yet." : "Aucun événement suivi pour le moment."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminReports() {
  const { lang } = useLanguage();
  const { data: reports, isLoading } = trpc.admin.reports.list.useQuery();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {lang === "en" ? "Content Reports" : "Signalements de Contenu"} ({reports?.length || 0})
      </h2>

      {reports && reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((report: any) => (
            <div key={report.id} className="botanical-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 capitalize">
                      {report.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {report.entityType} #{report.entityId}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{report.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-muted-foreground">
            {lang === "en" ? "No reports to review." : "Aucun signalement à examiner."}
          </p>
        </div>
      )}
    </div>
  );
}

function AdminCards() {
  const { lang } = useLanguage();
  const { data: cards, isLoading, refetch } = trpc.admin.cards.list.useQuery();

  const togglePin = trpc.admin.cards.togglePin.useMutation({
    onSuccess: () => {
      toast.success(lang === "en" ? "Card pin updated" : "Épingle mise à jour");
      refetch();
    },
  });

  const toggleFeatured = trpc.admin.cards.toggleFeatured.useMutation({
    onSuccess: () => {
      toast.success(lang === "en" ? "Card feature updated" : "Mise en avant mise à jour");
      refetch();
    },
  });

  const togglePublic = trpc.admin.cards.togglePublic.useMutation({
    onSuccess: () => {
      toast.success(lang === "en" ? "Card visibility updated" : "Visibilité mise à jour");
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {lang === "en" ? "Card Curation" : "Curation des Cartes"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {cards?.length || 0} {lang === "en" ? "total cards" : "cartes au total"}
        </p>
      </div>

      <div className="text-xs text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
        <p className="font-medium mb-1">{lang === "en" ? "Curation Guide:" : "Guide de curation :"}</p>
        <p>
          {lang === "en"
            ? "• Public = visible in the gallery. Pin = permanently featured. Feature = highlighted with a badge."
            : "• Public = visible dans la galerie. Épingler = affiché en permanence. Mettre en avant = mis en évidence avec un badge."}
        </p>
      </div>

      {cards && cards.length > 0 ? (
        <div className="space-y-3">
          {cards.map((card: any) => {
            const title = lang === "fr" && card.titleFr ? card.titleFr : card.titleEn;
            return (
              <div
                key={card.id}
                className={`p-4 rounded-lg border transition-all ${
                  card.isPublic ? "border-primary/30 bg-primary/5" : "border-border bg-background"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary capitalize">
                        {card.cardType}
                      </span>
                      {card.aiGenerated && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                          AI
                        </span>
                      )}
                      {card.isPinned && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-0.5">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                      {card.isFeatured && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                      {card.isPublic && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-0.5">
                          <Globe className="w-3 h-3" /> Public
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground truncate">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ID: {card.id} | User: {card.userId} | {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant={card.isPublic ? "default" : "outline"}
                      className="text-xs h-7 px-2"
                      onClick={() => togglePublic.mutate({ cardId: card.id, isPublic: !card.isPublic })}
                      disabled={togglePublic.isPending}
                    >
                      {card.isPublic ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {card.isPublic
                        ? (lang === "en" ? "Public" : "Public")
                        : (lang === "en" ? "Private" : "Privé")}
                    </Button>
                    <Button
                      size="sm"
                      variant={card.isPinned ? "default" : "outline"}
                      className="text-xs h-7 px-2"
                      onClick={() => togglePin.mutate({ cardId: card.id, isPinned: !card.isPinned })}
                      disabled={togglePin.isPending}
                    >
                      <Pin className="w-3 h-3 mr-1" />
                      {card.isPinned
                        ? (lang === "en" ? "Unpin" : "Désépingler")
                        : (lang === "en" ? "Pin" : "Épingler")}
                    </Button>
                    <Button
                      size="sm"
                      variant={card.isFeatured ? "default" : "outline"}
                      className="text-xs h-7 px-2"
                      onClick={() => toggleFeatured.mutate({ cardId: card.id, isFeatured: !card.isFeatured })}
                      disabled={toggleFeatured.isPending}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {card.isFeatured
                        ? (lang === "en" ? "Unfeature" : "Retirer")
                        : (lang === "en" ? "Feature" : "Mettre en avant")}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <LayoutGrid className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-muted-foreground">
            {lang === "en" ? "No cards yet. Cards will appear here once users generate them." : "Pas encore de cartes."}
          </p>
        </div>
      )}
    </div>
  );
}
