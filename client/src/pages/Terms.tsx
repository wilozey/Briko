import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { ArrowLeft, FileText } from "lucide-react";

export default function Terms() {
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
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {isEn ? "Terms of Service" : "Conditions d'utilisation"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEn ? "Last updated: May 2026" : "Dernière mise à jour : mai 2026"}
            </p>
          </div>
        </div>

        <div className="prose prose-green max-w-none space-y-8">
          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "1. Acceptance of Terms" : "1. Acceptation des conditions"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "By accessing and using Plantinel — The Apothecary ('the Service'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any changes."
                : "En accédant et en utilisant Plantinel — L'Apothicaire (« le Service »), vous acceptez d'être lié par ces Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Service. Nous nous réservons le droit de mettre à jour ces conditions à tout moment."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "2. Nature of the Service" : "2. Nature du Service"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Plantinel provides botanical information, traditional plant knowledge, AI-generated wellness guidance, and community features for educational and informational purposes only. The Service is NOT a medical service, does NOT provide medical diagnoses, and should NEVER be used as a substitute for professional medical advice, diagnosis, or treatment."
                : "Plantinel fournit des informations botaniques, des connaissances traditionnelles sur les plantes, des conseils de bien-être générés par l'IA et des fonctionnalités communautaires à des fins éducatives et informatives uniquement. Le Service n'est PAS un service médical, ne fournit PAS de diagnostics médicaux et ne doit JAMAIS être utilisé comme substitut à un avis médical professionnel."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "3. User Accounts" : "3. Comptes utilisateurs"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 16 years old to create an account. You agree to provide accurate information and to update it as necessary. We reserve the right to suspend or terminate accounts that violate these terms."
                : "Vous êtes responsable du maintien de la confidentialité de vos identifiants de compte et de toutes les activités qui se produisent sous votre compte. Vous devez avoir au moins 16 ans pour créer un compte. Vous acceptez de fournir des informations exactes et de les mettre à jour si nécessaire."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "4. User-Generated Content" : "4. Contenu généré par les utilisateurs"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "By submitting content (folklore stories, community posts, journal entries), you grant Plantinel a non-exclusive, worldwide, royalty-free licence to use, display, and distribute your content within the Service. You retain ownership of your original content. You agree not to submit content that is harmful, misleading, defamatory, or that constitutes medical advice. All user-submitted content is subject to moderation and may be removed at our discretion."
                : "En soumettant du contenu (histoires de folklore, publications communautaires, entrées de journal), vous accordez à Plantinel une licence non exclusive, mondiale et libre de redevances pour utiliser, afficher et distribuer votre contenu au sein du Service. Vous conservez la propriété de votre contenu original. Tout contenu soumis est soumis à modération."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "5. AI-Generated Content" : "5. Contenu généré par l'IA"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "AI-generated cards, remedies, and recommendations are produced by artificial intelligence and may contain inaccuracies. They are provided for informational purposes only and should not be relied upon as medical advice. Always verify AI-generated content with qualified healthcare professionals before acting on any recommendations."
                : "Les cartes, remèdes et recommandations générés par l'IA sont produits par l'intelligence artificielle et peuvent contenir des inexactitudes. Ils sont fournis à titre informatif uniquement et ne doivent pas être considérés comme des conseils médicaux."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "6. Product Listings & Affiliate Links" : "6. Produits et liens d'affiliation"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "The Service may display products for sale and affiliate links to third-party retailers. Plantinel earns commission on purchases made through affiliate links. Product availability, pricing, and shipping are subject to the respective retailer's terms. Plantinel is not responsible for third-party products or services."
                : "Le Service peut afficher des produits à vendre et des liens d'affiliation vers des détaillants tiers. Plantinel perçoit une commission sur les achats effectués via les liens d'affiliation. La disponibilité, les prix et la livraison des produits sont soumis aux conditions du détaillant respectif."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "7. Limitation of Liability" : "7. Limitation de responsabilité"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "To the fullest extent permitted by law, Plantinel shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to health outcomes resulting from following any information provided. Your use of the Service is entirely at your own risk."
                : "Dans toute la mesure permise par la loi, Plantinel ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs découlant de votre utilisation du Service, y compris les résultats de santé résultant du suivi de toute information fournie."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "8. Governing Law" : "8. Droit applicable"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales."
                : "Ces Conditions sont régies et interprétées conformément aux lois d'Angleterre et du Pays de Galles. Tout litige découlant de ces conditions sera soumis à la juridiction exclusive des tribunaux d'Angleterre et du Pays de Galles."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "9. Contact" : "9. Contact"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "For questions about these Terms of Service, please contact us at legal@plantinel.com."
                : "Pour toute question concernant ces Conditions d'utilisation, veuillez nous contacter à legal@plantinel.com."}
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
