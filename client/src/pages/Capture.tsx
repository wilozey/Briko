import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import EvidenceBadge from "@/components/EvidenceBadge";
import { toast } from "sonner";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import {
  Sparkles,
  Stethoscope,
  Leaf,
  Globe,
  FileText,
  Camera,
  Loader2,
  CheckCircle,
  ArrowRight,
  LogIn,
  AlertTriangle,
  MessageCircle,
  Send,
  RefreshCw,
  Beaker,
  ShieldAlert,
} from "lucide-react";
import MedicalSafetyModal from "@/components/MedicalSafetyModal";

const INPUT_MODES = [
  { value: "symptom", icon: Stethoscope, labelEn: "Symptom", labelFr: "Symptôme" },
  { value: "plant_name", icon: Leaf, labelEn: "Plant Name", labelFr: "Nom de Plante" },
  { value: "alias", icon: Globe, labelEn: "Local Name", labelFr: "Nom Local" },
  { value: "paste_text", icon: FileText, labelEn: "Paste Text", labelFr: "Coller Texte" },
  { value: "ingredients", icon: Beaker, labelEn: "Ingredients", labelFr: "Ingrédients" },
  { value: "photo", icon: Camera, labelEn: "Photo (Soon)", labelFr: "Photo (Bientôt)" },
];

