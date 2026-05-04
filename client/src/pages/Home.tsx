import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

import AppLayout from "@/components/AppLayout";
import { useSEO } from "@/hooks/useSEO";
import {
  Leaf,
  BookOpen,
  Sparkles,
  Bookmark,
  ShoppingBag,
  ArrowRight,
  Shield,
  Users,
  BookHeart,
  Compass,
  HeartPulse,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t, lang } = useLanguage();
  const { data: plantOfDay } = trpc.plants.plantOfTheDay.useQuery();

  useSEO({
    titleEn: "Plantinel — The Apothecary | Botanical Wisdom & Natural Remedies",
    titleFr: "Plantinel — L'Apothicaire | Sagesse Botanique & Remèdes Naturels",
    descriptionEn: "Discover plant-based remedies, botanical folklore, and traditional wisdom. AI-powered herbal guidance with safety-first approach.",
    descriptionFr: "Découvrez les remèdes à base de plantes, le folklore botanique et la sagesse traditionnelle. Guidance herbale alimentée par l'IA.",
  });

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-botanical-light via-background to-background">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 C30 5 35 15 35 25 C35 35 30 40 30 40 C30 40 25 35 25 25 C25 15 30 5 30 5Z' fill='%2374B49B' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }} />
          <div className="container relative py-16 md:py-24 lg:py-32 px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Leaf className="w-4 h-4" />
                <span>The Apothecary</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                {t("home.hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t("home.hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/library">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8">
                    <BookOpen className="w-5 h-5" />
                    {t("home.hero.cta")}
                  </Button>
                </Link>
                <Link href="/capture">
                  <Button size="lg" variant="outline" className="gap-2 px-8 border-primary/30 text-primary hover:bg-primary/5">
                    <Sparkles className="w-5 h-5" />
                    {t("home.hero.capture")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* Plant of the Day */}
        {plantOfDay && (
          <section className="container py-8 px-4">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {t("home.plantOfDay")}
            </h2>
            <Link href={`/plant/${plantOfDay.id}`}>
              <div className="botanical-card p-5 bg-gradient-to-r from-amber-500/10 via-primary/5 to-emerald-500/10 border-amber-500/20 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Leaf className="w-7 h-7 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {lang === "fr" && plantOfDay.commonNameFr ? plantOfDay.commonNameFr : plantOfDay.commonNameEn}
                    </h3>
                    <p className="text-sm text-muted-foreground italic">{plantOfDay.scientificName}</p>
                    <p className="text-sm text-foreground/80 line-clamp-2 mt-1">
                      {lang === "fr" && plantOfDay.descriptionFr ? plantOfDay.descriptionFr : plantOfDay.descriptionEn}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2" />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Features Section */}
        <section className="container py-12 md:py-20 px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("home.features.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={BookOpen} title={t("home.features.library")} description={t("home.features.libraryDesc")} href="/library" color="primary" />
            <FeatureCard icon={Sparkles} title={t("home.features.ai")} description={t("home.features.aiDesc")} href="/capture" color="amber" />
            <FeatureCard icon={Bookmark} title={t("home.features.cards")} description={t("home.features.cardsDesc")} href="/my-cards" color="botanical" />
            <FeatureCard icon={ShoppingBag} title={t("home.features.products")} description={t("home.features.productsDesc")} href="/library" color="secondary" />
          </div>

          {/* Secondary features row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Link href="/explore">
              <div className="botanical-card p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-semibold text-foreground text-sm">{t("nav.explore")}</h4>
                  <p className="text-xs text-muted-foreground">Browse by category</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
            <Link href="/journal">
              <div className="botanical-card p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                  <BookHeart className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-semibold text-foreground text-sm">{t("nav.journal")}</h4>
                  <p className="text-xs text-muted-foreground">Track your remedies</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
            <Link href="/community">
              <div className="botanical-card p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-semibold text-foreground text-sm">{t("nav.community")}</h4>
                  <p className="text-xs text-muted-foreground">Share experiences</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          </div>
        </section>

        {/* Trust / Disclaimer Section */}
        <section className="bg-primary/5 py-12">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                <span className="font-serif text-lg font-semibold">Safety First</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("disclaimer.general")}
              </p>
              <Link href="/disclaimer">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline mt-2">
                  Read full disclaimer <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600",
    botanical: "bg-emerald-500/10 text-emerald-600",
    secondary: "bg-secondary text-foreground",
  };

  return (
    <Link href={href}>
      <div className="botanical-card p-6 h-full group cursor-pointer">
        <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
          Explore <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
