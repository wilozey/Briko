import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { ArrowLeft, Shield } from "lucide-react";

export default function Privacy() {
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
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {isEn ? "Privacy Policy" : "Politique de confidentialité"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEn ? "Last updated: May 2026" : "Dernière mise à jour : mai 2026"}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "1. Data We Collect" : "1. Données que nous collectons"}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-3">
              {isEn
                ? "We collect the following categories of personal data:"
                : "Nous collectons les catégories suivantes de données personnelles :"}
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>{isEn ? "Account information: name, email address, login method (via OAuth)" : "Informations de compte : nom, adresse e-mail, méthode de connexion (via OAuth)"}</li>
              <li>{isEn ? "Health profile data: medications, allergies, pregnancy status, age group, chronic conditions (voluntarily provided)" : "Données de profil de santé : médicaments, allergies, statut de grossesse, groupe d'âge, conditions chroniques (fournies volontairement)"}</li>
              <li>{isEn ? "Usage data: search queries, card generations, product clicks, page views" : "Données d'utilisation : requêtes de recherche, générations de cartes, clics sur les produits, pages vues"}</li>
              <li>{isEn ? "User-generated content: folklore submissions, community posts, journal entries" : "Contenu généré par l'utilisateur : soumissions de folklore, publications communautaires, entrées de journal"}</li>
              <li>{isEn ? "Technical data: browser type, device information, IP address (anonymised)" : "Données techniques : type de navigateur, informations sur l'appareil, adresse IP (anonymisée)"}</li>
            </ul>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "2. How We Use Your Data" : "2. Comment nous utilisons vos données"}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>{isEn ? "To provide and personalise the Service (e.g., safety warnings based on your health profile)" : "Pour fournir et personnaliser le Service (par ex., avertissements de sécurité basés sur votre profil de santé)"}</li>
              <li>{isEn ? "To generate AI-powered botanical guidance tailored to your context" : "Pour générer des conseils botaniques alimentés par l'IA adaptés à votre contexte"}</li>
              <li>{isEn ? "To improve the Service through analytics and usage patterns" : "Pour améliorer le Service grâce aux analyses et aux modèles d'utilisation"}</li>
              <li>{isEn ? "To moderate community content and ensure safety" : "Pour modérer le contenu communautaire et assurer la sécurité"}</li>
              <li>{isEn ? "To send restock notifications when requested" : "Pour envoyer des notifications de réapprovisionnement lorsque demandé"}</li>
            </ul>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "3. Health Data Protection" : "3. Protection des données de santé"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Your health profile data is treated with the highest level of care. It is stored securely, encrypted at rest, and is only used to personalise safety warnings in AI-generated content. Health data is never shared with third parties, never used for advertising, and can be deleted at any time from your profile settings. Under UK GDPR, health data is classified as 'special category data' and we process it only with your explicit consent."
                : "Vos données de profil de santé sont traitées avec le plus grand soin. Elles sont stockées en toute sécurité, chiffrées au repos, et ne sont utilisées que pour personnaliser les avertissements de sécurité dans le contenu généré par l'IA. Les données de santé ne sont jamais partagées avec des tiers et peuvent être supprimées à tout moment."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "4. Cookies & Analytics" : "4. Cookies et analyses"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "We use essential cookies for authentication and session management. We use privacy-focused analytics (Umami) that does not use cookies and does not collect personally identifiable information. No third-party tracking cookies are used. You can manage your cookie preferences at any time through the cookie consent banner."
                : "Nous utilisons des cookies essentiels pour l'authentification et la gestion des sessions. Nous utilisons des analyses respectueuses de la vie privée (Umami) qui n'utilisent pas de cookies et ne collectent pas d'informations personnellement identifiables."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "5. Your Rights (UK GDPR)" : "5. Vos droits (RGPD UK)"}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-3">
              {isEn ? "Under UK GDPR, you have the right to:" : "En vertu du RGPD UK, vous avez le droit de :"}
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>{isEn ? "Access your personal data" : "Accéder à vos données personnelles"}</li>
              <li>{isEn ? "Rectify inaccurate data" : "Rectifier les données inexactes"}</li>
              <li>{isEn ? "Request erasure of your data ('right to be forgotten')" : "Demander l'effacement de vos données (« droit à l'oubli »)"}</li>
              <li>{isEn ? "Restrict processing of your data" : "Restreindre le traitement de vos données"}</li>
              <li>{isEn ? "Data portability" : "Portabilité des données"}</li>
              <li>{isEn ? "Object to processing" : "S'opposer au traitement"}</li>
              <li>{isEn ? "Withdraw consent at any time" : "Retirer votre consentement à tout moment"}</li>
            </ul>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "6. Data Retention" : "6. Conservation des données"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Account data is retained for as long as your account is active. Journal entries and health profile data can be deleted at any time. Analytics data is anonymised and retained for up to 24 months. Upon account deletion, all personal data is permanently removed within 30 days."
                : "Les données de compte sont conservées tant que votre compte est actif. Les entrées de journal et les données de profil de santé peuvent être supprimées à tout moment. Les données d'analyse sont anonymisées et conservées jusqu'à 24 mois."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "7. Contact & DPO" : "7. Contact et DPO"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "For privacy-related enquiries or to exercise your rights, contact our Data Protection Officer at privacy@plantinel.com. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk."
                : "Pour les demandes liées à la confidentialité ou pour exercer vos droits, contactez notre Délégué à la Protection des Données à privacy@plantinel.com. Vous avez également le droit de déposer une plainte auprès de l'ICO."}
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
