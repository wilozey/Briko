import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { ArrowLeft, Eye } from "lucide-react";

export default function ModerationPolicy() {
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
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Eye className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {isEn ? "Moderation Policy" : "Politique de modération"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEn ? "Last updated: May 2026" : "Dernière mise à jour : mai 2026"}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Overview" : "Aperçu"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "All user-generated content on Plantinel is subject to moderation to ensure safety, accuracy, and compliance with our Community Guidelines. This policy explains how content is reviewed, what triggers moderation, and how decisions are made."
                : "Tout le contenu généré par les utilisateurs sur Plantinel est soumis à modération pour assurer la sécurité, l'exactitude et la conformité avec nos Directives communautaires."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "What Is Moderated" : "Ce qui est modéré"}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>{isEn ? "Community posts (experiences, questions, tips)" : "Publications communautaires (expériences, questions, conseils)"}</li>
              <li>{isEn ? "Folklore story submissions" : "Soumissions d'histoires de folklore"}</li>
              <li>{isEn ? "User-submitted plant images" : "Images de plantes soumises par les utilisateurs"}</li>
              <li>{isEn ? "Reported content flagged by other users" : "Contenu signalé par d'autres utilisateurs"}</li>
            </ul>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Review Process" : "Processus de révision"}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-3">
              {isEn ? "Content goes through the following stages:" : "Le contenu passe par les étapes suivantes :"}
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <div>
                  <h4 className="font-medium text-foreground">{isEn ? "Submission" : "Soumission"}</h4>
                  <p className="text-sm text-muted-foreground">{isEn ? "Content is submitted and enters the moderation queue with 'pending' status." : "Le contenu est soumis et entre dans la file d'attente de modération avec le statut « en attente »."}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <div>
                  <h4 className="font-medium text-foreground">{isEn ? "Review" : "Révision"}</h4>
                  <p className="text-sm text-muted-foreground">{isEn ? "An admin reviews the content for safety, accuracy, and guideline compliance." : "Un administrateur examine le contenu pour la sécurité, l'exactitude et la conformité aux directives."}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <div>
                  <h4 className="font-medium text-foreground">{isEn ? "Decision" : "Décision"}</h4>
                  <p className="text-sm text-muted-foreground">{isEn ? "Content is approved, rejected (with reason), or returned for revision." : "Le contenu est approuvé, rejeté (avec raison) ou renvoyé pour révision."}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Automatic Flags" : "Signalements automatiques"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Content may be automatically flagged for priority review if it contains: medical claims or dosage recommendations, references to dangerous plants or substances, language suggesting it should replace medical treatment, or content reported by multiple community members."
                : "Le contenu peut être automatiquement signalé pour examen prioritaire s'il contient : des allégations médicales ou des recommandations de dosage, des références à des plantes ou substances dangereuses, un langage suggérant qu'il devrait remplacer un traitement médical."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Appeals" : "Appels"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "If your content is rejected, you will receive a notification with the reason. You may appeal the decision by contacting moderation@plantinel.com with the content ID and your reasoning. Appeals are reviewed within 5 business days."
                : "Si votre contenu est rejeté, vous recevrez une notification avec la raison. Vous pouvez faire appel de la décision en contactant moderation@plantinel.com avec l'identifiant du contenu et votre raisonnement."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Response Times" : "Délais de réponse"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "We aim to review all submitted content within 48 hours. During peak periods, this may extend to 72 hours. Safety-critical content (e.g., dangerous advice reports) is prioritised and reviewed within 24 hours."
                : "Nous visons à examiner tout le contenu soumis dans les 48 heures. Pendant les périodes de pointe, cela peut s'étendre à 72 heures. Le contenu critique pour la sécurité est priorisé et examiné dans les 24 heures."}
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
