import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import {
  User,
  Globe,
  Bookmark,
  LogIn,
  LogOut,
  Shield,
  ArrowRight,
  Sparkles,
  BookOpen,
  HeartPulse,
  BookHeart,
  Users,
  FileText,
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();

  const { data: cards } = trpc.cards.myCards.useQuery(undefined, { enabled: isAuthenticated });

  const handleLanguageChange = (newLang: "en" | "fr") => {
    setLang(newLang);
  };

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="container py-16 text-center max-w-md mx-auto px-4">
          <User className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">{t("profile.title")}</h1>
          <p className="text-muted-foreground mb-6">
            {lang === "en" ? "Sign in to view your profile." : "Connectez-vous pour voir votre profil."}
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-primary text-primary-foreground">
              <LogIn className="w-4 h-4 mr-1.5" />
              {t("nav.login")}
            </Button>
          </a>
        </div>
      </AppLayout>
    );
  }

  const cardCount = cards?.length || 0;
  const cardsByType = cards?.reduce((acc: Record<string, number>, card: any) => {
    acc[card.cardType] = (acc[card.cardType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <AppLayout>
      <div className="container py-8 max-w-2xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">{t("profile.title")}</h1>

        {/* User Info Card */}
        <div className="botanical-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-foreground">{user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {user?.role === "admin" && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="botanical-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-semibold text-foreground">{t("profile.language")}</h3>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`flex-1 p-3 rounded-xl border text-center font-medium transition-all ${
                lang === "en"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary/40"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange("fr")}
              className={`flex-1 p-3 rounded-xl border text-center font-medium transition-all ${
                lang === "fr"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary/40"
              }`}
            >
              Fran&ccedil;ais
            </button>
          </div>
        </div>

        {/* Cards Summary */}
        <div className="botanical-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" />
              <h3 className="font-serif font-semibold text-foreground">{t("profile.savedCards")}</h3>
            </div>
            <span className="text-2xl font-bold text-primary">{cardCount}</span>
          </div>

          {cardCount > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(cardsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm capitalize text-foreground">{type}</span>
                  <span className="font-semibold text-foreground">{count as number}</span>
                </div>
              ))}
            </div>
          )}

          <Link href="/my-cards">
            <Button variant="outline" className="w-full">
              {t("cards.myCards")}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="botanical-card p-6 mb-6">
          <h3 className="font-serif font-semibold text-foreground mb-4">
            {lang === "en" ? "Quick Links" : "Liens Rapides"}
          </h3>
          <div className="space-y-1">
            <Link href="/health-profile">
              <span className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <span className="text-foreground">{t("health.title")}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </span>
            </Link>
            <Link href="/journal">
              <span className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <BookHeart className="w-5 h-5 text-amber-500" />
                <span className="text-foreground">{t("nav.journal")}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </span>
            </Link>
            <Link href="/library">
              <span className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-foreground">{t("nav.library")}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </span>
            </Link>
            <Link href="/capture">
              <span className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-foreground">{t("nav.capture")}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </span>
            </Link>
            <Link href="/community">
              <span className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <Users className="w-5 h-5 text-sky-500" />
                <span className="text-foreground">{t("nav.community")}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </span>
            </Link>
            <Link href="/disclaimer">
              <span className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{lang === "en" ? "Disclaimers & Terms" : "Avertissements"}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </span>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <span className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{t("nav.admin")}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          onClick={() => logout()}
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
        >
          <LogOut className="w-4 h-4 mr-1.5" />
          {t("nav.logout")}
        </Button>
      </div>
    </AppLayout>
  );
}
