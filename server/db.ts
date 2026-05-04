import { eq, like, or, desc, asc, and, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  plants,
  plantAliases,
  plantSafety,
  cards,
  collections,
  ownProducts,
  affiliateLinks,
  sponsoredProducts,
  restockNotifications,
  cardShares,
  communityPosts,
  reports,
  analyticsEvents,
  userHealthProfiles,
  journalEntries,
  type InsertCard,
  type UserHealthProfile,
  type JournalEntry,
  savedCards,
  gardens,
  gardenPlants,
  ratings,
  comments,
  folkloreSubmissions,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserLanguage(userId: number, lang: "en" | "fr") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ preferredLanguage: lang }).where(eq(users.id, userId));
}

// ─── User Health Profiles ────────────────────────────────────────────
export async function getHealthProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userHealthProfiles).where(eq(userHealthProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function upsertHealthProfile(userId: number, data: {
  medications?: string[];
  allergies?: string[];
  isPregnant?: boolean;
  isBreastfeeding?: boolean;
  ageGroup?: "child" | "teen" | "adult" | "senior";
  chronicConditions?: string[];
}) {
  const db = await getDb();
  if (!db) return;
  const existing = await getHealthProfile(userId);
  if (existing) {
    await db.update(userHealthProfiles).set({
      medications: data.medications ?? existing.medications,
      allergies: data.allergies ?? existing.allergies,
      isPregnant: data.isPregnant ?? existing.isPregnant,
      isBreastfeeding: data.isBreastfeeding ?? existing.isBreastfeeding,
      ageGroup: data.ageGroup ?? existing.ageGroup,
      chronicConditions: data.chronicConditions ?? existing.chronicConditions,
    }).where(eq(userHealthProfiles.userId, userId));
  } else {
    await db.insert(userHealthProfiles).values({
      userId,
      medications: data.medications || [],
      allergies: data.allergies || [],
      isPregnant: data.isPregnant || false,
      isBreastfeeding: data.isBreastfeeding || false,
      ageGroup: data.ageGroup || "adult",
      chronicConditions: data.chronicConditions || [],
    });
  }
}

// ─── Plants ──────────────────────────────────────────────────────────
export async function getApprovedPlants() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plants).where(eq(plants.approved, true)).orderBy(asc(plants.commonNameEn));
}

export async function getAllPlants() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plants).orderBy(desc(plants.createdAt));
}

export async function getPlantById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(plants).where(eq(plants.id, id)).limit(1);
  return result[0];
}

export async function searchPlants(query: string) {
  const db = await getDb();
  if (!db) return [];
  const q = `%${query}%`;

  const plantResults = await db
    .select()
    .from(plants)
    .where(
      and(
        eq(plants.approved, true),
        or(
          like(plants.commonNameEn, q),
          like(plants.commonNameFr, q),
          like(plants.scientificName, q)
        )
      )
    );

  const aliasResults = await db
    .select({ plantId: plantAliases.plantId })
    .from(plantAliases)
    .where(like(plantAliases.alias, q));

  const aliasPlantIds = aliasResults.map((a) => a.plantId);

  if (aliasPlantIds.length > 0) {
    const aliasPlants = await db
      .select()
      .from(plants)
      .where(and(eq(plants.approved, true), inArray(plants.id, aliasPlantIds)));

    const seen = new Set(plantResults.map((p) => p.id));
    for (const p of aliasPlants) {
      if (!seen.has(p.id)) {
        plantResults.push(p);
        seen.add(p.id);
      }
    }
  }

  return plantResults;
}

export async function getPlantsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plants).where(and(eq(plants.approved, true), eq(plants.category, category))).orderBy(asc(plants.commonNameEn));
}

export async function getPlantCategories() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.selectDistinct({ category: plants.category }).from(plants).where(and(eq(plants.approved, true), sql`${plants.category} IS NOT NULL`));
  return result.map(r => r.category).filter(Boolean) as string[];
}

export async function getPlantAliases(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantAliases).where(eq(plantAliases.plantId, plantId));
}

export async function getPlantSafetyNotes(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantSafety).where(eq(plantSafety.plantId, plantId));
}

// ─── Cards ───────────────────────────────────────────────────────────
export async function createCard(card: InsertCard) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(cards).values(card);
  const insertId = result[0].insertId;
  return getCardById(insertId);
}

export async function getCardById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cards).where(eq(cards.id, id)).limit(1);
  return result[0];
}

