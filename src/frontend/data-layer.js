// Frontend data layer that can switch between real API modules and local mock data.
// TODO: Wire this to Supabase once the no-code app is ready for live data sync.

const MOCK = {
  plants: [
    {
      id: "moringa",
      name: "Moringa",
      latin: "Moringa oleifera",
      aliases: ["Kopto", "Névédé"],
      evidence: "Research supported",
      uses: "nutrition tea immune support Niger",
      theme: "moringa"
    },
    {
      id: "bitter-leaf",
      name: "Bitter Leaf",
      latin: "Vernonia amygdalina",
      aliases: ["Ewuro", "Chou amer"],
      evidence: "Traditional use",
      uses: "digestive support African herbal knowledge",
      theme: "bitter"
    },
    {
      id: "hibiscus",
      name: "Hibiscus",
      latin: "Hibiscus sabdariffa",
      aliases: ["Bissap", "Roselle"],
      evidence: "Research supported",
      uses: "drink wellness antioxidant",
      theme: "hibiscus"
    },
    {
      id: "ginger",
      name: "Ginger",
      latin: "Zingiber officinale",
      aliases: ["Gingembre"],
      evidence: "Research supported",
      uses: "digestive respiratory tea",
      theme: "ginger"
    }
  ],
  remedies: [
    {
      id: "moringa-tea",
      title: "Moringa Tea",
      description: "A gentle nutrient-focused preparation using Kopto moringa leaves.",
      prep: "Tea · 10 min",
      evidence: "Research supported",
      theme: "moringa"
    },
    {
      id: "moringa-powder",
      title: "Moringa Protein Support",
      description: "Nutrition card for gym users exploring natural plant proteins.",
      prep: "Powder · 5 min",
      evidence: "Nutrition",
      theme: "powder"
    },
    {
      id: "sage-folklore",
      title: "Sage Cleansing Folklore",
      description: "Cultural belief card, clearly labeled as unverified folklore.",
      prep: "Folklore",
      evidence: "Unverified",
      theme: "sage"
    }
  ],
  collections: [
    { id: "c1", name: "African plants" },
    { id: "c2", name: "Gym support plants" },
    { id: "c3", name: "Folklore and protection" }
  ]
};

export async function getLibraryData() {
  return { plants: MOCK.plants, remedies: MOCK.remedies };
}

export async function getCollectionsData() {
  return MOCK.collections;
}

export async function getExploreData() {
  return {
    community: [{ id: "cm1", title: "My family uses Kopto as tea in Niger" }],
    marketplace: [{ id: "m1", title: "Organic Moringa Tea Bags", price: "£10.00 / 250g" }]
  };
}
