import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Info, Shield } from "lucide-react";
import type { TranslationKey } from "../../../shared/i18n";

interface DisclaimerBannerProps {
  type?: "general" | "folklore" | "photo" | "ai";
  className?: string;
}

export default function DisclaimerBanner({ type = "general", className = "" }: DisclaimerBannerProps) {
  const { t } = useLanguage();

  const config = {
    general: {
      icon: Info,
      key: "disclaimer.general" as TranslationKey,
      bgClass: "bg-botanical-light/50 border-botanical/30",
      iconClass: "text-primary",
    },
    folklore: {
      icon: AlertTriangle,
      key: "disclaimer.folklore" as TranslationKey,
      bgClass: "bg-purple-50 border-purple-200",
      iconClass: "text-purple-600",
    },
    photo: {
      icon: AlertTriangle,
      key: "disclaimer.photo" as TranslationKey,
      bgClass: "bg-amber-50 border-amber-200",
      iconClass: "text-amber-600",
    },
    ai: {
      icon: Shield,
      key: "disclaimer.ai" as TranslationKey,
      bgClass: "bg-blue-50 border-blue-200",
      iconClass: "text-blue-600",
    },
  };

  const { icon: Icon, key, bgClass, iconClass } = config[type];

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${bgClass} ${className}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} />
      <p className="text-foreground/80 leading-relaxed">{t(key)}</p>
    </div>
  );
}
