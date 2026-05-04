import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOConfig {
  titleEn: string;
  titleFr: string;
  descriptionEn?: string;
  descriptionFr?: string;
}

export function useSEO({ titleEn, titleFr, descriptionEn, descriptionFr }: SEOConfig) {
  const { lang } = useLanguage();

  useEffect(() => {
    const title = lang === "fr" ? titleFr : titleEn;
    document.title = `${title} | Plantinel`;

    // Update html lang attribute
    document.documentElement.lang = lang === "fr" ? "fr" : "en";

    // Update meta description
    const desc = lang === "fr" ? (descriptionFr || descriptionEn) : descriptionEn;
    if (desc) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (meta) {
        meta.content = desc;
      }
    }

    // Update og:locale
    let ogLocale = document.querySelector('meta[property="og:locale"]') as HTMLMetaElement | null;
    if (ogLocale) {
      ogLocale.content = lang === "fr" ? "fr_FR" : "en_GB";
    }
  }, [lang, titleEn, titleFr, descriptionEn, descriptionFr]);
}
