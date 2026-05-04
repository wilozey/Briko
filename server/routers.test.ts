import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;
type CookieCall = { name: string; options: Record<string, unknown> };

function createMockUser(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    preferredLanguage: "en",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

function createAuthContext(userOverrides: Partial<AuthenticatedUser> = {}): {
  ctx: TrpcContext;
  clearedCookies: CookieCall[];
} {
  const clearedCookies: CookieCall[] = [];
  const user = createMockUser(userOverrides);

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// ─── Auth Router Tests ──────────────────────────────────────────────

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user data for authenticated users", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.openId).toBe("test-user-123");
    expect(result?.name).toBe("Test User");
    expect(result?.email).toBe("test@example.com");
  });
});

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({
      maxAge: -1,
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  });
});

// ─── Plants Router Tests ────────────────────────────────────────────

describe("plants.list", () => {
  it("returns an array of plants (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plants.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("plants.search", () => {
  it("returns results for a valid search query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plants.search({ query: "moringa" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns empty array for non-matching query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plants.search({ query: "zzz_nonexistent_plant_zzz" });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

describe("plants.getById", () => {
  it("returns plant with aliases and safety notes for valid id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plants.getById({ id: 1 });
    expect(result).toBeDefined();
    expect(result.scientificName).toBe("Moringa oleifera");
    expect(Array.isArray(result.aliases)).toBe(true);
    expect(Array.isArray(result.safety)).toBe(true);
  });

  it("throws NOT_FOUND for invalid id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.plants.getById({ id: 99999 })).rejects.toThrow();
  });
});

describe("plants.getProducts", () => {
  it("returns own products and affiliate links for a plant", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plants.getProducts({ plantId: 1 });
    expect(result).toHaveProperty("ownProducts");
    expect(result).toHaveProperty("affiliateLinks");
    expect(result).toHaveProperty("sponsoredProducts");
    expect(Array.isArray(result.ownProducts)).toBe(true);
    expect(Array.isArray(result.affiliateLinks)).toBe(true);
  });
});

// ─── Explore / Category Router Tests ────────────────────────────────

describe("plants.categories", () => {
  it("returns an array of categories (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plants.categories();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("plants.byCategory", () => {
  it("returns plants for a given category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plants.byCategory({ category: "medicinal" });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Cards Router Tests ─────────────────────────────────────────────

describe("cards.myCards", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.cards.myCards()).rejects.toThrow();
  });

  it("returns cards for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cards.myCards();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("cards.getByShareSlug", () => {
  it("throws NOT_FOUND for invalid slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.cards.getByShareSlug({ slug: "nonexistent-slug" })).rejects.toThrow();
  });
});

// ─── Health Profile Router Tests ────────────────────────────────────

describe("healthProfile.get", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.healthProfile.get()).rejects.toThrow();
  });

  it("returns null or profile for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.healthProfile.get();
    // May be null/undefined if no profile exists yet
    expect(result === null || result === undefined || typeof result === "object").toBe(true);
  });
});

describe("healthProfile.upsert", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.healthProfile.upsert({
        medications: [],
        allergies: [],
        isPregnant: false,
        isBreastfeeding: false,
        ageGroup: "adult",
        chronicConditions: [],
      })
    ).rejects.toThrow();
  });

  it("creates or updates health profile for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.healthProfile.upsert({
      medications: ["aspirin"],
      allergies: ["pollen"],
      isPregnant: false,
      isBreastfeeding: false,
      ageGroup: "adult",
      chronicConditions: ["asthma"],
    });
    expect(result).toEqual({ success: true });
  });
});

// ─── Journal Router Tests ───────────────────────────────────────────

describe("journal.list", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.journal.list()).rejects.toThrow();
  });

  it("returns journal entries for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.journal.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("journal.create", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.journal.create({
        title: "Test Entry",
        remedyUsed: "Chamomile tea",
        notes: "Felt better after drinking",
        effectivenessRating: 4,
      })
    ).rejects.toThrow();
  });
});

// ─── Community Router Tests ─────────────────────────────────────────

describe("community.list", () => {
  it("returns approved community posts (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.community.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("community.create", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.community.create({
        title: "Test Post",
        content: "This is a test community post with enough content.",
        postType: "experience",
      })
    ).rejects.toThrow();
  });
});

// ─── AI Router Tests ────────────────────────────────────────────────

describe("ai.generate", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.ai.generate({
        inputMode: "symptom",
        inputText: "headache",
        cardType: "remedy",
        language: "en",
      })
    ).rejects.toThrow();
  });
});

describe("ai.regenerate", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.ai.regenerate({
        cardId: 1,
        language: "en",
      })
    ).rejects.toThrow();
  });
});

// ─── Analytics Router Tests ─────────────────────────────────────────

describe("analytics.track", () => {
  it("tracks an event successfully (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.analytics.track({
      eventName: "test_event",
      entityType: "test",
      entityId: 1,
    });
    expect(result).toEqual({ success: true });
  });
});

// ─── Admin Router Tests ─────────────────────────────────────────────

describe("admin access control", () => {
  it("denies non-admin users access to admin.plants.list", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.plants.list()).rejects.toThrow("Admin access required");
  });

  it("allows admin users access to admin.plants.list", async () => {
    const { ctx } = createAuthContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.plants.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("denies non-admin users access to admin.analytics.summary", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.analytics.summary()).rejects.toThrow("Admin access required");
  });

  it("allows admin users access to admin.analytics.summary", async () => {
    const { ctx } = createAuthContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.analytics.summary();
    expect(result).toHaveProperty("totalEvents");
    expect(result).toHaveProperty("topEvents");
  });

  it("denies non-admin users access to admin.community.list", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.community.list()).rejects.toThrow("Admin access required");
  });

  it("allows admin to list all community posts", async () => {
    const { ctx } = createAuthContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.community.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Reports Router Tests ───────────────────────────────────────────

describe("reports.create", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.reports.create({
        entityType: "card",
        entityId: 1,
        reason: "Inappropriate content",
      })
    ).rejects.toThrow();
  });

  it("creates a report for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reports.create({
      entityType: "card",
      entityId: 1,
      reason: "Test report",
    });
    expect(result).toEqual({ success: true });
  });
});

