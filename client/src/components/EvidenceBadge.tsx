import { useLanguage } from "@/contexts/LanguageContext";
import { FlaskConical, History, Blend, Sparkles } from "lucide-react";
import type { TranslationKey } from "../../../shared/i18n";

interface EvidenceBadgeProps {
  level: "research" | "traditional" | "mixed" | "folklore" | null | undefined;
  size?: "sm" | "md";
}

export default function EvidenceBadge({ level, size = "sm" }: EvidenceBadgeProps) {
  const { t } = useLanguage();

  if (!level) return null;

  const config = {
    research: {
      icon: FlaskConical,
      label: t("evidence.research" as TranslationKey),
      className: "bg-primary/10 text-primary border-primary/20",
    },
    traditional: {
      icon: History,
      label: t("evidence.traditional" as TranslationKey),
      className: "bg-amber-warm/20 text-amber-warm-foreground border-amber-warm/30",
    },
    mixed: {
      icon: Blend,
      label: t("evidence.mixed" as TranslationKey),
      className: "bg-botanical/15 text-foreground border-botanical/25",
    },
    folklore: {
      icon: Sparkles,
      label: t("evidence.folklore" as TranslationKey),
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };

  const { icon: Icon, label, className } = config[level];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${className} ${sizeClass}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {label}
    </span>
  );
}