export async function getUserCards(userId: number, cardType?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(cards.userId, userId)];
  if (cardType && cardType !== "all") {
    conditions.push(eq(cards.cardType, cardType as any));
  }
  return db
    .select()
    .from(cards)
    .where(and(...conditions))
    .orderBy(desc(cards.createdAt));
}

export async function deleteCard(id: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(cards).where(and(eq(cards.id, id), eq(cards.userId, userId)));
  return true;
}

export async function updateCard(id: number, userId: number, data: Partial<InsertCard>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(cards).set(data).where(and(eq(cards.id, id), eq(cards.userId, userId)));
  return getCardById(id);
}

export async function getCardByShareSlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(cards)
    .where(and(eq(cards.shareSlug, slug), eq(cards.publicShareEnabled, true)))
    .limit(1);
  return result[0];
}

export async function updateCardShareSlug(cardId: number, userId: number, slug: string) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(cards)
    .set({ shareSlug: slug, publicShareEnabled: true })
    .where(and(eq(cards.id, cardId), eq(cards.userId, userId)));
}

// ─── Public Cards Gallery ────────────────────────────────────────
export async function getPublicCards(options?: { cardType?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(cards.isPublic, true)];
  if (options?.cardType && options.cardType !== "all") {
    conditions.push(eq(cards.cardType, options.cardType as any));
  }
  return db
    .select()
    .from(cards)
    .where(and(...conditions))
    .orderBy(desc(cards.isPinned), desc(cards.isFeatured), desc(cards.createdAt))
    .limit(options?.limit || 100);
}

export async function getFeaturedFolkloreCards(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(cards)
    .where(and(eq(cards.isPublic, true), eq(cards.cardType, "folklore")))
    .orderBy(desc(cards.isFeatured), desc(cards.isPinned), desc(cards.createdAt))
    .limit(limit);
}

export async function getPinnedCards() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(cards)
    .where(and(eq(cards.isPublic, true), eq(cards.isPinned, true)))
    .orderBy(desc(cards.createdAt));
}

export async function getDynamicCards(limit = 12) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(cards)
    .where(and(eq(cards.isPublic, true), eq(cards.isPinned, false)))
    .orderBy(desc(cards.createdAt))
    .limit(limit);
}

// ─── Saved Cards (User Bookmarks) ────────────────────────────────
export async function getUserSavedCards(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const saved = await db
    .select({ cardId: savedCards.cardId })
    .from(savedCards)
    .where(eq(savedCards.userId, userId));
  if (saved.length === 0) return [];
  const cardIds = saved.map(s => s.cardId);
  return db
    .select()
    .from(cards)
    .where(inArray(cards.id, cardIds))
    .orderBy(desc(cards.createdAt));
}

export async function saveCardForUser(userId: number, cardId: number) {
  const db = await getDb();
  if (!db) return false;
  // Check if already saved
  const existing = await db
    .select()
    .from(savedCards)
    .where(and(eq(savedCards.userId, userId), eq(savedCards.cardId, cardId)))
    .limit(1);
  if (existing.length > 0) return true; // already saved
  await db.insert(savedCards).values({ userId, cardId });
  return true;
}

export async function unsaveCardForUser(userId: number, cardId: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(savedCards).where(and(eq(savedCards.userId, userId), eq(savedCards.cardId, cardId)));
  return true;
}

export async function isCardSavedByUser(userId: number, cardId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(savedCards)
    .where(and(eq(savedCards.userId, userId), eq(savedCards.cardId, cardId)))
    .limit(1);
  return result.length > 0;
}

// ─── Admin Card Curation ─────────────────────────────────────────
export async function adminToggleCardPin(cardId: number, isPinned: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(cards).set({ isPinned }).where(eq(cards.id, cardId));
}

export async function adminToggleCardFeatured(cardId: number, isFeatured: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(cards).set({ isFeatured }).where(eq(cards.id, cardId));
}

export async function adminToggleCardPublic(cardId: number, isPublic: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(cards).set({ isPublic }).where(eq(cards.id, cardId));
}

export async function getAllCardsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cards).orderBy(desc(cards.createdAt));
}

// ─── Collections ─────────────────────────────────────────────────────
export async function getUserCollections(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(collections).where(eq(collections.userId, userId));
}

export async function createCollection(userId: number, name: string, description?: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(collections).values({ userId, name, description });
  return { id: result[0].insertId, userId, name, description };
}

// ─── Journal Entries ─────────────────────────────────────────────────
export async function getUserJournalEntries(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.createdAt));
}

