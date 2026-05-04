export type Language = "en" | "fr";

export const translations = {
  // Navigation
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.library": { en: "Plant Library", fr: "Bibliothèque" },
  "nav.explore": { en: "Explore", fr: "Explorer" },
  "nav.capture": { en: "Capture", fr: "Capturer" },
  "nav.myCards": { en: "My Cards", fr: "Mes Cartes" },
  "nav.journal": { en: "Journal", fr: "Journal" },
  "nav.community": { en: "Community", fr: "Communauté" },
  "nav.profile": { en: "Profile", fr: "Profil" },
  "nav.admin": { en: "Admin", fr: "Admin" },
  "nav.login": { en: "Sign In", fr: "Connexion" },
  "nav.logout": { en: "Sign Out", fr: "Déconnexion" },

  // Home
  "home.hero.title": { en: "Discover the Wisdom of Plants", fr: "Découvrez la Sagesse des Plantes" },
  "home.hero.subtitle": {
    en: "Explore traditional botanical knowledge, AI-powered remedies, and curated herbal products from around the world.",
    fr: "Explorez les connaissances botaniques traditionnelles, les remèdes alimentés par l'IA et les produits à base de plantes du monde entier.",
  },
  "home.hero.cta": { en: "Explore Library", fr: "Explorer la Bibliothèque" },
  "home.hero.capture": { en: "Ask the Apothecary", fr: "Consulter l'Apothicaire" },
  "home.features.title": { en: "What Plantinel Offers", fr: "Ce que Plantinel Offre" },
  "home.features.library": { en: "Plant Library", fr: "Bibliothèque de Plantes" },
  "home.features.libraryDesc": {
    en: "Browse our curated collection of medicinal plants with traditional uses, safety notes, and evidence levels.",
    fr: "Parcourez notre collection de plantes médicinales avec leurs usages traditionnels, notes de sécurité et niveaux de preuve.",
  },
  "home.features.ai": { en: "AI Apothecary", fr: "Apothicaire IA" },
  "home.features.aiDesc": {
    en: "Describe your symptoms or interests and receive AI-generated remedy, folklore, and nutrition cards.",
    fr: "Décrivez vos symptômes ou intérêts et recevez des cartes de remèdes, folklore et nutrition générées par l'IA.",
  },
  "home.features.cards": { en: "Save & Share", fr: "Sauvegarder & Partager" },
  "home.features.cardsDesc": {
    en: "Build your personal collection of plant wisdom cards and share them with friends and family.",
    fr: "Construisez votre collection personnelle de cartes de sagesse botanique et partagez-les avec vos proches.",
  },
  "home.features.products": { en: "Curated Products", fr: "Produits Sélectionnés" },
  "home.features.productsDesc": {
    en: "Discover ethically sourced herbal products from our own collection and trusted partners.",
    fr: "Découvrez des produits à base de plantes éthiquement sourcés de notre propre collection et de partenaires de confiance.",
  },
  "home.plantOfDay": { en: "Plant of the Day", fr: "Plante du Jour" },

  // Explore
  "explore.title": { en: "Explore by Category", fr: "Explorer par Catégorie" },
  "explore.subtitle": {
    en: "Browse plants by their primary use and discover new botanical wisdom.",
    fr: "Parcourez les plantes par usage principal et découvrez de nouvelles sagesses botaniques.",
  },
  "explore.allCategories": { en: "All Categories", fr: "Toutes les Catégories" },

  // Library
  "library.title": { en: "Plant Library", fr: "Bibliothèque de Plantes" },
  "library.search": { en: "Search plants, aliases, or local names...", fr: "Rechercher des plantes, alias ou noms locaux..." },
  "library.noResults": { en: "No plants found matching your search.", fr: "Aucune plante trouvée correspondant à votre recherche." },
  "library.viewAll": { en: "View All Plants", fr: "Voir Toutes les Plantes" },

  // Plant Detail
  "plant.traditionalUses": { en: "Traditional Uses", fr: "Usages Traditionnels" },
  "plant.preparation": { en: "Preparation", fr: "Préparation" },
  "plant.safety": { en: "Safety Notes", fr: "Notes de Sécurité" },
  "plant.aliases": { en: "Also Known As", fr: "Aussi Connu Sous" },
  "plant.products": { en: "Products & Sourcing", fr: "Produits & Approvisionnement" },
  "plant.ourProducts": { en: "Our Products", fr: "Nos Produits" },
  "plant.affiliateProducts": { en: "Partner Products", fr: "Produits Partenaires" },
  "plant.evidence": { en: "Evidence Level", fr: "Niveau de Preuve" },
  "plant.saveCard": { en: "Save to My Cards", fr: "Sauvegarder dans Mes Cartes" },
  "plant.share": { en: "Share", fr: "Partager" },
  "plant.mysticalVirtues": { en: "Mystical Virtues & Folklore", fr: "Vertus Mystiques & Folklore" },
  "plant.activeCompounds": { en: "Active Compounds", fr: "Composés Actifs" },
  "plant.origin": { en: "Origin & Tradition", fr: "Origine & Tradition" },
  "plant.community": { en: "Community Experiences", fr: "Expériences de la Communauté" },

  // Capture / AI
  "capture.title": { en: "Ask the Apothecary", fr: "Consulter l'Apothicaire" },
  "capture.subtitle": {
    en: "Describe what you're looking for and our AI will generate personalised botanical guidance.",
    fr: "Décrivez ce que vous cherchez et notre IA générera des conseils botaniques personnalisés.",
  },
  "capture.symptom": { en: "Describe a symptom or concern", fr: "Décrivez un symptôme ou une préoccupation" },
  "capture.plantName": { en: "Enter a plant name", fr: "Entrez un nom de plante" },
  "capture.alias": { en: "Enter a local or traditional name", fr: "Entrez un nom local ou traditionnel" },
  "capture.pasteText": { en: "Paste text about a plant or remedy", fr: "Collez un texte sur une plante ou un remède" },
  "capture.photo": { en: "Upload a photo (coming soon)", fr: "Télécharger une photo (bientôt disponible)" },
  "capture.ingredients": { en: "List ingredients you have", fr: "Listez les ingrédients que vous avez" },
  "capture.generate": { en: "Generate Cards", fr: "Générer des Cartes" },
  "capture.generating": { en: "Generating your cards...", fr: "Génération de vos cartes..." },
  "capture.cardType": { en: "Card Type", fr: "Type de Carte" },
  "capture.inputMode": { en: "Input Mode", fr: "Mode de Saisie" },
  "capture.clarification": { en: "The Apothecary needs more information:", fr: "L'Apothicaire a besoin de plus d'informations :" },
  "capture.reply": { en: "Your reply...", fr: "Votre réponse..." },
  "capture.sendReply": { en: "Send Reply", fr: "Envoyer la Réponse" },
  "capture.regenerate": { en: "Regenerate", fr: "Régénérer" },

  // Cards
  "cards.myCards": { en: "My Cards", fr: "Mes Cartes" },
  "cards.noCards": { en: "You haven't saved any cards yet.", fr: "Vous n'avez pas encore sauvegardé de cartes." },
  "cards.startExploring": { en: "Start exploring the plant library!", fr: "Commencez à explorer la bibliothèque de plantes !" },
  "cards.plant": { en: "Plant", fr: "Plante" },
  "cards.remedy": { en: "Remedy", fr: "Remède" },
  "cards.folklore": { en: "Folklore", fr: "Folklore" },
  "cards.nutrition": { en: "Nutrition", fr: "Nutrition" },
  "cards.all": { en: "All Cards", fr: "Toutes les Cartes" },
  "cards.saved": { en: "Saved", fr: "Sauvegardé" },
  "cards.delete": { en: "Delete", fr: "Supprimer" },
  "cards.shareLink": { en: "Share Link", fr: "Lien de Partage" },
  "cards.edit": { en: "Edit Card", fr: "Modifier la Carte" },
  "cards.confidence": { en: "Confidence", fr: "Confiance" },
  "cards.caution": { en: "Caution Level", fr: "Niveau de Prudence" },

  // Journal
  "journal.title": { en: "Remedy Journal", fr: "Journal des Remèdes" },
  "journal.subtitle": {
    en: "Track your herbal remedy experiences and monitor what works for you.",
    fr: "Suivez vos expériences avec les remèdes à base de plantes et surveillez ce qui fonctionne pour vous.",
  },
  "journal.newEntry": { en: "New Entry", fr: "Nouvelle Entrée" },
  "journal.symptoms": { en: "Symptoms", fr: "Symptômes" },
  "journal.remedyUsed": { en: "Remedy Used", fr: "Remède Utilisé" },
  "journal.result": { en: "Result", fr: "Résultat" },
  "journal.improved": { en: "Improved", fr: "Amélioré" },
  "journal.noChange": { en: "No Change", fr: "Aucun Changement" },
  "journal.worsened": { en: "Worsened", fr: "Aggravé" },
  "journal.duration": { en: "Duration", fr: "Durée" },
  "journal.notes": { en: "Notes", fr: "Notes" },
  "journal.noEntries": { en: "No journal entries yet. Start tracking your remedy experiences!", fr: "Aucune entrée de journal. Commencez à suivre vos expériences avec les remèdes !" },

  // Community
  "community.title": { en: "Community", fr: "Communauté" },
  "community.subtitle": {
    en: "Share your experiences and learn from others in the plant wisdom community.",
    fr: "Partagez vos expériences et apprenez des autres dans la communauté de sagesse botanique.",
  },
  "community.newPost": { en: "Share Your Experience", fr: "Partagez Votre Expérience" },
  "community.postTitle": { en: "Title", fr: "Titre" },
  "community.postContent": { en: "Share your story...", fr: "Partagez votre histoire..." },
  "community.postType": { en: "Post Type", fr: "Type de Publication" },
  "community.experience": { en: "Personal Experience", fr: "Expérience Personnelle" },
  "community.tradition": { en: "Cultural Tradition", fr: "Tradition Culturelle" },
  "community.folklorePost": { en: "Folklore Story", fr: "Histoire de Folklore" },
  "community.question": { en: "Question", fr: "Question" },
  "community.submit": { en: "Submit for Review", fr: "Soumettre pour Révision" },
  "community.pendingReview": { en: "Your post is pending review by our moderators.", fr: "Votre publication est en attente de révision par nos modérateurs." },
  "community.noPosts": { en: "No community posts yet. Be the first to share!", fr: "Aucune publication communautaire. Soyez le premier à partager !" },

  // Health Profile
  "health.title": { en: "Health Profile", fr: "Profil de Santé" },
  "health.subtitle": {
    en: "Help us personalise your safety warnings and recommendations.",
    fr: "Aidez-nous à personnaliser vos avertissements de sécurité et recommandations.",
  },
  "health.medications": { en: "Current Medications", fr: "Médicaments Actuels" },
  "health.allergies": { en: "Known Allergies", fr: "Allergies Connues" },
  "health.pregnant": { en: "Pregnant", fr: "Enceinte" },
  "health.breastfeeding": { en: "Breastfeeding", fr: "Allaitement" },
  "health.ageGroup": { en: "Age Group", fr: "Groupe d'Âge" },
  "health.conditions": { en: "Chronic Conditions", fr: "Conditions Chroniques" },
  "health.saved": { en: "Health profile saved!", fr: "Profil de santé sauvegardé !" },
  "health.privacy": {
    en: "Your health data is stored securely and used only to personalise safety warnings in AI-generated content.",
    fr: "Vos données de santé sont stockées en toute sécurité et utilisées uniquement pour personnaliser les avertissements de sécurité dans le contenu généré par l'IA.",
  },

  // Evidence levels
  "evidence.research": { en: "Research-Backed", fr: "Soutenu par la Recherche" },
  "evidence.traditional": { en: "Traditional Use", fr: "Usage Traditionnel" },
  "evidence.mixed": { en: "Mixed Evidence", fr: "Preuves Mixtes" },
  "evidence.folklore": { en: "Folklore / Unverified", fr: "Folklore / Non Vérifié" },

  // Products
  "product.ownLabel": { en: "Plantinel Product", fr: "Produit Plantinel" },
  "product.affiliate": { en: "Affiliate", fr: "Affilié" },
  "product.sponsored": { en: "Sponsored", fr: "Sponsorisé" },
  "product.inStock": { en: "In Stock", fr: "En Stock" },
  "product.outOfStock": { en: "Out of Stock", fr: "Rupture de Stock" },
  "product.lowStock": { en: "Low Stock", fr: "Stock Faible" },
  "product.notifyRestock": { en: "Notify me when back in stock", fr: "Me notifier quand de retour en stock" },
  "product.buy": { en: "Buy Now", fr: "Acheter" },
  "product.view": { en: "View Product", fr: "Voir le Produit" },

  // Disclaimers
  "disclaimer.general": {
    en: "This content is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before using any herbal remedy.",
    fr: "Ce contenu est à titre informatif uniquement et ne constitue pas un avis médical. Consultez toujours un professionnel de santé qualifié avant d'utiliser un remède à base de plantes.",
  },
  "disclaimer.folklore": {
    en: "This content is based on cultural folklore and traditional beliefs. It has not been scientifically verified and should not be used as a basis for health decisions.",
    fr: "Ce contenu est basé sur le folklore culturel et les croyances traditionnelles. Il n'a pas été vérifié scientifiquement et ne doit pas servir de base à des décisions de santé.",
  },
  "disclaimer.photo": {
    en: "Plant identification from photos is not reliable. Never consume a plant based solely on image identification. Always verify with an expert.",
    fr: "L'identification des plantes à partir de photos n'est pas fiable. Ne consommez jamais une plante uniquement sur la base d'une identification par image. Vérifiez toujours avec un expert.",
  },
  "disclaimer.ai": {
    en: "This content was generated by AI and should be reviewed carefully. It is not a substitute for professional medical advice.",
    fr: "Ce contenu a été généré par l'IA et doit être examiné attentivement. Il ne remplace pas un avis médical professionnel.",
  },

  // Common
  "common.loading": { en: "Loading...", fr: "Chargement..." },
  "common.error": { en: "Something went wrong", fr: "Une erreur est survenue" },
  "common.save": { en: "Save", fr: "Sauvegarder" },
  "common.cancel": { en: "Cancel", fr: "Annuler" },
  "common.edit": { en: "Edit", fr: "Modifier" },
  "common.delete": { en: "Delete", fr: "Supprimer" },
  "common.back": { en: "Back", fr: "Retour" },
  "common.viewMore": { en: "View More", fr: "Voir Plus" },
  "common.gbp": { en: "£", fr: "£" },

  // Admin
  "admin.title": { en: "Admin Dashboard", fr: "Tableau de Bord Admin" },
  "admin.plants": { en: "Manage Plants", fr: "Gérer les Plantes" },
  "admin.products": { en: "Manage Products", fr: "Gérer les Produits" },
  "admin.affiliates": { en: "Manage Affiliates", fr: "Gérer les Affiliés" },
  "admin.moderation": { en: "Content Moderation", fr: "Modération du Contenu" },
  "admin.analytics": { en: "Analytics", fr: "Analytiques" },
  "admin.community": { en: "Community Posts", fr: "Publications Communautaires" },

  // Profile
  "profile.title": { en: "My Profile", fr: "Mon Profil" },
  "profile.language": { en: "Language", fr: "Langue" },
  "profile.savedCards": { en: "Saved Cards", fr: "Cartes Sauvegardées" },
  "profile.healthProfile": { en: "Health Profile", fr: "Profil de Santé" },

  // Legal
  "legal.terms": { en: "Terms of Service", fr: "Conditions d'Utilisation" },
  "legal.privacy": { en: "Privacy Policy", fr: "Politique de Confidentialité" },
  "legal.disclaimer": { en: "Medical Disclaimer", fr: "Avertissement Médical" },

  // Cards Gallery
  "nav.cards": { en: "Cards", fr: "Cartes" },
  "gallery.title": { en: "Botanical Card Gallery", fr: "Galerie de Cartes Botaniques" },
  "gallery.subtitle": {
    en: "Explore curated botanical wisdom — remedies, folklore, and nutrition cards from the Apothecary.",
    fr: "Explorez la sagesse botanique curative — remèdes, folklore et cartes nutritionnelles de l'Apothicaire.",
  },
  "gallery.folklore.title": { en: "Folklore & Mystical Wisdom", fr: "Folklore & Sagesse Mystique" },
  "gallery.folklore.subtitle": {
    en: "Ancient traditions, cultural beliefs, and mystical virtues passed down through generations.",
    fr: "Traditions ancestrales, croyances culturelles et vertus mystiques transmises de génération en génération.",
  },
  "gallery.pinned.title": { en: "Curated by the Apothecary", fr: "Sélection de l'Apothicaire" },
  "gallery.pinned.subtitle": {
    en: "Hand-picked cards of enduring botanical wisdom.",
    fr: "Cartes sélectionnées de sagesse botanique durable.",
  },
  "gallery.dynamic.title": { en: "Discover More", fr: "Découvrez Plus" },
  "gallery.dynamic.subtitle": {
    en: "Cards from the community and AI-generated botanical knowledge.",
    fr: "Cartes de la communauté et connaissances botaniques générées par l'IA.",
  },
  "gallery.filter.all": { en: "All Cards", fr: "Toutes les Cartes" },
  "gallery.filter.remedy": { en: "Remedies", fr: "Remèdes" },
  "gallery.filter.folklore": { en: "Folklore", fr: "Folklore" },
  "gallery.filter.nutrition": { en: "Nutrition", fr: "Nutrition" },
  "gallery.filter.plant": { en: "Plants", fr: "Plantes" },
  "gallery.save": { en: "Save to My Cards", fr: "Sauvegarder" },
  "gallery.saved": { en: "Saved", fr: "Sauvegardé" },
  "gallery.unsave": { en: "Remove from My Cards", fr: "Retirer" },
  "gallery.empty": { en: "No cards yet. Check back soon!", fr: "Pas encore de cartes. Revenez bientôt !" },
  "gallery.viewDetail": { en: "View Card", fr: "Voir la Carte" },
  "myCards.title": { en: "My Saved Cards", fr: "Mes Cartes Sauvegardées" },
  "myCards.subtitle": {
    en: "Your personal collection of saved botanical cards.",
    fr: "Votre collection personnelle de cartes botaniques sauvegardées.",
  },
  "myCards.empty": {
    en: "You haven't saved any cards yet. Browse the gallery to find cards you love!",
    fr: "Vous n'avez pas encore sauvegardé de cartes. Parcourez la galerie pour trouver des cartes !",
  },
  "admin.cards": { en: "Cards", fr: "Cartes" },
  "admin.cards.pin": { en: "Pin", fr: "Épingler" },
  "admin.cards.unpin": { en: "Unpin", fr: "Désépingler" },
  "admin.cards.feature": { en: "Feature", fr: "Mettre en avant" },
  "admin.cards.unfeature": { en: "Unfeature", fr: "Retirer" },
  "admin.cards.makePublic": { en: "Make Public", fr: "Rendre Public" },
  "admin.cards.makePrivate": { en: "Make Private", fr: "Rendre Privé" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
