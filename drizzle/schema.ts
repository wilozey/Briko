import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  preferredLanguage: mysqlEnum("preferredLanguage", ["en", "fr"]).default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── User Health Profiles ────────────────────────────────────────────
export const userHealthProfiles = mysqlTable("user_health_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  medications: json("medications"), // string[]
  allergies: json("allergies"), // string[]
  isPregnant: boolean("isPregnant").default(false),
  isBreastfeeding: boolean("isBreastfeeding").default(false),
  ageGroup: mysqlEnum("ageGroup", ["child", "teen", "adult", "senior"]).default("adult"),
  chronicConditions: json("chronicConditions"), // string[]
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserHealthProfile = typeof userHealthProfiles.$inferSelect;

// ─── Plants ──────────────────────────────────────────────────────────
export const plants = mysqlTable("plants", {
  id: int("id").autoincrement().primaryKey(),
  scientificName: varchar("scientificName", { length: 255 }).notNull(),
  commonNameEn: varchar("commonNameEn", { length: 255 }).notNull(),
  commonNameFr: varchar("commonNameFr", { length: 255 }),
  descriptionEn: text("descriptionEn"),
  descriptionFr: text("descriptionFr"),
  traditionalUsesEn: text("traditionalUsesEn"),
  traditionalUsesFr: text("traditionalUsesFr"),
  preparationTypes: json("preparationTypes"),
  evidenceLevel: mysqlEnum("evidenceLevel", [
    "research",
    "traditional",
    "mixed",
    "folklore",
  ]).default("traditional"),
  imageUrl: text("imageUrl"),
  originRegion: varchar("originRegion", { length: 255 }),
  culturalTradition: varchar("culturalTradition", { length: 255 }),
  mysticalVirtuesEn: text("mysticalVirtuesEn"),
  mysticalVirtuesFr: text("mysticalVirtuesFr"),
  activeCompounds: json("activeCompounds"), // string[]
  category: varchar("category", { length: 100 }),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Plant = typeof plants.$inferSelect;
export type InsertPlant = typeof plants.$inferInsert;

// ─── Plant Aliases ───────────────────────────────────────────────────
export const plantAliases = mysqlTable("plant_aliases", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plantId").notNull(),
  alias: varchar("alias", { length: 255 }).notNull(),
  language: varchar("language", { length: 10 }).default("en"),
  region: varchar("region", { length: 100 }),
  aliasType: mysqlEnum("aliasType", ["local", "common", "traditional", "scientific"]).default("local"),
});

export type PlantAlias = typeof plantAliases.$inferSelect;

// ─── Plant Images ────────────────────────────────────────────────────
export const plantImages = mysqlTable("plant_images", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plantId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  caption: varchar("caption", { length: 255 }),
  isPrimary: boolean("isPrimary").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Plant Safety ────────────────────────────────────────────────────
export const plantSafety = mysqlTable("plant_safety", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plantId").notNull(),
  warningEn: text("warningEn"),
  warningFr: text("warningFr"),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("low"),
  category: varchar("category", { length: 100 }),
});

// ─── Cards ───────────────────────────────────────────────────────────
export const cards = mysqlTable("cards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plantId: int("plantId"),
  cardType: mysqlEnum("cardType", ["plant", "remedy", "folklore", "nutrition"]).notNull(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  titleFr: varchar("titleFr", { length: 500 }),
  contentEn: text("contentEn"),
  contentFr: text("contentFr"),
  traditionalUsesEn: text("traditionalUsesEn"),
  traditionalUsesFr: text("traditionalUsesFr"),
  preparationEn: text("preparationEn"),
  preparationFr: text("preparationFr"),
  safetyNotesEn: text("safetyNotesEn"),
  safetyNotesFr: text("safetyNotesFr"),
  evidenceLevel: mysqlEnum("evidenceLevel_card", [
    "research",
    "traditional",
    "mixed",
    "folklore",
  ]).default("traditional"),
  folkloreLabel: boolean("folkloreLabel").default(false),
  sourceType: mysqlEnum("sourceType", [
    "symptom",
    "plant_name",
    "alias",
    "photo",
    "paste_text",
    "ingredients",
    "admin",
    "community",
  ]).default("plant_name"),
  aiGenerated: boolean("aiGenerated").default(false),
  shareSlug: varchar("shareSlug", { length: 100 }).unique(),
  publicShareEnabled: boolean("publicShareEnabled").default(false),
  savedImageUrl: text("savedImageUrl"),
  collectionId: int("collectionId"),
  confidenceScore: int("confidenceScore"),
  cautionLevel: mysqlEnum("cautionLevel", ["low", "medium", "high", "critical"]).default("low"),
  originalInput: text("originalInput"),
  ingredients: json("ingredients"), // { item, quantity, unit, notes }[]
  isPinned: boolean("isPinned").default(false).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isPublic: boolean("isPublic").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Card = typeof cards.$inferSelect;
export type InsertCard = typeof cards.$inferInsert;

// ─── Saved Cards (User bookmarks of public cards) ───────────────────
export const savedCards = mysqlTable("saved_cards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cardId: int("cardId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedCard = typeof savedCards.$inferSelect;

// ─── Collections ─────────────────────────────────────────────────────
export const collections = mysqlTable("collections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Collection = typeof collections.$inferSelect;

// ─── Journal Entries ─────────────────────────────────────────────────
export const journalEntries = mysqlTable("journal_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cardId: int("cardId"),
  symptoms: text("symptoms"),
  remedyUsed: text("remedyUsed"),
  result: mysqlEnum("result", ["improved", "no_change", "worsened"]),
  duration: varchar("duration", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;

// ─── Own Products ────────────────────────────────────────────────────
export const ownProducts = mysqlTable("own_products", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plantId"),
  name: varchar("name", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  originCountry: varchar("originCountry", { length: 100 }),
  originLocalName: varchar("originLocalName", { length: 255 }),
  shippedFrom: varchar("shippedFrom", { length: 100 }),
  priceGbp: decimal("priceGbp", { precision: 10, scale: 2 }),
  weightLabel: varchar("weightLabel", { length: 50 }),
  stockStatus: mysqlEnum("stockStatus", ["in_stock", "out_of_stock", "low_stock"]).default("in_stock"),
  stockQuantity: int("stockQuantity").default(0),
  priorityRank: int("priorityRank").default(0),
  imageUrl: text("imageUrl"),
  buyUrl: text("buyUrl"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OwnProduct = typeof ownProducts.$inferSelect;

// ─── Affiliate Links ─────────────────────────────────────────────────
export const affiliateLinks = mysqlTable("affiliate_links", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plantId"),
  supplierName: varchar("supplierName", { length: 255 }),
  productName: varchar("productName", { length: 255 }).notNull(),
  productFormat: varchar("productFormat", { length: 100 }),
  packSize: varchar("packSize", { length: 100 }),
  priceLabel: varchar("priceLabel", { length: 50 }),
  affiliateUrl: text("affiliateUrl").notNull(),
  active: boolean("active").default(true).notNull(),
  priorityRank: int("priorityRank").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AffiliateLink = typeof affiliateLinks.$inferSelect;

// ─── Sponsored Products ──────────────────────────────────────────────
export const sponsoredProducts = mysqlTable("sponsored_products", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plantId"),
  brandName: varchar("brandName", { length: 255 }),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  imageUrl: text("imageUrl"),
  targetUrl: text("targetUrl"),
  sponsorshipType: varchar("sponsorshipType", { length: 50 }),
  active: boolean("active").default(true).notNull(),
  startAt: timestamp("startAt"),
  endAt: timestamp("endAt"),
});

// ─── Restock Notifications ───────────────────────────────────────────
export const restockNotifications = mysqlTable("restock_notifications", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  plantId: int("plantId"),
  ownProductId: int("ownProductId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  notifiedAt: timestamp("notifiedAt"),
});

// ─── Card Shares ─────────────────────────────────────────────────────
export const cardShares = mysqlTable("card_shares", {
  id: int("id").autoincrement().primaryKey(),
  cardId: int("cardId").notNull(),
  sharedByUserId: int("sharedByUserId").notNull(),
  shareMethod: varchar("shareMethod", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Community Posts ─────────────────────────────────────────────────
export const communityPosts = mysqlTable("community_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }),
  content: text("content"),
  plantId: int("plantId"),
  postType: mysqlEnum("postType", ["experience", "tradition", "folklore", "question"]).default("experience"),
  aiTags: json("aiTags"), // string[]
  approved: boolean("approved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Reports ─────────────────────────────────────────────────────────
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterUserId: int("reporterUserId").notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId").notNull(),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "reviewed", "dismissed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Folklore Submissions ────────────────────────────────────────────
export const folkloreSubmissions = mysqlTable("folklore_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plantId: int("plantId"),
  plantName: varchar("plantName", { length: 255 }),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  titleFr: varchar("titleFr", { length: 500 }),
  storyEn: text("storyEn").notNull(),
  storyFr: text("storyFr"),
  region: varchar("region", { length: 255 }),
  culturalTradition: varchar("culturalTradition", { length: 255 }),
  imageUrl: text("imageUrl"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FolkloreSubmission = typeof folkloreSubmissions.$inferSelect;
export type InsertFolkloreSubmission = typeof folkloreSubmissions.$inferInsert;

// ─── Analytics Events ────────────────────────────────────────────────
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 100 }),
  eventName: varchar("eventName", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }),
  entityId: int("entityId"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Gardens (My Garden) ────────────────────────────────────────────
export const gardens = mysqlTable("gardens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  coverImageUrl: text("coverImageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Garden = typeof gardens.$inferSelect;
export type InsertGarden = typeof gardens.$inferInsert;

// ─── Garden Plants ──────────────────────────────────────────────────
export const gardenPlants = mysqlTable("garden_plants", {
  id: int("id").autoincrement().primaryKey(),
  gardenId: int("gardenId").notNull(),
  plantId: int("plantId").notNull(),
  notes: text("notes"),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type GardenPlant = typeof gardenPlants.$inferSelect;

// ─── Ratings ────────────────────────────────────────────────────────
export const ratings = mysqlTable("ratings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cardId: int("cardId").notNull(),
  score: int("score").notNull(), // 1-5
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Rating = typeof ratings.$inferSelect;

// ─── Comments ───────────────────────────────────────────────────────
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cardId: int("cardId").notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