export async function createJournalEntry(entry: {
  userId: number;
  cardId?: number;
  symptoms: string;
  remedyUsed: string;
  result?: "improved" | "no_change" | "worsened";
  duration?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(journalEntries).values(entry);
  return result[0].insertId;
}

export async function updateJournalEntry(id: number, userId: number, data: {
  result?: "improved" | "no_change" | "worsened";
  notes?: string;
  duration?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(journalEntries).set(data).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
}

export async function deleteJournalEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(journalEntries).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
}

// ─── Community Posts ─────────────────────────────────────────────────
export async function getApprovedCommunityPosts(plantId?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(communityPosts.approved, true)];
  if (plantId) conditions.push(eq(communityPosts.plantId, plantId));
  return db.select({
    id: communityPosts.id,
    userId: communityPosts.userId,
    title: communityPosts.title,
    content: communityPosts.content,
    plantId: communityPosts.plantId,
    postType: communityPosts.postType,
    aiTags: communityPosts.aiTags,
    createdAt: communityPosts.createdAt,
  }).from(communityPosts).where(and(...conditions)).orderBy(desc(communityPosts.createdAt));
}

export async function createCommunityPost(data: {
  userId: number;
  title: string;
  content: string;
  plantId?: number;
  postType?: "experience" | "tradition" | "folklore" | "question";
  aiTags?: string[];
}) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(communityPosts).values({
    userId: data.userId,
    title: data.title,
    content: data.content,
    plantId: data.plantId,
    postType: data.postType || "experience",
    aiTags: data.aiTags || [],
    approved: false, // requires admin approval
  });
  return result[0].insertId;
}

export async function getAllCommunityPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt));
}

export async function approveCommunityPost(id: number, approved: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(communityPosts).set({ approved }).where(eq(communityPosts.id, id));
}

// ─── Products ────────────────────────────────────────────────────────
export async function getOwnProductsByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(ownProducts)
    .where(and(eq(ownProducts.plantId, plantId), eq(ownProducts.active, true)))
    .orderBy(asc(ownProducts.priorityRank));
}

export async function getAffiliatesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(affiliateLinks)
    .where(and(eq(affiliateLinks.plantId, plantId), eq(affiliateLinks.active, true)))
    .orderBy(asc(affiliateLinks.priorityRank));
}

export async function getSponsoredProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sponsoredProducts).where(eq(sponsoredProducts.active, true));
}

export async function getAllOwnProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ownProducts).orderBy(desc(ownProducts.createdAt));
}

export async function getAllAffiliateLinks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(affiliateLinks).orderBy(desc(affiliateLinks.createdAt));
}

// ─── Restock Notifications ──────────────────────────────────────────
export async function createRestockNotification(email: string, plantId: number, productId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(restockNotifications).values({ email, plantId, ownProductId: productId });
}

// ─── Analytics ───────────────────────────────────────────────────────
export async function logAnalyticsEvent(event: {
  userId?: number;
  sessionId?: string;
  eventName: string;
  entityType?: string;
  entityId?: number;
  metadata?: any;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(analyticsEvents).values(event);
}

export async function getAnalyticsSummary() {
  const db = await getDb();
  if (!db) return { totalEvents: 0, topEvents: [] };
  const total = await db.select({ count: sql<number>`count(*)` }).from(analyticsEvents);
  const topEvents = await db
    .select({
      eventName: analyticsEvents.eventName,
      count: sql<number>`count(*)`,
    })
    .from(analyticsEvents)
    .groupBy(analyticsEvents.eventName)
    .orderBy(desc(sql`count(*)`))
    .limit(10);
  return { totalEvents: total[0]?.count || 0, topEvents };
}

// ─── Reports ─────────────────────────────────────────────────────────
export async function getReports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports).orderBy(desc(reports.createdAt));
}

export async function createReport(reporterUserId: number, entityType: string, entityId: number, reason: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(reports).values({ reporterUserId, entityType, entityId, reason });
}

// ─── Admin ───────────────────────────────────────────────────────────
export async function updatePlant(id: number, data: Partial<typeof plants.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(plants).set(data).where(eq(plants.id, id));
}

export async function createPlant(data: typeof plants.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(plants).values(data);
  return result[0].insertId;
}

export async function updateOwnProduct(id: number, data: Partial<typeof ownProducts.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(ownProducts).set(data).where(eq(ownProducts.id, id));
}

