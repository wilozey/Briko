import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "../../../shared/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EvidenceBadge from "@/components/EvidenceBadge";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Bookmark,
  BookmarkCheck,
  Loader2,
  Leaf,
  Sparkles,
  LogIn,
  Share2,
  Eye,
  BookOpen,
  Apple,
  Trash2,
  Copy,
  CheckCircle,
  FlaskConical,
} from "lucide-react";
import { useState } from "react";

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

export default function MyCards() {
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  // Saved cards from gallery (bookmarks)
  const { data: savedCards, isLoading: savedLoading } = trpc.savedCards.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // User's own generated cards
  const { data: myGenerated, isLoading: genLoading } = trpc.cards.myCards.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const unsaveMutation = trpc.gallery.unsave.useMutation({
    onSuccess: () => {
      toast.success(lang === "fr" ? "Carte retirée" : "Card removed");
      utils.savedCards.list.invalidate();
    },
  });

  const deleteMutation = trpc.cards.delete.useMutation({
    onSuccess: () => {
      toast.success(lang === "fr" ? "Carte supprimée" : "Card deleted");
      utils.cards.myCards.invalidate();
    },
  });

  const shareMutation = trpc.cards.enableSharing.useMutation({
    onSuccess: (data) => {
      const shareUrl = `${window.location.origin}/shared/${data.slug}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success(lang === "fr" ? "Lien de partage copié !" : "Share link copied!");
      utils.cards.myCards.invalidate();
    },
  });

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const isLoading = savedLoading || genLoading;

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="container py-16 text-center px-4">
          <Bookmark className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            {t("myCards.title", lang)}
          </h1>
          <p className="text-muted-foreground mb-6">
            {lang === "fr"
              ? "Connectez-vous pour voir vos cartes sauvegardées."
              : "Sign in to view your saved cards."}
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-primary text-primary-foreground">
              <LogIn className="w-4 h-4 mr-1.5" />
              {t("nav.login", lang)}
            </Button>
          </a>
        </div>
      </AppLayout>
    );
  }

  const hasSaved = savedCards && savedCards.length > 0;
  const hasGenerated = myGenerated && myGenerated.length > 0;
  const isEmpty = !hasSaved && !hasGenerated;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
        {/* Header */}
        <section className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <BookmarkCheck className="h-7 w-7 text-primary" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                {t("myCards.title", lang)}
              </h1>
            </div>
            <p className="text-muted-foreground ml-10">
              {t("myCards.subtitle", lang)}
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 pb-24">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && isEmpty && (
            <div className="text-center py-20">
              <Leaf className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">
                {t("myCards.empty", lang)}
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <Link href="/cards">
                  <Button variant="outline">
                    <BookOpen className="w-4 h-4 mr-1.5" />
                    {lang === "fr" ? "Parcourir la Galerie" : "Browse Gallery"}
                  </Button>
                </Link>
                <Link href="/capture">
                  <Button className="bg-primary text-primary-foreground">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    {t("nav.capture", lang)}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* ─── Saved from Gallery ─── */}
          {!isLoading && hasSaved && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Bookmark className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-serif font-bold text-foreground">
                  {lang === "fr" ? "Cartes Sauvegardées de la Galerie" : "Saved from Gallery"}
                </h2>
                <Badge variant="secondary" className="ml-2">{savedCards!.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCards!.map((card: any) => {
                  const title = lang === "fr" && card.titleFr ? card.titleFr : card.titleEn;
                  const content = lang === "fr" && card.contentFr ? card.contentFr : card.contentEn;
                  const isFolklore = card.cardType === "folklore";
                  return (
                    <Card
                      key={`saved-${card.id}`}
                      className={`group overflow-hidden transition-all hover:shadow-md ${
                        isFolklore ? "border-amber-200 bg-amber-50/30" : ""
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTypeIcon type={card.cardType} />
                          <span className="text-xs font-medium capitalize text-muted-foreground">
                            {card.cardType}
                          </span>
                          {card.evidenceLevel && <EvidenceBadge level={card.evidenceLevel} />}
                        </div>
                        <CardTitle className="text-base font-serif line-clamp-2">{title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{content}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          {card.shareSlug ? (
                            <Link href={`/shared/${card.shareSlug}`}>
                              <Button variant="ghost" size="sm" className="text-xs gap-1">
                                <Eye className="h-3 w-3" />
                                {lang === "fr" ? "Voir" : "View"}
                              </Button>
                            </Link>
                          ) : (
                            <span />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs gap-1 text-destructive hover:text-destructive"
                            onClick={() => unsaveMutation.mutate({ cardId: card.id })}
                            disabled={unsaveMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                            {lang === "fr" ? "Retirer" : "Remove"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── My Generated Cards ─── */}
          {!isLoading && hasGenerated && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-serif font-bold text-foreground">
                  {lang === "fr" ? "Mes Cartes Générées" : "My Generated Cards"}
                </h2>
                <Badge variant="secondary" className="ml-2">{myGenerated!.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myGenerated!.map((card: any) => {
                  const title = lang === "fr" && card.titleFr ? card.titleFr : card.titleEn;
                  const content = lang === "fr" && card.contentFr ? card.contentFr : card.contentEn;
                  return (
                    <Card key={`gen-${card.id}`} className="group overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTypeIcon type={card.cardType} />
                          <span className="text-xs font-medium capitalize text-muted-foreground">
                            {card.cardType}
                          </span>
                          {card.aiGenerated && (
                            <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600">AI</Badge>
                          )}
                          {card.evidenceLevel && <EvidenceBadge level={card.evidenceLevel} />}
                        </div>
                        <CardTitle className="text-base font-serif line-clamp-2">{title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{content}</p>
                        {card.folkloreLabel && (
                          <DisclaimerBanner type="folklore" className="text-xs mb-2" />
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs gap-1"
                              onClick={() => shareMutation.mutate({ cardId: card.id })}
                              disabled={shareMutation.isPending}
                            >
                              <Share2 className="h-3 w-3" />
                              {lang === "fr" ? "Partager" : "Share"}
                            </Button>
                            {card.shareSlug && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${window.location.origin}/shared/${card.shareSlug}`
                                  );
                                  setCopiedSlug(card.shareSlug);
                                  toast.success(lang === "fr" ? "Lien copié !" : "Link copied!");
                                  setTimeout(() => setCopiedSlug(null), 3000);
                                }}
                              >
                                {copiedSlug === card.shareSlug ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs gap-1 text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate({ id: card.id })}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          <div className="mt-12">
            <DisclaimerBanner type="general" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
