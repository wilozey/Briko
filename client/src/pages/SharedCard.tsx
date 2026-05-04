import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { Link } from "wouter";
import { Leaf, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

export default function SharedCard({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const { data: card, isLoading, error } = trpc.cards.getByShareSlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="container py-16 text-center">
        <Leaf className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {lang === "en" ? "Card Not Found" : "Carte Non Trouvée"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {lang === "en"
            ? "This shared card may have been removed or the link is invalid."
            : "Cette carte partagée a peut-être été supprimée ou le lien est invalide."}
        </p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            {lang === "en" ? "Go Home" : "Retour à l'Accueil"}
          </Button>
        </Link>
      </div>
    );
  }

  const title = lang === "fr" && card.titleFr ? card.titleFr : card.titleEn;
  const content = lang === "fr" && card.contentFr ? card.contentFr : card.contentEn;
  const traditionalUses = lang === "fr" && card.traditionalUsesFr ? card.traditionalUsesFr : card.traditionalUsesEn;
  const preparation = lang === "fr" && card.preparationFr ? card.preparationFr : card.preparationEn;
  const safetyNotes = lang === "fr" && card.safetyNotesFr ? card.safetyNotesFr : card.safetyNotesEn;

  const cardTypeColors: Record<string, string> = {
    plant: "bg-primary/10 text-primary",
    remedy: "bg-blue-100 text-blue-700",
    folklore: "bg-purple-100 text-purple-700",
    nutrition: "bg-green-100 text-green-700",
  };

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      {/* Shared banner */}
      <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <Leaf className="w-5 h-5 text-primary" />
        <span className="text-sm text-foreground">
          {lang === "en"
            ? "Shared from Plantinel — The Apothecary"
            : "Partagé depuis Plantinel — L'Apothicaire"}
        </span>
      </div>

      <div className="botanical-card p-6">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${cardTypeColors[card.cardType] || cardTypeColors.plant}`}>
            {card.cardType}
          </span>
          <EvidenceBadge level={card.evidenceLevel as any} />
          {card.aiGenerated && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              AI Generated
            </span>
          )}
        </div>

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">{title}</h1>

        {content && (
          <p className="text-foreground leading-relaxed mb-6">{content}</p>
        )}

        {traditionalUses && (
          <div className="bg-botanical-light/30 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-foreground text-sm mb-2">
              {lang === "en" ? "Traditional Uses" : "Usages Traditionnels"}
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{traditionalUses}</p>
          </div>
        )}

        {preparation && (
          <div className="bg-amber-warm/10 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-foreground text-sm mb-2">
              {lang === "en" ? "Preparation" : "Préparation"}
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{preparation}</p>
          </div>
        )}

        {safetyNotes && (
          <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 mb-4">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                {lang === "en" ? "Safety Notes" : "Notes de Sécurité"}
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{safetyNotes}</p>
            </div>
          </div>
        )}

        {card.folkloreLabel && <DisclaimerBanner type="folklore" className="mb-4" />}
        <DisclaimerBanner type={card.aiGenerated ? "ai" : "general"} />
      </div>

      {/* CTA */}
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground mb-3">
          {lang === "en"
            ? "Discover more botanical wisdom on Plantinel"
            : "Découvrez plus de sagesse botanique sur Plantinel"}
        </p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground">
            <Leaf className="w-4 h-4 mr-1.5" />
            {lang === "en" ? "Explore Plantinel" : "Explorer Plantinel"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