export async function createOwnProduct(data: typeof ownProducts.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(ownProducts).values(data);
  return result[0].insertId;
}

// ─── Plant of the Day ────────────────────────────────────────────────
export async function getPlantOfTheDay() {
  const db = await getDb();
  if (!db) return null;
  const allPlants = await db
    .select()
    .from(plants)
    .where(eq(plants.approved, true));
  if (allPlants.length === 0) return null;
  // Deterministic daily rotation: use day-of-year as index
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % allPlants.length;
  return allPlants[index];
}

// ─── Folklore Submissions ────────────────────────────────────────────

export async function createFolkloreSubmission(data: {
  userId: number;
  plantId?: number;
  plantName?: string;
  titleEn: string;
  titleFr?: string;
  storyEn: string;
  storyFr?: string;
  region?: string;
  culturalTradition?: string;
  imageUrl?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(folkloreSubmissions).values({
    ...data,
    status: "pending",
  });
  return result[0].insertId;
}

export async function getUserFolkloreSubmissions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(folkloreSubmissions)
    .where(eq(folkloreSubmissions.userId, userId))
    .orderBy(desc(folkloreSubmissions.createdAt));
}

export async function getAllFolkloreSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(folkloreSubmissions).orderBy(desc(folkloreSubmissions.createdAt));
}

export async function updateFolkloreSubmissionStatus(
  id: number,
  status: "pending" | "approved" | "rejected",
  adminNotes?: string
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(folkloreSubmissions)
    .set({ status, adminNotes: adminNotes || null })
    .where(eq(folkloreSubmissions.id, id));
}

// ─── Stock Management ────────────────────────────────────────────────
export async function updateProductStock(
  productId: number,
  stockQuantity: number,
  stockStatus: "in_stock" | "out_of_stock" | "low_stock"
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(ownProducts)
    .set({ stockQuantity, stockStatus })
    .where(eq(ownProducts.id, productId));
}

// ─── Gardens (My Garden) ────────────────────────────────────────────
export async function getUserGardens(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gardens).where(eq(gardens.userId, userId)).orderBy(desc(gardens.createdAt));
}

export async function getGardenById(gardenId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(gardens).where(eq(gardens.id, gardenId)).limit(1);
  return result[0];
}

export async function createGarden(data: { userId: number; name: string; description?: string; coverImageUrl?: string }) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(gardens).values(data);
  return result[0]?.insertId;
}

export async function updateGarden(gardenId: number, data: { name?: string; description?: string; coverImageUrl?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.update(gardens).set(data).where(eq(gardens.id, gardenId));
}

export async function deleteGarden(gardenId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(gardenPlants).where(eq(gardenPlants.gardenId, gardenId));
  await db.delete(gardens).where(eq(gardens.id, gardenId));
}

export async function getGardenPlants(gardenId: number) {
  const db = await getDb();
  if (!db) return [];
  const gp = await db.select().from(gardenPlants).where(eq(gardenPlants.gardenId, gardenId)).orderBy(desc(gardenPlants.addedAt));
  if (gp.length === 0) return [];
  const plantIds = gp.map((g) => g.plantId);
  const plantList = await db.select().from(plants).where(inArray(plants.id, plantIds));
  return gp.map((g) => ({
    ...g,
    plant: plantList.find((p) => p.id === g.plantId),
  }));
}

export async function addPlantToGarden(gardenId: number, plantId: number, notes?: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(gardenPlants).values({ gardenId, plantId, notes });
  return result[0]?.insertId;
}

export async function removePlantFromGarden(gardenId: number, plantId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(gardenPlants).where(and(eq(gardenPlants.gardenId, gardenId), eq(gardenPlants.plantId, plantId)));
}

export async function isPlantInGarden(gardenId: number, plantId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(gardenPlants).where(and(eq(gardenPlants.gardenId, gardenId), eq(gardenPlants.plantId, plantId))).limit(1);
  return result.length > 0;
}

// ─── Ratings ────────────────────────────────────────────────────────
export async function rateCard(userId: number, cardId: number, score: number) {
  const db = await getDb();
  if (!db) return;
  // Upsert: update if exists, insert if not
  const existing = await db.select().from(ratings).where(and(eq(ratings.userId, userId), eq(ratings.cardId, cardId))).limit(1);
  if (existing.length > 0) {
    await db.update(ratings).set({ score }).where(eq(ratings.id, existing[0].id));
  } else {
    await db.insert(ratings).values({ userId, cardId, score });
  }
}

export async function getCardAverageRating(cardId: number) {
  const db = await getDb();
  if (!db) return { average: 0, count: 0 };
  const result = await db
    .select({ avg: sql<number>`AVG(score)`, count: sql<number>`COUNT(*)` })
    .from(ratings)
    .where(eq(ratings.cardId, cardId));
  return { average: Number(result[0]?.avg || 0), count: Number(result[0]?.count || 0) };
}

export async function getUserRating(userId: number, cardId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(ratings).where(and(eq(ratings.userId, userId), eq(ratings.cardId, cardId))).limit(1);
  return result[0] || null;
}

export async function getCardRatings(cardId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ratings).where(eq(ratings.cardId, cardId));
}