const CARD_TYPES = [
  { value: "remedy", labelEn: "Remedy Card", labelFr: "Carte Remède", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  { value: "folklore", labelEn: "Folklore Card", labelFr: "Carte Folklore", color: "bg-violet-500/10 text-violet-700 border-violet-500/20" },
  { value: "nutrition", labelEn: "Nutrition Card", labelFr: "Carte Nutrition", color: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
];

type ConversationMessage = { role: "user" | "assistant"; content: string };

export default function Capture() {
  const { t, lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [inputMode, setInputMode] = useState("symptom");
  const [cardType, setCardType] = useState("remedy");
  const [inputText, setInputText] = useState("");
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [safetyAccepted, setSafetyAccepted] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [pendingGenerate, setPendingGenerate] = useState(false);

  const generateMutation = trpc.ai.generate.useMutation({
    onSuccess: (result) => {
      if (result.needsClarification && result.clarificationQuestion) {
        setClarificationQuestion(result.clarificationQuestion);
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: result.clarificationQuestion! },
        ]);
      } else if (result.card) {
        setGeneratedCard(result.card);
        setClarificationQuestion(null);
        toast.success(lang === "en" ? "Card generated successfully!" : "Carte générée avec succès !");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Generation failed");
    },
  });

  const regenerateMutation = trpc.ai.regenerate.useMutation({
    onSuccess: (card) => {
      setGeneratedCard(card);
      toast.success(lang === "en" ? "Card regenerated!" : "Carte régénérée !");
    },
    onError: (error) => {
      toast.error(error.message || "Regeneration failed");
    },
  });

  const doGenerate = () => {
    setGeneratedCard(null);
    setClarificationQuestion(null);
    setConversation([{ role: "user", content: inputText }]);
    generateMutation.mutate({
      inputMode: inputMode as any,
      inputText,
      cardType: cardType as any,
      language: lang,
    });
  };

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast.error(lang === "en" ? "Please enter some text" : "Veuillez entrer du texte");
      return;
    }
    if (inputMode === "photo") {
      toast.info(lang === "en" ? "Photo upload coming soon!" : "Téléchargement de photo bientôt disponible !");
      return;
    }
    if (!safetyAccepted) {
      setPendingGenerate(true);
      setShowSafetyModal(true);
      return;
    }
    doGenerate();
  };

  const handleSafetyAccept = () => {
    setSafetyAccepted(true);
    setShowSafetyModal(false);
    if (pendingGenerate) {
      setPendingGenerate(false);
      doGenerate();
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    const newConversation = [
      ...conversation,
      { role: "user" as const, content: replyText },
    ];
    setConversation(newConversation);
    setClarificationQuestion(null);
    setReplyText("");
    generateMutation.mutate({
      inputMode: inputMode as any,
      inputText: replyText,
      cardType: cardType as any,
      language: lang,
      conversationHistory: newConversation,
    });
  };

  const handleRegenerate = () => {
    if (!generatedCard?.id) return;
    regenerateMutation.mutate({
      cardId: generatedCard.id,
      language: lang,
    });
  };

  const cautionBadge = (level: string | null) => {
    if (!level) return null;
    const colors: Record<string, string> = {
      low: "bg-green-500/10 text-green-700 border-green-500/20",
      medium: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      high: "bg-orange-500/10 text-orange-700 border-orange-500/20",
      critical: "bg-red-500/10 text-red-700 border-red-500/20",
    };
    return (
      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[level] || colors.medium}`}>
        <ShieldAlert className="w-3 h-3" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="container py-16 text-center max-w-md mx-auto px-4">
          <Sparkles className="w-16 h-16 text-primary/40 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">{t("capture.title")}</h1>
          <p className="text-muted-foreground mb-6">{t("capture.subtitle")}</p>
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

  return (
    <AppLayout>
      <div className="container py-8 max-w-3xl mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">{t("capture.title")}</h1>
          <p className="text-muted-foreground">{t("capture.subtitle")}</p>
        </div>

        {/* Input Mode Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block">{t("capture.inputMode")}</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {INPUT_MODES.map((mode) => {
              const isDisabled = mode.value === "photo";
              return (
                <button
                  key={mode.value}
                  onClick={() => !isDisabled && setInputMode(mode.value)}
                  disabled={isDisabled}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm font-medium transition-all ${
                    inputMode === mode.value
                      ? "border-primary bg-primary/10 text-primary"
                      : isDisabled
                      ? "border-border/40 bg-muted/50 text-muted-foreground opacity-50"
                      : "border-border/60 bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <mode.icon className="w-5 h-5" />
                  <span className="text-[11px] text-center leading-tight">
                    {lang === "fr" ? mode.labelFr : mode.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Type Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block">{t("capture.cardType")}</label>
          <div className="grid grid-cols-3 gap-2">
            {CARD_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setCardType(type.value)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  cardType === type.value
                    ? `${type.color} ring-1 ring-primary/20`
                    : "border-border/60 bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                {lang === "fr" ? type.labelFr : type.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <Textarea
            placeholder={
              inputMode === "symptom"
                ? t("capture.symptom")
                : inputMode === "plant_name"
                ? t("capture.plantName")
                : inputMode === "alias"
                ? t("capture.alias")
                : inputMode === "ingredients"
                ? t("capture.ingredients")
                : t("capture.pasteText")
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px] bg-card border-border/60 text-base resize-none"
          />
        </div>

        {/* Symptom Warning */}
        {inputMode === "symptom" && (
          <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-sm mb-6">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <p className="text-foreground/80 leading-relaxed">
              {lang === "en"
                ? "If you are experiencing a medical emergency, please call emergency services immediately. This tool provides informational content only."
                : "Si vous vivez une urgence médicale, veuillez appeler les services d'urgence immédiatement. Cet outil fournit uniquement du contenu informatif."}
            </p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !inputText.trim()}
          className="w-full bg-primary text-primary-foreground h-12 text-base"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t("capture.generating")}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              {t("capture.generate")}
            </>
          )}
        </Button>

        {/* Conversation / Clarification */}
        {conversation.length > 0 && !generatedCard && (
          <div className="mt-8 space-y-3">
            <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              {lang === "en" ? "Conversation" : "Conversation"}
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {conversation.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary/10 text-foreground ml-8"
                      : "bg-secondary text-foreground mr-8"
                  }`}
                >
                  <span className="text-xs font-medium text-muted-foreground block mb-1">
                    {msg.role === "user" ? (lang === "en" ? "You" : "Vous") : "Apothecary"}
                  </span>
                  {msg.content}
                </div>
              ))}
            </div>

            {clarificationQuestion && (
              <div className="botanical-card p-4 border-primary/20">
                <p className="text-sm font-medium text-primary mb-3">{t("capture.clarification")}</p>
                <div className="flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReply()}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={t("capture.reply")}
                  />
                  <Button
                    onClick={handleReply}
                    disabled={generateMutation.isPending || !replyText.trim()}
                    className="bg-primary text-primary-foreground"
                  >
                    {generateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generated Card Result */}
        {generatedCard && (
          <div className="mt-8 botanical-card p-6 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-foreground">
                  {lang === "en" ? "Card Generated & Saved" : "Carte Générée & Sauvegardée"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={regenerateMutation.isPending}
                className="text-primary"
              >
                {regenerateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-1" />
                )}
                {t("capture.regenerate")}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {lang === "fr" && generatedCard.titleFr ? generatedCard.titleFr : generatedCard.titleEn}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                    {generatedCard.cardType}
                  </span>
                  <EvidenceBadge level={generatedCard.evidenceLevel} />
                  {generatedCard.aiGenerated && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      AI Generated
                    </span>
                  )}
                  {cautionBadge(generatedCard.cautionLevel)}
                  {generatedCard.confidenceScore && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {t("cards.confidence")}: {generatedCard.confidenceScore}/5
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-foreground leading-relaxed">
                  {lang === "fr" && generatedCard.contentFr ? generatedCard.contentFr : generatedCard.contentEn}
                </p>
              </div>

              {(generatedCard.traditionalUsesEn || generatedCard.traditionalUsesFr) && (
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    {t("plant.traditionalUses")}
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {lang === "fr" && generatedCard.traditionalUsesFr ? generatedCard.traditionalUsesFr : generatedCard.traditionalUsesEn}
                  </p>
                </div>
              )}

              {(generatedCard.preparationEn || generatedCard.preparationFr) && (
                <div className="bg-amber-500/5 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    {t("plant.preparation")}
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {lang === "fr" && generatedCard.preparationFr ? generatedCard.preparationFr : generatedCard.preparationEn}
                  </p>
                </div>
              )}

              {(generatedCard.safetyNotesEn || generatedCard.safetyNotesFr) && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      {t("plant.safety")}
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {lang === "fr" && generatedCard.safetyNotesFr ? generatedCard.safetyNotesFr : generatedCard.safetyNotesEn}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Link href="/my-cards">
                  <Button size="sm" className="bg-primary text-primary-foreground">
                    {lang === "en" ? "View in My Cards" : "Voir dans Mes Cartes"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <DisclaimerBanner type="ai" className="mt-4" />
          </div>
        )}

        <DisclaimerBanner type="general" className="mt-8" />

        <MedicalSafetyModal
          type={inputMode === "symptom" ? "symptom" : inputMode === "photo" ? "photo" : "ai"}
          open={showSafetyModal}
          onAccept={handleSafetyAccept}
        />
      </div>
    </AppLayout>
  );
}
