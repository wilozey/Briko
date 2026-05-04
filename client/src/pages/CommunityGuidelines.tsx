import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { ArrowLeft, Users } from "lucide-react";

export default function CommunityGuidelines() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <AppLayout>
      <div className="container py-8 px-4 max-w-3xl mx-auto">
        <Link href="/">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            {isEn ? "Back to Home" : "Retour à l'accueil"}
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {isEn ? "Community Guidelines" : "Directives communautaires"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEn ? "Last updated: May 2026" : "Dernière mise à jour : mai 2026"}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Welcome to the Plantinel Community" : "Bienvenue dans la communauté Plantinel"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Our community is a space for sharing botanical knowledge, traditional plant wisdom, and personal experiences with natural remedies. We welcome diverse perspectives and cultural traditions. These guidelines help ensure a safe, respectful, and informative environment for everyone."
                : "Notre communauté est un espace pour partager les connaissances botaniques, la sagesse traditionnelle des plantes et les expériences personnelles avec les remèdes naturels. Nous accueillons les perspectives diverses et les traditions culturelles."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "1. Be Respectful" : "1. Soyez respectueux"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Treat all community members with respect. Harassment, hate speech, discrimination, and personal attacks are not tolerated. Respect cultural traditions and practices, even if they differ from your own. Engage in constructive dialogue and be open to learning."
                : "Traitez tous les membres de la communauté avec respect. Le harcèlement, les discours de haine, la discrimination et les attaques personnelles ne sont pas tolérés. Respectez les traditions et pratiques culturelles, même si elles diffèrent des vôtres."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "2. No Medical Advice" : "2. Pas de conseils médicaux"}
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 mb-3">
              {isEn
                ? "CRITICAL: Do not provide specific medical advice, diagnoses, or treatment recommendations. Do not tell others to stop taking prescribed medications. Do not claim any plant can cure, treat, or prevent any disease."
                : "CRITIQUE : Ne fournissez pas de conseils médicaux spécifiques, de diagnostics ou de recommandations de traitement. Ne dites pas aux autres d'arrêter de prendre des médicaments prescrits."}
            </div>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "You may share personal experiences ('This helped me with...') but must always include the disclaimer that others should consult healthcare professionals. Use phrases like 'In my experience...' or 'Traditionally, this plant was used for...' rather than prescriptive language."
                : "Vous pouvez partager des expériences personnelles (« Cela m'a aidé avec... ») mais devez toujours inclure l'avertissement que les autres devraient consulter des professionnels de santé."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "3. Share Authentic Knowledge" : "3. Partagez des connaissances authentiques"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "When sharing folklore or traditional knowledge, be honest about the source and cultural context. Clearly distinguish between personal experience, cultural tradition, and scientifically verified information. Do not fabricate or exaggerate claims about plant properties."
                : "Lorsque vous partagez du folklore ou des connaissances traditionnelles, soyez honnête sur la source et le contexte culturel. Distinguez clairement entre l'expérience personnelle, la tradition culturelle et les informations scientifiquement vérifiées."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "4. Safety First" : "4. La sécurité d'abord"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Always mention known safety concerns, contraindications, or potential interactions when discussing plants. If you are aware of any risks associated with a plant, share them. Never encourage anyone to consume unknown plants based on appearance alone."
                : "Mentionnez toujours les préoccupations de sécurité connues, les contre-indications ou les interactions potentielles lors de la discussion sur les plantes. N'encouragez jamais quiconque à consommer des plantes inconnues basées uniquement sur l'apparence."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "5. No Spam or Self-Promotion" : "5. Pas de spam ni d'autopromotion"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Do not use the community to promote products, services, or websites. Do not post repetitive or irrelevant content. Genuine product recommendations based on personal experience are acceptable, but commercial promotion is not."
                : "N'utilisez pas la communauté pour promouvoir des produits, des services ou des sites Web. Ne publiez pas de contenu répétitif ou non pertinent."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "6. Consequences" : "6. Conséquences"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Violations of these guidelines may result in content removal, temporary suspension, or permanent ban from the community. Repeated violations or severe breaches (e.g., dangerous medical advice) will result in immediate account suspension."
                : "Les violations de ces directives peuvent entraîner la suppression du contenu, une suspension temporaire ou un bannissement permanent de la communauté."}
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