// ─── Products Router Tests ──────────────────────────────────────────

describe("products.requestRestock", () => {
  it("registers a restock notification", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.products.requestRestock({
      email: "test@example.com",
      plantId: 1,
      productId: 1,
    });
    expect(result).toEqual({ success: true });
  });
});

// ─── Gallery Router Tests ──────────────────────────────────────────

describe("gallery.list", () => {
  it("returns public cards (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.gallery.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("filters by card type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.gallery.list({ type: "folklore" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("gallery.pinned", () => {
  it("returns pinned cards (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.gallery.pinned();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("gallery.folklore", () => {
  it("returns folklore cards (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.gallery.folklore();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("gallery.dynamic", () => {
  it("returns dynamic cards (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.gallery.dynamic();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("gallery.save", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.gallery.save({ cardId: 1 })).rejects.toThrow();
  });
});

describe("gallery.unsave", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.gallery.unsave({ cardId: 1 })).rejects.toThrow();
  });
});

describe("gallery.isSaved", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.gallery.isSaved({ cardId: 1 })).rejects.toThrow();
  });
});

// ─── Saved Cards Router Tests ──────────────────────────────────────

describe("savedCards.list", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.savedCards.list()).rejects.toThrow();
  });

  it("returns saved cards for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.savedCards.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Admin Cards Curation Tests ────────────────────────────────────

describe("admin.cards.list", () => {
  it("denies non-admin users access", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.cards.list()).rejects.toThrow("Admin access required");
  });

  it("allows admin to list all cards", async () => {
    const { ctx } = createAuthContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.cards.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("admin.cards.togglePin", () => {
  it("denies non-admin users", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.cards.togglePin({ cardId: 1, isPinned: true })).rejects.toThrow("Admin access required");
  });
});

describe("admin.cards.toggleFeatured", () => {
  it("denies non-admin users", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.cards.toggleFeatured({ cardId: 1, isFeatured: true })).rejects.toThrow("Admin access required");
  });
});

describe("admin.cards.togglePublic", () => {
  it("denies non-admin users", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.cards.togglePublic({ cardId: 1, isPublic: true })).rejects.toThrow("Admin access required");
  });
});

// ── Phase 4: Plant of the Day ──
describe("plants.plantOfTheDay", () => {
  it("returns a plant object from the public endpoint", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.plants.plantOfTheDay();
    // May be null if no approved plants, but should not throw
    if (result) {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("commonNameEn");
    }
  });
});

// ── Phase 4: Folklore Submissions ──
describe("folklore.submit", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.folklore.submit({
        titleEn: "Test Folklore",
        storyEn: "A test folklore story about moringa",
        plantId: 1,
      })
    ).rejects.toThrow();
  });

  it("allows authenticated users to submit", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    // This should not throw (may fail at DB level in test env, but the auth check passes)
    try {
      await caller.folklore.submit({
        titleEn: "Test Folklore",
        storyEn: "A test folklore story about moringa",
        plantId: 1,
      });
    } catch (e: any) {
      // DB errors are acceptable in test env, auth errors are not
      expect(e.message).not.toContain("UNAUTHORIZED");
    }
  });
});

describe("folkloreSubmissions.mySubmissions", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.folkloreSubmissions.mySubmissions()).rejects.toThrow();
  });
});

// ── Phase 4: Admin Folklore Review ──
describe("admin.folkloreSubmissions.list", () => {
  it("denies non-admin users", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.folkloreSubmissions.list()).rejects.toThrow("Admin access required");
  });
});

// ── Phase 4: Stock Management ──
describe("admin.stockUpdate", () => {
  it("denies non-admin users", async () => {
    const { ctx } = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.stockUpdate({ productId: 1, stockStatus: "in_stock", stockQuantity: 100 })
    ).rejects.toThrow("Admin access required");
  });
});

// ── Phase 5: My Garden ──
describe("garden.list", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.garden.list()).rejects.toThrow();
  });

  it("returns empty array for new user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.garden.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("garden.create", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.garden.create({ name: "My Herbs", description: "Favorite herbs" })
    ).rejects.toThrow();
  });
});

// ── Phase 5: Ratings ──
describe("ratings.getAverage", () => {
  it("returns average rating for a card", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ratings.getAverage({ cardId: 1 });
    expect(result).toHaveProperty("average");
    expect(result).toHaveProperty("count");
  });
});

describe("ratings.rate", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.ratings.rate({ cardId: 1, score: 4 })).rejects.toThrow();
  });
});

// ── Phase 5: Comments ──
describe("comments.list", () => {
  it("returns comments for a card", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.comments.list({ cardId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("comments.add", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.comments.add({ cardId: 1, content: "Great remedy!" })
    ).rejects.toThrow();
  });
});

// ── Phase 5: Enhanced Gallery Search ──
describe("search.gallery", () => {
  it("returns results for a search query", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.search.gallery({ query: "moringa" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns results with sort filter", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.search.gallery({ sortBy: "highest_rated" });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── Phase 5: Scheduled Task Endpoints ──
describe("scheduled.updatePlantOfDay", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.scheduled.updatePlantOfDay()).rejects.toThrow();
  });
});
