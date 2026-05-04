import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Phone, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicalSafetyModalProps {
  type: "ai" | "photo" | "symptom";
  onAccept: () => void;
  open: boolean;
}

export default function MedicalSafetyModal({ type, onAccept, open }: MedicalSafetyModalProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const [countdown, setCountdown] = useState(5);
  const [canAccept, setCanAccept] = useState(false);

  useEffect(() => {
    if (!open) {
      setCountdown(5);
      setCanAccept(false);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanAccept(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);

  if (!open) return null;

  const content = {
    ai: {
      titleEn: "Important Medical Safety Notice",
      titleFr: "Avis de sécurité médicale important",
      warningsEn: [
        "AI-generated content is for informational purposes ONLY and is NOT medical advice.",
        "Never start, stop, or change any medication based on information from this app.",
        "Always consult a qualified healthcare professional before using any herbal remedy.",
        "Some plants can interact dangerously with medications — verify with your doctor.",
        "If you are pregnant, nursing, or have chronic conditions, seek professional guidance first.",
      ],
      warningsFr: [
        "Le contenu généré par l'IA est à titre informatif UNIQUEMENT et ne constitue PAS un avis médical.",
        "Ne commencez, n'arrêtez ou ne modifiez jamais un médicament sur la base des informations de cette application.",
        "Consultez toujours un professionnel de santé qualifié avant d'utiliser un remède à base de plantes.",
        "Certaines plantes peuvent interagir dangereusement avec des médicaments — vérifiez avec votre médecin.",
        "Si vous êtes enceinte, allaitante ou avez des conditions chroniques, consultez d'abord un professionnel.",
      ],
    },
    photo: {
      titleEn: "Photo Identification Safety Warning",
      titleFr: "Avertissement de sécurité pour l'identification par photo",
      warningsEn: [
        "DO NOT consume any plant based solely on photo identification.",
        "Many toxic plants closely resemble edible ones — visual identification alone is unreliable.",
        "Misidentification can cause serious illness, organ damage, or death.",
        "Always have a qualified botanist or herbalist confirm identification in person.",
        "If you suspect plant poisoning, call emergency services (999/112) immediately.",
      ],
      warningsFr: [
        "NE consommez PAS de plante sur la seule base d'une identification par photo.",
        "De nombreuses plantes toxiques ressemblent étroitement à des plantes comestibles — l'identification visuelle seule n'est pas fiable.",
        "Une mauvaise identification peut causer une maladie grave, des lésions organiques ou la mort.",
        "Faites toujours confirmer l'identification par un botaniste ou herboriste qualifié en personne.",
        "Si vous suspectez un empoisonnement par une plante, appelez les services d'urgence (15/112) immédiatement.",
      ],
    },
    symptom: {
      titleEn: "Medical Emergency Notice",
      titleFr: "Avis d'urgence médicale",
      warningsEn: [
        "This tool provides general botanical information ONLY — it cannot diagnose or treat conditions.",
        "If you are experiencing a medical emergency, call 999 (UK) or 112 (EU) immediately.",
        "Do not delay seeking medical attention based on any information from this app.",
        "Herbal remedies can mask serious symptoms — always get a proper medical diagnosis first.",
        "This app is not a substitute for professional medical care under any circumstances.",
      ],
      warningsFr: [
        "Cet outil fournit des informations botaniques générales UNIQUEMENT — il ne peut pas diagnostiquer ou traiter des conditions.",
        "Si vous vivez une urgence médicale, appelez le 15 (France) ou le 112 (UE) immédiatement.",
        "Ne retardez pas la recherche d'attention médicale sur la base des informations de cette application.",
        "Les remèdes à base de plantes peuvent masquer des symptômes graves — obtenez d'abord un diagnostic médical approprié.",
        "Cette application ne remplace en aucun cas les soins médicaux professionnels.",
      ],
    },
  };

  const c = content[type];
  const warnings = isEn ? c.warningsEn : c.warningsFr;
  const title = isEn ? c.titleEn : c.titleFr;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 shrink-0" />
          <h2 className="font-serif text-xl font-bold">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <ul className="space-y-3">
            {warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span className="text-sm text-foreground leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>

          {/* Emergency Banner */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
            <Phone className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <p className="font-bold text-red-800 text-sm">
                {isEn ? "Emergency? Call now:" : "Urgence ? Appelez maintenant :"}
              </p>
              <p className="text-red-700 text-sm font-mono">
                {isEn ? "999 (UK) • 112 (EU) • 911 (US/CA)" : "15 (France) • 112 (UE) • 999 (UK)"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-5">
          <Button
            onClick={onAccept}
            disabled={!canAccept}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold"
          >
            {canAccept
              ? isEn
                ? "I Understand — Proceed"
                : "Je comprends — Continuer"
              : isEn
              ? `Please read carefully (${countdown}s)`
              : `Veuillez lire attentivement (${countdown}s)`}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            {isEn
              ? "By proceeding, you acknowledge that this content is for informational purposes only."
              : "En continuant, vous reconnaissez que ce contenu est à titre informatif uniquement."}
          </p>
        </div>
      </div>
    </div>
  );
}