// ─── Comments ───────────────────────────────────────────────────────
export async function addComment(userId: number, cardId: number, content: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(comments).values({ userId, cardId, content });
  return result[0]?.insertId;
}

export async function getCardComments(cardId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: comments.id,
      userId: comments.userId,
      cardId: comments.cardId,
      content: comments.content,
      approved: comments.approved,
      createdAt: comments.createdAt,
      userName: users.name,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(and(eq(comments.cardId, cardId), eq(comments.approved, true)))
    .orderBy(desc(comments.createdAt));
}

export async function deleteComment(commentId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(comments).where(eq(comments.id, commentId));
}

export async function getAllComments() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: comments.id,
      userId: comments.userId,
      cardId: comments.cardId,
      content: comments.content,
      approved: comments.approved,
      createdAt: comments.createdAt,
      userName: users.name,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .orderBy(desc(comments.createdAt));
}

export async function toggleCommentApproval(commentId: number, approved: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(comments).set({ approved }).where(eq(comments.id, commentId));
}

// ─── Enhanced Gallery Search ────────────────────────────────────────
export async function searchGalleryCards(params: {
  query?: string;
  cardType?: string;
  evidenceLevel?: string;
  culturalTradition?: string;
  sortBy?: "newest" | "highest_rated" | "most_commented";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [eq(cards.isPublic, true)];

  if (params.query) {
    const q = `%${params.query}%`;
    conditions.push(
      or(
        like(cards.titleEn, q),
        like(cards.titleFr, q),
        like(cards.contentEn, q),
        like(cards.contentFr, q)
      )
    );
  }

  if (params.cardType) {
    conditions.push(eq(cards.cardType, params.cardType as any));
  }

  if (params.evidenceLevel) {
    conditions.push(eq(cards.evidenceLevel, params.evidenceLevel as any));
  }

  const limit = params.limit || 20;
  const offset = params.offset || 0;

  let query = db
    .select({
      id: cards.id,
      userId: cards.userId,
      plantId: cards.plantId,
      cardType: cards.cardType,
      titleEn: cards.titleEn,
      titleFr: cards.titleFr,
      contentEn: cards.contentEn,
      contentFr: cards.contentFr,
      evidenceLevel: cards.evidenceLevel,
      folkloreLabel: cards.folkloreLabel,
      isPinned: cards.isPinned,
      isFeatured: cards.isFeatured,
      confidenceScore: cards.confidenceScore,
      cautionLevel: cards.cautionLevel,
      createdAt: cards.createdAt,
      avgRating: sql<number>`COALESCE((SELECT AVG(score) FROM ratings WHERE ratings.cardId = cards.id), 0)`,
      commentCount: sql<number>`COALESCE((SELECT COUNT(*) FROM comments WHERE comments.cardId = cards.id AND comments.approved = true), 0)`,
      ratingCount: sql<number>`COALESCE((SELECT COUNT(*) FROM ratings WHERE ratings.cardId = cards.id), 0)`,
    })
    .from(cards)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset);

  if (params.sortBy === "highest_rated") {
    return query.orderBy(sql`COALESCE((SELECT AVG(score) FROM ratings WHERE ratings.cardId = cards.id), 0) DESC`, desc(cards.createdAt));
  } else if (params.sortBy === "most_commented") {
    return query.orderBy(sql`COALESCE((SELECT COUNT(*) FROM comments WHERE comments.cardId = cards.id AND comments.approved = true), 0) DESC`, desc(cards.createdAt));
  } else {
    return query.orderBy(desc(cards.createdAt));
  }
}

// ─── Update Plant Image ─────────────────────────────────────────────
export async function updatePlantImage(plantId: number, imageUrl: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(plants).set({ imageUrl }).where(eq(plants.id, plantId));
}
