export async function generatePlantinelCard({ input, mode }) {
  const normalized = input.toLowerCase();
  const isMoringa = /moringa|kopto|névédé|nevede|protein|gym|nutrition/.test(normalized);
  const isFolklore = /spirit|luck|snake|protect|folklore|mystic/.test(normalized) || mode === "text";

  if (isMoringa) {
    return {
      cardType: /protein|gym|nutrition/.test(normalized) ? "Nutrition Card" : "Plant Card",
      title: "Moringa",
      latinName: "Moringa oleifera",
      aliases: ["Kopto · Niger", "Névédé · Côte d'Ivoire"],
      evidenceLevel: "Research supported",
      uses: {
        en: "Traditionally used as a nutrient-rich leaf for tea, food support, and everyday wellness.",
        fr: "Traditionnellement utilisée comme feuille riche en nutriments pour le thé, l'alimentation et le bien-être quotidien."
      },
      steps: [
        "Use dried moringa leaves or tea bags.",
        "Steep in hot water for 5-10 minutes.",
        "Drink as a food and wellness tea, not as a medical treatment."
      ],
      safety:
        "Educational only. Consult a qualified professional before use if pregnant, breastfeeding, taking medication, diabetic, or managing a chronic condition.",
      folklore:
        "Some communities associate protective or good-fortune meanings with household plants. This is cultural testimony only and is not scientifically verified.",
      product: {
        name: "Plantinel Organic Moringa Tea Bags",
        detail: "Kopto from Niger, shipped from the UK · 250g · £10.00",
        cta: "Buy first"
      }
    };
  }

  if (isFolklore) {
    return {
      cardType: "Folklore Card",
      title: "Rue",
      latinName: "Ruta graveolens",
      aliases: ["Rue", "Herbe de protection"],
      evidenceLevel: "Unverified folklore",
      uses: {
        en: "Recorded in some traditions as a plant associated with protection, cleansing, and household rituals.",
        fr: "Mentionnée dans certaines traditions comme une plante associée à la protection, la purification et les rituels domestiques."
      },
      steps: [
        "Record the tradition, region, and contributor.",
        "Label the claim as folklore or community testimony.",
        "Do not present mystical claims as medical or scientific facts."
      ],
      safety:
        "Do not ingest or apply plants based on folklore claims. This section is for cultural documentation and discussion only.",
      folklore:
        "Beliefs about spirits, luck, protection, or animals are displayed as unverified cultural beliefs users may discuss or testify about.",
      product: {
        name: "Related products",
        detail: "Plantinel-owned products appear first; competitors remain below as clearly labeled affiliate options.",
        cta: "Learn more"
      }
    };
  }

  return {
    cardType: mode === "symptom" ? "Remedy Card" : "Plant Card",
    title: "Marshmallow Root",
    latinName: "Althaea officinalis",
    aliases: ["Guimauve", "Mallow root"],
    evidenceLevel: "Traditional use",
    uses: {
      en: "Traditionally used to soothe irritated throat and respiratory mucous membranes.",
      fr: "Traditionnellement utilisée pour apaiser la gorge irritée et les muqueuses respiratoires."
    },
    steps: [
      "Soak dried root in cool water for 4-8 hours for a mucilage-rich infusion.",
      "Strain before drinking.",
      "Keep the card editable so exact quantities can be reviewed later."
    ],
    safety:
      "Educational only, not diagnosis or treatment. Seek urgent medical help for severe symptoms, breathing difficulty, chest pain, or allergic reaction.",
    folklore:
      "No mystical claim is shown unless the source is explicitly labeled as folklore, community testimony, or traditional belief.",
    product: {
      name: "Ingredient sourcing",
      detail: "Plantinel-owned stock appears first when available, followed by transparent affiliate links.",
      cta: "Find"
    }
  };
}
