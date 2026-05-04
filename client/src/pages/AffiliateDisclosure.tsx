import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import AppLayout from "@/components/AppLayout";
import { ArrowLeft, DollarSign } from "lucide-react";

export default function AffiliateDisclosure() {
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
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {isEn ? "Affiliate Disclosure" : "Divulgation d'affiliation"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEn ? "Last updated: May 2026" : "Dernière mise à jour : mai 2026"}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Our Commitment to Transparency" : "Notre engagement envers la transparence"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Plantinel — The Apothecary believes in full transparency about how we earn revenue. This page explains our product listing practices, affiliate relationships, and how they may affect the content you see on our platform."
                : "Plantinel — L'Apothicaire croit en la transparence totale sur la façon dont nous générons des revenus. Cette page explique nos pratiques de référencement de produits, nos relations d'affiliation et comment elles peuvent affecter le contenu que vous voyez sur notre plateforme."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Own Products" : "Nos propres produits"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Products labelled 'Plantinel' or 'Kopto' are our own products, sold directly by us. These products are always displayed first in product listings because we can guarantee their quality, sourcing, and authenticity. Our flagship product, Kopto Moringa Powder, is sourced directly from Niger and shipped from the United Kingdom."
                : "Les produits étiquetés « Plantinel » ou « Kopto » sont nos propres produits, vendus directement par nous. Ces produits sont toujours affichés en premier dans les listes de produits car nous pouvons garantir leur qualité, leur approvisionnement et leur authenticité."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Affiliate Links" : "Liens d'affiliation"}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-3">
              {isEn
                ? "Some product links on Plantinel are affiliate links to third-party retailers including Amazon and iHerb. When you click on these links and make a purchase, we may earn a small commission at no additional cost to you. Affiliate products are always displayed below our own products and are clearly marked with an 'Affiliate' badge."
                : "Certains liens de produits sur Plantinel sont des liens d'affiliation vers des détaillants tiers, notamment Amazon et iHerb. Lorsque vous cliquez sur ces liens et effectuez un achat, nous pouvons percevoir une petite commission sans coût supplémentaire pour vous."}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              {isEn
                ? "Affiliate links are always identified with a visible badge near the product tile. We never disguise affiliate links as editorial recommendations."
                : "Les liens d'affiliation sont toujours identifiés par un badge visible près de la vignette du produit. Nous ne déguisons jamais les liens d'affiliation en recommandations éditoriales."}
            </div>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Sponsored Products" : "Produits sponsorisés"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Occasionally, we may feature sponsored products from partners. These are always clearly labelled as 'Sponsored' and are displayed separately from organic product listings. Sponsorship does not influence our editorial content, AI-generated recommendations, or plant information."
                : "Occasionnellement, nous pouvons présenter des produits sponsorisés de partenaires. Ceux-ci sont toujours clairement étiquetés comme « Sponsorisé » et sont affichés séparément des listes de produits organiques."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Editorial Independence" : "Indépendance éditoriale"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "Our botanical information, AI-generated content, folklore stories, and safety warnings are never influenced by commercial relationships. Product recommendations in AI-generated cards are based on relevance and safety, not affiliate commissions. We prioritise your health and safety above all commercial interests."
                : "Nos informations botaniques, le contenu généré par l'IA, les histoires de folklore et les avertissements de sécurité ne sont jamais influencés par des relations commerciales. Nous priorisons votre santé et votre sécurité au-dessus de tous les intérêts commerciaux."}
            </p>
          </section>

          <section className="botanical-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              {isEn ? "Contact" : "Contact"}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {isEn
                ? "If you have questions about our affiliate relationships or product listings, please contact us at partnerships@plantinel.com."
                : "Si vous avez des questions sur nos relations d'affiliation ou nos listes de produits, veuillez nous contacter à partnerships@plantinel.com."}
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
