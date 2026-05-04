import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import {
  Leaf,
  BookOpen,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  User,
  Shield,
  Globe,
  LogOut,
  LogIn,
  Menu,
  X,
  Compass,
  BookHeart,
  Users,
  LayoutGrid,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";

function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-botanical/20 transition-colors"
      title={lang === "en" ? "Switch to French" : "Passer en anglais"}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{lang}</span>
    </button>
  );
}

function DesktopNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Leaf },
    { href: "/library", label: t("nav.library"), icon: BookOpen },
    { href: "/cards", label: t("nav.cards"), icon: LayoutGrid },
    { href: "/explore", label: t("nav.explore"), icon: Compass },
    { href: "/capture", label: t("nav.capture"), icon: Sparkles },
    { href: "/my-cards", label: t("nav.myCards"), icon: BookmarkCheck },
    { href: "/my-garden", label: "My Garden", icon: Sprout },
    { href: "/journal", label: t("nav.journal"), icon: BookHeart },
    { href: "/community", label: t("nav.community"), icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">Plantinel</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user?.role === "admin" && (
                <Link href="/admin">
                  <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <Shield className="w-4 h-4" />
                    {t("nav.admin")}
                  </span>
                </Link>
              )}
              <Link href="/profile">
                <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <User className="w-4 h-4" />
                  {user?.name || t("nav.profile")}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-muted-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="sm" className="bg-primary text-primary-foreground">
                <LogIn className="w-4 h-4 mr-1.5" />
                {t("nav.login")}
              </Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const { t } = useLanguage();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Leaf },
    { href: "/cards", label: t("nav.cards"), icon: LayoutGrid },
    { href: "/capture", label: t("nav.capture"), icon: Sparkles },
    { href: "/my-cards", label: t("nav.myCards"), icon: BookmarkCheck },
    { href: "/profile", label: t("nav.profile"), icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function MobileHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-serif text-lg font-semibold text-foreground">Plantinel</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-4 space-y-1">
          <Link href="/library" onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
              <BookOpen className="w-4 h-4" /> {t("nav.library")}
            </span>
          </Link>
          <Link href="/explore" onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
              <Compass className="w-4 h-4" /> {t("nav.explore")}
            </span>
          </Link>
          <Link href="/journal" onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
              <BookHeart className="w-4 h-4" /> {t("nav.journal")}
            </span>
          </Link>
          <Link href="/community" onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
              <Users className="w-4 h-4" /> {t("nav.community")}
            </span>
          </Link>
          <Link href="/my-garden" onClick={() => setMenuOpen(false)}>
            <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
              <Sprout className="w-4 h-4" /> My Garden
            </span>
          </Link>
          {isAuthenticated ? (
            <>
              <p className="text-sm text-muted-foreground px-3 py-1 pt-2 border-t border-border/50">
                {user?.name || user?.email}
              </p>
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
                    <Shield className="w-4 h-4" />
                    {t("nav.admin")}
                  </span>
                </Link>
              )}
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <a href={getLoginUrl()} className="block pt-2 border-t border-border/50">
              <Button className="w-full bg-primary text-primary-foreground">
                <LogIn className="w-4 h-4 mr-1.5" />
                {t("nav.login")}
              </Button>
            </a>
          )}
        </div>
      )}
    </header>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopNav />
      <MobileHeader />
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileNav />
      {/* Footer with legal links */}
      <footer className="hidden md:block border-t border-border/50 bg-muted/30 py-6 mt-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="font-serif">Plantinel — The Apothecary</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms"><span className="hover:text-foreground transition-colors">Terms</span></Link>
            <Link href="/privacy"><span className="hover:text-foreground transition-colors">Privacy</span></Link>
            <Link href="/disclaimer"><span className="hover:text-foreground transition-colors">Medical Disclaimer</span></Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Plantinel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
