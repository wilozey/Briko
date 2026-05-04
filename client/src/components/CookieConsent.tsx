import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { Link } from "wouter";

const CONSENT_KEY = "plantinel_cookie_consent";

export default function CookieConsent() {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: true, functional: true, timestamp: Date.now() }));
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: false, functional: true, timestamp: Date.now() }));
    setVisible(false);
    // Disable analytics if user rejects
    const umamiScript = document.querySelector('script[data-website-id]') as HTMLScriptElement | null;
    if (umamiScript) {
      umamiScript.remove();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl shadow-2xl p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
              {isEn ? "Cookie Preferences" : "Préférences de cookies"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isEn
                ? "We use essential cookies for the site to function and optional analytics cookies (Umami, privacy-focused) to understand how you use Plantinel. We do not sell your data or use third-party advertising trackers."
                : "Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies d'analyse optionnels (Umami, respectueux de la vie privée) pour comprendre comment vous utilisez Plantinel. Nous ne vendons pas vos données et n'utilisons pas de traceurs publicitaires tiers."}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {isEn ? "Learn more in our " : "En savoir plus dans notre "}
              <Link href="/privacy" className="underline text-primary hover:text-primary/80">
                {isEn ? "Privacy Policy" : "Politique de confidentialité"}
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleAccept}
            className="bg-primary text-primary-foreground flex-1"
          >
            {isEn ? "Accept All" : "Tout accepter"}
          </Button>
          <Button
            onClick={handleEssentialOnly}
            variant="outline"
            className="flex-1"
          >
            {isEn ? "Essential Only" : "Essentiels uniquement"}
          </Button>
        </div>
      </div>
    </div>
  );
}
