import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import {
  getApprovedPlants,
  getAllPlants,
  getPlantById,
  searchPlants,
  getPlantsByCategory,
  getPlantCategories,
  getPlantAliases,
  getPlantSafetyNotes,
  getUserCards,
  createCard,
  deleteCard,
  updateCard,
  getCardByShareSlug,
  updateCardShareSlug,
  getCardById,
  getOwnProductsByPlant,
  getAffiliatesByPlant,
  getSponsoredProducts,
  getAllOwnProducts,
  getAllAffiliateLinks,
  createRestockNotification,
  logAnalyticsEvent,
  getAnalyticsSummary,
  getUserCollections,
  createCollection,
  getReports,
  createReport,
  updatePlant,
  createPlant,
  updateOwnProduct,
  createOwnProduct,
  updateUserLanguage,
  getHealthProfile,
  upsertHealthProfile,
  getUserJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getApprovedCommunityPosts,
  createCommunityPost,
  getAllCommunityPosts,
  approveCommunityPost,
  getPublicCards,
  getFeaturedFolkloreCards,
  getPinnedCards,
  getDynamicCards,
  getUserSavedCards,
  saveCardForUser,
  unsaveCardForUser,
  isCardSavedByUser,
  adminToggleCardPin,
  adminToggleCardFeatured,
  adminToggleCardPublic,
  getAllCardsAdmin,
  getPlantOfTheDay,
  createFolkloreSubmission,
  getUserFolkloreSubmissions,
  getAllFolkloreSubmissions,
  updateFolkloreSubmissionStatus,
  updateProductStock,
  getUserGardens,
  getGardenById,
  createGarden,
  updateGarden,
  deleteGarden,
  getGardenPlants,
  addPlantToGarden,
  removePlantFromGarden,
  isPlantInGarden,
  rateCard,
  getCardAverageRating,
  getUserRating,
  getCardComments,
  addComment,
  deleteComment,
  getAllComments,
  toggleCommentApproval,
  searchGalleryCards,
  updatePlantImage,
} from "./db";
import { invokeLLM } from "./_core/llm";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateLanguage: protectedProcedure
      .input(z.object({ language: z.enum(["en", "fr"]) }))
      .mutation(async ({ ctx, input }) => {
        await updateUserLanguage(ctx.user.id, input.language);
        return { success: true };
      }),
  }),

  // ─── Health Profile ─────────────────────────────────────────────
  healthProfile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getHealthProfile(ctx.user.id);
    }),
    upsert: protectedProcedure
      .input(
        z.object({
          medications: z.array(z.string()).optional(),
          allergies: z.array(z.string()).optional(),
          isPregnant: z.boolean().optional(),
          isBreastfeeding: z.boolean().optional(),
          ageGroup: z.enum(["child", "teen", "adult", "senior"]).optional(),
          chronicConditions: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await upsertHealthProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // ─── Plants ──────────────────────────────────────────────────────
  plants: router({
    list: publicProcedure.query(async () => {
      return getApprovedPlants();
    }),
    plantOfTheDay: publicProcedure.query(async () => {
      return getPlantOfTheDay();
    }),
    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        return searchPlants(input.query);
      }),
    categories: publicProcedure.query(async () => {
      return getPlantCategories();
    }),
    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return getPlantsByCategory(input.category);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const plant = await getPlantById(input.id);
        if (!plant) throw new TRPCError({ code: "NOT_FOUND" });
        const aliases = await getPlantAliases(input.id);
        const safety = await getPlantSafetyNotes(input.id);
        return { ...plant, aliases, safety };
      }),
    getProducts: publicProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input }) => {
        const own = await getOwnProductsByPlant(input.plantId);
        const affiliate = await getAffiliatesByPlant(input.plantId);
        const sponsored = await getSponsoredProducts();
        return { ownProducts: own, affiliateLinks: affiliate, sponsoredProducts: sponsored };
      }),
  }),

   // ─── Public Cards Gallery ────────────────────────────────────────
  gallery: router({
    list: publicProcedure
      .input(z.object({ cardType: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getPublicCards({ cardType: input?.cardType });
      }),
    folklore: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getFeaturedFolkloreCards(input?.limit);
      }),
    pinned: publicProcedure.query(async () => {
      return getPinnedCards();
    }),
    dynamic: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getDynamicCards(input?.limit);
      }),
    isSaved: protectedProcedure
      .input(z.object({ cardId: z.number() }))
      .query(async ({ ctx, input }) => {
        return isCardSavedByUser(ctx.user.id, input.cardId);
      }),
    save: protectedProcedure
      .input(z.object({ cardId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await saveCardForUser(ctx.user.id, input.cardId);
        await logAnalyticsEvent({
          userId: ctx.user.id,
          eventName: "card_saved",
          entityType: "card",
          entityId: input.cardId,
        });
        return { success: true };
      }),
    unsave: protectedProcedure
      .input(z.object({ cardId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await unsaveCardForUser(ctx.user.id, input.cardId);
        return { success: true };
      }),
  }),

  // ─── My Cards (saved bookmarks) ─────────────────────────────────
  savedCards: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserSavedCards(ctx.user.id);
    }),
  }),

  // ─── Cards (user-generated) ─────────────────────────────────────
  cards: router({
    myCards: protectedProcedure
      .input(z.object({ cardType: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return getUserCards(ctx.user.id, input?.cardType);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getCardById(input.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          plantId: z.number().nullable().optional(),
          cardType: z.enum(["plant", "remedy", "folklore", "nutrition"]),
          titleEn: z.string(),
          titleFr: z.string().optional(),
          contentEn: z.string().optional(),
          contentFr: z.string().optional(),
          traditionalUsesEn: z.string().optional(),
          traditionalUsesFr: z.string().optional(),
          preparationEn: z.string().optional(),
          preparationFr: z.string().optional(),
          safetyNotesEn: z.string().optional(),
          safetyNotesFr: z.string().optional(),
          evidenceLevel: z.enum(["research", "traditional", "mixed", "folklore"]).optional(),
          folkloreLabel: z.boolean().optional(),
          sourceType: z
            .enum(["symptom", "plant_name", "alias", "photo", "paste_text", "ingredients", "admin", "community"])
            .optional(),
          aiGenerated: z.boolean().optional(),
          collectionId: z.number().optional(),
          confidenceScore: z.number().optional(),
          cautionLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
          originalInput: z.string().optional(),
          ingredients: z.any().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const card = await createCard({
          ...input,
          userId: ctx.user.id,
          plantId: input.plantId ?? undefined,
        });
        await logAnalyticsEvent({
          userId: ctx.user.id,
          eventName: "card_created",
          entityType: "card",
          entityId: card?.id,
          metadata: { cardType: input.cardType },
        });
        return card;
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          titleEn: z.string().optional(),
          titleFr: z.string().optional(),
          contentEn: z.string().optional(),
          contentFr: z.string().optional(),
          preparationEn: z.string().optional(),
          preparationFr: z.string().optional(),
          safetyNotesEn: z.string().optional(),
          safetyNotesFr: z.string().optional(),
          collectionId: z.number().nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateCard(id, ctx.user.id, data as any);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteCard(input.id, ctx.user.id);
      }),
    getByShareSlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const card = await getCardByShareSlug(input.slug);
        if (!card) throw new TRPCError({ code: "NOT_FOUND" });
        return card;
      }),
    enableSharing: protectedProcedure
      .input(z.object({ cardId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const slug = nanoid(12);
        await updateCardShareSlug(input.cardId, ctx.user.id, slug);
        await logAnalyticsEvent({
          userId: ctx.user.id,
          eventName: "share_link_created",
          entityType: "card",
          entityId: input.cardId,
        });
        return { slug };
      }),
  }),

  // ─── Collections ─────────────────────────────────────────────────
  collections: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserCollections(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({ name: z.string(), description: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        return createCollection(ctx.user.id, input.name, input.description);
      }),
  }),

  // ─── Journal ────────────────────────────────────────────────────
  journal: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserJournalEntries(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          cardId: z.number().optional(),
          symptoms: z.string(),
          remedyUsed: z.string(),
          result: z.enum(["improved", "no_change", "worsened"]).optional(),
          duration: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const id = await createJournalEntry({ ...input, userId: ctx.user.id });
        await logAnalyticsEvent({
          userId: ctx.user.id,
          eventName: "journal_entry_created",
          entityType: "journal",
          entityId: id ?? undefined,
        });
        return { id };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          result: z.enum(["improved", "no_change", "worsened"]).optional(),
          notes: z.string().optional(),
          duration: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await updateJournalEntry(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteJournalEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ─── Community ──────────────────────────────────────────────────
  community: router({
    list: publicProcedure
      .input(z.object({ plantId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getApprovedCommunityPosts(input?.plantId);
      }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(3),
          content: z.string().min(10),
          plantId: z.number().optional(),
          postType: z.enum(["experience", "tradition", "folklore", "question"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const id = await createCommunityPost({
          ...input,
          userId: ctx.user.id,
        });
        await logAnalyticsEvent({
          userId: ctx.user.id,
          eventName: "community_post_created",
          entityType: "community_post",
          entityId: id ?? undefined,
        });
        return { id, message: "Your post has been submitted for review." };
      }),
  }),

  // ─── AI Generation ───────────────────────────────────────────────
  ai: router({
    generate: protectedProcedure
      .input(
        z.object({
          inputMode: z.enum(["symptom", "plant_name", "alias", "paste_text", "photo", "ingredients"]),
          inputText: z.string().min(1),
          cardType: z.enum(["remedy", "folklore", "nutrition"]),
          language: z.enum(["en", "fr"]).default("en"),
          conversationHistory: z
            .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Get user health profile for safety context
        const healthProfile = await getHealthProfile(ctx.user.id);

        const systemPrompt = buildAISystemPrompt(input.cardType, input.language, healthProfile);
        const userPrompt = buildAIUserPrompt(input.inputMode, input.inputText, input.cardType, input.language);

        // Build message history for multi-turn conversations
        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
          { role: "system", content: systemPrompt },
        ];

        // Add conversation history if present
        if (input.conversationHistory && input.conversationHistory.length > 0) {
          for (const msg of input.conversationHistory) {
            messages.push({ role: msg.role, content: msg.content });
          }
        }

        messages.push({ role: "user", content: userPrompt });

        const response = await invokeLLM({
          messages,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "card_generation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  needsClarification: { type: "boolean", description: "Whether the AI needs more info from the user" },
                  clarificationQuestion: { type: "string", description: "Question to ask the user if clarification needed" },
                  titleEn: { type: "string", description: "English title for the card" },
                  titleFr: { type: "string", description: "French title for the card" },
                  contentEn: { type: "string", description: "Main English content" },
                  contentFr: { type: "string", description: "Main French content" },
                  traditionalUsesEn: { type: "string", description: "Traditional uses in English" },
                  traditionalUsesFr: { type: "string", description: "Traditional uses in French" },
                  preparationEn: { type: "string", description: "Preparation instructions in English" },
                  preparationFr: { type: "string", description: "Preparation instructions in French" },
                  safetyNotesEn: { type: "string", description: "Safety notes in English" },
                  safetyNotesFr: { type: "string", description: "Safety notes in French" },
                  evidenceLevel: {
                    type: "string",
                    enum: ["research", "traditional", "mixed", "folklore"],
                    description: "Evidence level classification",
                  },
                  folkloreLabel: { type: "boolean", description: "Whether this is folklore content" },
                  confidenceScore: { type: "integer", description: "Confidence score 1-5" },
                  cautionLevel: {
                    type: "string",
                    enum: ["low", "medium", "high", "critical"],
                    description: "Caution level for the remedy",
                  },
                },
                required: [
                  "needsClarification", "clarificationQuestion",
                  "titleEn", "titleFr", "contentEn", "contentFr",
                  "traditionalUsesEn", "traditionalUsesFr",
                  "preparationEn", "preparationFr",
                  "safetyNotesEn", "safetyNotesFr",
                  "evidenceLevel", "folkloreLabel",
                  "confidenceScore", "cautionLevel",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const rawContent = response.choices?.[0]?.message?.content;
        if (!rawContent) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI generation failed" });
        const content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);

        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse AI response" });
        }

        // If AI needs clarification, return the question without creating a card
        if (parsed.needsClarification) {
          return {
            needsClarification: true,
            clarificationQuestion: parsed.clarificationQuestion,
            card: null,
          };
        }

        await logAnalyticsEvent({
          userId: ctx.user.id,
          eventName: "ai_card_generated",
          entityType: "ai_generation",
          metadata: {
            inputMode: input.inputMode,
            cardType: input.cardType,
            language: input.language,
          },
        });

        const card = await createCard({
          userId: ctx.user.id,
          cardType: input.cardType,
          titleEn: parsed.titleEn,
          titleFr: parsed.titleFr,
          contentEn: parsed.contentEn,
          contentFr: parsed.contentFr,
          traditionalUsesEn: parsed.traditionalUsesEn,
          traditionalUsesFr: parsed.traditionalUsesFr,
          preparationEn: parsed.preparationEn,
          preparationFr: parsed.preparationFr,
          safetyNotesEn: parsed.safetyNotesEn,
          safetyNotesFr: parsed.safetyNotesFr,
          evidenceLevel: parsed.evidenceLevel,
          folkloreLabel: parsed.folkloreLabel,
          sourceType: input.inputMode as any,
          aiGenerated: true,
          confidenceScore: parsed.confidenceScore,
          cautionLevel: parsed.cautionLevel,
          originalInput: input.inputText,
        });

        return { needsClarification: false, clarificationQuestion: null, card };
      }),

    regenerate: protectedProcedure
      .input(
        z.object({
          cardId: z.number(),
          additionalContext: z.string().optional(),
          language: z.enum(["en", "fr"]).default("en"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existingCard = await getCardById(input.cardId);
        if (!existingCard || existingCard.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const healthProfile = await getHealthProfile(ctx.user.id);
        const systemPrompt = buildAISystemPrompt(existingCard.cardType, input.language, healthProfile);

        const userPrompt = `Regenerate and improve this ${existingCard.cardType} card. Original title: "${existingCard.titleEn}". Original content: "${existingCard.contentEn}". ${input.additionalContext ? `Additional context: ${input.additionalContext}` : ""} Provide improved, more detailed content.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "card_regeneration",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  needsClarification: { type: "boolean" },
                  clarificationQuestion: { type: "string" },
                  titleEn: { type: "string" },
                  titleFr: { type: "string" },
                  contentEn: { type: "string" },
                  contentFr: { type: "string" },
                  traditionalUsesEn: { type: "string" },
                  traditionalUsesFr: { type: "string" },
                  preparationEn: { type: "string" },
                  preparationFr: { type: "string" },
                  safetyNotesEn: { type: "string" },
                  safetyNotesFr: { type: "string" },
                  evidenceLevel: { type: "string", enum: ["research", "traditional", "mixed", "folklore"] },
                  folkloreLabel: { type: "boolean" },
                  confidenceScore: { type: "integer" },
                  cautionLevel: { type: "string", enum: ["low", "medium", "high", "critical"] },
                },
                required: [
                  "needsClarification", "clarificationQuestion",
                  "titleEn", "titleFr", "contentEn", "contentFr",
                  "traditionalUsesEn", "traditionalUsesFr",
                  "preparationEn", "preparationFr",
                  "safetyNotesEn", "safetyNotesFr",
                  "evidenceLevel", "folkloreLabel",
                  "confidenceScore", "cautionLevel",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const rawContent = response.choices?.[0]?.message?.content;
        if (!rawContent) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI regeneration failed" });
        const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);

        let parsed;
        try {
          parsed = JSON.parse(contentStr);
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to parse AI response" });
        }

        const updated = await updateCard(input.cardId, ctx.user.id, {
          titleEn: parsed.titleEn,
          titleFr: parsed.titleFr,
          contentEn: parsed.contentEn,
          contentFr: parsed.contentFr,
          traditionalUsesEn: parsed.traditionalUsesEn,
          traditionalUsesFr: parsed.traditionalUsesFr,
          preparationEn: parsed.preparationEn,
          preparationFr: parsed.preparationFr,
          safetyNotesEn: parsed.safetyNotesEn,
          safetyNotesFr: parsed.safetyNotesFr,
          evidenceLevel: parsed.evidenceLevel,
          folkloreLabel: parsed.folkloreLabel,
          confidenceScore: parsed.confidenceScore,
          cautionLevel: parsed.cautionLevel,
        });

        return updated;
      }),
  }),

  // ─── Folklore Submissions ────────────────────────────────────────
  folkloreSubmissions: router({
    submit: protectedProcedure
      .input(
        z.object({
          plantId: z.number().optional(),
          plantName: z.string().optional(),
          titleEn: z.string().min(3),
          titleFr: z.string().optional(),
          storyEn: z.string().min(20),
          storyFr: z.string().optional(),
          region: z.string().optional(),
          culturalTradition: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const id = await createFolkloreSubmission({
          ...input,
          userId: ctx.user.id,
        });
        await logAnalyticsEvent({
          userId: ctx.user.id,
          eventName: "folklore_submitted",
          entityType: "folklore_submission",
          entityId: id ?? undefined,
        });
        return { id, message: "Your folklore story has been submitted for review. Thank you!" };
      }),
    mySubmissions: protectedProcedure.query(async ({ ctx }) => {
      return getUserFolkloreSubmissions(ctx.user.id);
    }),
  }),

  // ─── Products ────────────────────────────────────────────────────
  products: router({
    requestRestock: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          plantId: z.number(),
          productId: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        await createRestockNotification(input.email, input.plantId, input.productId);
        await logAnalyticsEvent({
          eventName: "restock_requested",
          entityType: "product",
          entityId: input.productId,
        });
        return { success: true };
      }),
  }),

  // ─── Analytics ───────────────────────────────────────────────────
  analytics: router({
    track: publicProcedure
      .input(
        z.object({
          eventName: z.string(),
          entityType: z.string().optional(),
          entityId: z.number().optional(),
          metadata: z.any().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await logAnalyticsEvent({
          userId: ctx.user?.id,
          eventName: input.eventName,
          entityType: input.entityType,
          entityId: input.entityId,
          metadata: input.metadata,
        });
        return { success: true };
      }),
  }),

  // ─── Reports ─────────────────────────────────────────────────────
  reports: router({
    create: protectedProcedure
      .input(
        z.object({
          entityType: z.string(),
          entityId: z.number(),
          reason: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createReport(ctx.user.id, input.entityType, input.entityId, input.reason);
        return { success: true };
      }),
  }),

  // ─── Admin ───────────────────────────────────────────────────────
  admin: router({
    plants: router({
      list: adminProcedure.query(async () => {
        return getAllPlants();
      }),
      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            data: z.object({
              commonNameEn: z.string().optional(),
              commonNameFr: z.string().optional(),
              scientificName: z.string().optional(),
              descriptionEn: z.string().optional(),
              descriptionFr: z.string().optional(),
              traditionalUsesEn: z.string().optional(),
              traditionalUsesFr: z.string().optional(),
              evidenceLevel: z.enum(["research", "traditional", "mixed", "folklore"]).optional(),
              approved: z.boolean().optional(),
              originRegion: z.string().optional(),
              culturalTradition: z.string().optional(),
              mysticalVirtuesEn: z.string().optional(),
              mysticalVirtuesFr: z.string().optional(),
              category: z.string().optional(),
            }),
          })
        )
        .mutation(async ({ input }) => {
          await updatePlant(input.id, input.data);
          return { success: true };
        }),
      create: adminProcedure
        .input(
          z.object({
            scientificName: z.string(),
            commonNameEn: z.string(),
            commonNameFr: z.string().optional(),
            descriptionEn: z.string().optional(),
            descriptionFr: z.string().optional(),
            traditionalUsesEn: z.string().optional(),
            traditionalUsesFr: z.string().optional(),
            evidenceLevel: z.enum(["research", "traditional", "mixed", "folklore"]).optional(),
            approved: z.boolean().optional(),
            originRegion: z.string().optional(),
            culturalTradition: z.string().optional(),
            category: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const id = await createPlant(input);
          return { id };
        }),
    }),
    products: router({
      listOwn: adminProcedure.query(async () => {
        return getAllOwnProducts();
      }),
      listAffiliates: adminProcedure.query(async () => {
        return getAllAffiliateLinks();
      }),
      updateOwn: adminProcedure
        .input(
          z.object({
            id: z.number(),
            data: z.object({
              name: z.string().optional(),
              subtitle: z.string().optional(),
              priceGbp: z.string().optional(),
              stockStatus: z.enum(["in_stock", "out_of_stock", "low_stock"]).optional(),
              active: z.boolean().optional(),
            }),
          })
        )
        .mutation(async ({ input }) => {
          await updateOwnProduct(input.id, input.data);
          return { success: true };
        }),
      createOwn: adminProcedure
        .input(
          z.object({
            plantId: z.number().optional(),
            name: z.string(),
            subtitle: z.string().optional(),
            originCountry: z.string().optional(),
            originLocalName: z.string().optional(),
            shippedFrom: z.string().optional(),
            priceGbp: z.string().optional(),
            weightLabel: z.string().optional(),
            stockStatus: z.enum(["in_stock", "out_of_stock", "low_stock"]).optional(),
            buyUrl: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const id = await createOwnProduct(input);
          return { id };
        }),
    }),
    analytics: router({
      summary: adminProcedure.query(async () => {
        return getAnalyticsSummary();
      }),
    }),
    reports: router({
      list: adminProcedure.query(async () => {
        return getReports();
      }),
    }),
    community: router({
      list: adminProcedure.query(async () => {
        return getAllCommunityPosts();
      }),
      approve: adminProcedure
        .input(z.object({ id: z.number(), approved: z.boolean() }))
        .mutation(async ({ input }) => {
          await approveCommunityPost(input.id, input.approved);
          return { success: true };
        }),
    }),
    folkloreSubmissions: router({
      list: adminProcedure.query(async () => {
        return getAllFolkloreSubmissions();
      }),
      review: adminProcedure
        .input(
          z.object({
            id: z.number(),
            status: z.enum(["approved", "rejected"]),
            adminNotes: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await updateFolkloreSubmissionStatus(input.id, input.status, input.adminNotes);
          return { success: true };
        }),
    }),
    stockUpdate: adminProcedure
      .input(
        z.object({
          productId: z.number(),
          stockQuantity: z.number().min(0),
          stockStatus: z.enum(["in_stock", "out_of_stock", "low_stock"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateProductStock(input.productId, input.stockQuantity, input.stockStatus);
        return { success: true };
      }),
    cards: router({
      list: adminProcedure.query(async () => {
        return getAllCardsAdmin();
      }),
      togglePin: adminProcedure
        .input(z.object({ cardId: z.number(), isPinned: z.boolean() }))
        .mutation(async ({ input }) => {
          await adminToggleCardPin(input.cardId, input.isPinned);
          return { success: true };
        }),
      toggleFeatured: adminProcedure
        .input(z.object({ cardId: z.number(), isFeatured: z.boolean() }))
        .mutation(async ({ input }) => {
          await adminToggleCardFeatured(input.cardId, input.isFeatured);
          return { success: true };
        }),
      togglePublic: adminProcedure
        .input(z.object({ cardId: z.number(), isPublic: z.boolean() }))
        .mutation(async ({ input }) => {
          await adminToggleCardPublic(input.cardId, input.isPublic);
          return { success: true };
        }),
    }),
  }),

  // ─── My Garden ─────────────────────────────────────────────────────
  garden: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserGardens(ctx.user.id);
    }),
    get: protectedProcedure
      .input(z.object({ gardenId: z.number() }))
      .query(async ({ ctx, input }) => {
        const garden = await getGardenById(input.gardenId);
        if (!garden || garden.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        const plants = await getGardenPlants(input.gardenId);
        return { ...garden, plants };
      }),
    create: protectedProcedure
      .input(z.object({ name: z.string().min(1), description: z.string().optional(), coverImageUrl: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const id = await createGarden({ userId: ctx.user.id, ...input });
        return { id };
      }),
    update: protectedProcedure
      .input(z.object({ gardenId: z.number(), name: z.string().optional(), description: z.string().optional(), coverImageUrl: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const garden = await getGardenById(input.gardenId);
        if (!garden || garden.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND" });
        await updateGarden(input.gardenId, { name: input.name, description: input.description, coverImageUrl: input.coverImageUrl });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ gardenId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const garden = await getGardenById(input.gardenId);
        if (!garden || garden.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND" });
        await deleteGarden(input.gardenId);
        return { success: true };
      }),
    addPlant: protectedProcedure
      .input(z.object({ gardenId: z.number(), plantId: z.number(), notes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const garden = await getGardenById(input.gardenId);
        if (!garden || garden.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND" });
        const exists = await isPlantInGarden(input.gardenId, input.plantId);
        if (exists) throw new TRPCError({ code: "CONFLICT", message: "Plant already in garden" });
        await addPlantToGarden(input.gardenId, input.plantId, input.notes);
        return { success: true };
      }),
    removePlant: protectedProcedure
      .input(z.object({ gardenId: z.number(), plantId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const garden = await getGardenById(input.gardenId);
        if (!garden || garden.userId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND" });
        await removePlantFromGarden(input.gardenId, input.plantId);
        return { success: true };
      }),
  }),

  // ─── Ratings & Comments ───────────────────────────────────────────
  ratings: router({
    rate: protectedProcedure
      .input(z.object({ cardId: z.number(), score: z.number().min(1).max(5) }))
      .mutation(async ({ ctx, input }) => {
        await rateCard(ctx.user.id, input.cardId, input.score);
        return { success: true };
      }),
    getAverage: publicProcedure
      .input(z.object({ cardId: z.number() }))
      .query(async ({ input }) => {
        return getCardAverageRating(input.cardId);
      }),
    getUserRating: protectedProcedure
      .input(z.object({ cardId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getUserRating(ctx.user.id, input.cardId);
      }),
  }),

  comments: router({
    list: publicProcedure
      .input(z.object({ cardId: z.number() }))
      .query(async ({ input }) => {
        return getCardComments(input.cardId);
      }),
    add: protectedProcedure
      .input(z.object({ cardId: z.number(), content: z.string().min(1).max(1000) }))
      .mutation(async ({ ctx, input }) => {
        const id = await addComment(ctx.user.id, input.cardId, input.content);
        return { id };
      }),
    delete: protectedProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteComment(input.commentId);
        return { success: true };
      }),
    adminList: adminProcedure.query(async () => {
      return getAllComments();
    }),
    adminToggle: adminProcedure
      .input(z.object({ commentId: z.number(), approved: z.boolean() }))
      .mutation(async ({ input }) => {
        await toggleCommentApproval(input.commentId, input.approved);
        return { success: true };
      }),
  }),

  // ─── Enhanced Gallery Search ──────────────────────────────────────
  search: router({
    gallery: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        cardType: z.string().optional(),
        evidenceLevel: z.string().optional(),
        culturalTradition: z.string().optional(),
        sortBy: z.enum(["newest", "highest_rated", "most_commented"]).optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return searchGalleryCards(input);
      }),
  }),

  // ─── Scheduled Task API (for automated content updates) ───────────────
  scheduled: router({
    updatePlantOfDay: protectedProcedure.mutation(async () => {
      // This endpoint is called by scheduled tasks to trigger any daily updates
      // The Plant of the Day is already deterministic based on date, so this
      // just logs the event for analytics
      await logAnalyticsEvent({ eventName: "scheduled_plant_of_day", metadata: JSON.stringify({ date: new Date().toISOString().split("T")[0] }) });
      return { success: true, date: new Date().toISOString().split("T")[0] };
    }),
    refreshGallery: protectedProcedure.mutation(async () => {
      // Endpoint for scheduled tasks to trigger gallery content refresh
      await logAnalyticsEvent({ eventName: "scheduled_gallery_refresh", metadata: JSON.stringify({ timestamp: Date.now() }) });
      return { success: true, timestamp: Date.now() };
    }),
  }),
});
// ─── AI Prompt Builders ─────────────────────────────────────────────
function buildAISystemPrompt(cardType: string, language: string, healthProfile?: any): string {
  const lang = language === "fr" ? "French and English" : "English and French";

  let safetyContext = "";
  if (healthProfile) {
    const warnings: string[] = [];
    if (healthProfile.isPregnant) warnings.push("The user is PREGNANT — flag any contraindicated herbs");
    if (healthProfile.isBreastfeeding) warnings.push("The user is BREASTFEEDING — flag any contraindicated herbs");
    if (healthProfile.ageGroup === "child") warnings.push("The user is a CHILD — adjust dosages and flag unsafe herbs");
    if (healthProfile.ageGroup === "senior") warnings.push("The user is a SENIOR — consider drug interactions and reduced dosages");
    const meds = healthProfile.medications as string[] | null;
    if (meds && meds.length > 0) warnings.push(`The user takes these medications: ${meds.join(", ")} — check for interactions`);
    const allergies = healthProfile.allergies as string[] | null;
    if (allergies && allergies.length > 0) warnings.push(`The user has these allergies: ${allergies.join(", ")} — avoid related plants`);
    const conditions = healthProfile.chronicConditions as string[] | null;
    if (conditions && conditions.length > 0) warnings.push(`The user has these conditions: ${conditions.join(", ")} — consider contraindications`);
    if (warnings.length > 0) {
      safetyContext = `\n\nUSER HEALTH CONTEXT (CRITICAL — personalize safety warnings):\n${warnings.map(w => `- ${w}`).join("\n")}`;
    }
  }

  return `You are Plantinel's Apothecary, an expert in botanical medicine, traditional herbal remedies, and plant-based wellness. You provide well-structured, evidence-aware botanical guidance.

IMPORTANT RULES:
- Always include safety warnings and disclaimers
- Never make medical diagnosis claims
- Clearly distinguish between research-backed, traditional, and folklore content
- Always recommend consulting a healthcare professional for serious symptoms
- Provide content in both ${lang}
- If the user describes serious symptoms (chest pain, difficulty breathing, severe bleeding, etc.), prioritize recommending emergency medical care
- Be culturally respectful when discussing traditional practices
- For folklore content, clearly label it as unverified cultural knowledge
- If the user's query is vague or could benefit from more context, set needsClarification to true and ask a specific follow-up question
- Set confidenceScore (1-5) based on evidence quality: 5=strong clinical evidence, 4=good evidence, 3=moderate/mixed, 2=traditional only, 1=folklore/anecdotal
- Set cautionLevel based on risk: low=generally safe, medium=some precautions, high=significant risks, critical=dangerous without supervision
${safetyContext}

You are generating a ${cardType} card. Respond with structured JSON matching the required schema.`;
}

function buildAIUserPrompt(
  inputMode: string,
  inputText: string,
  cardType: string,
  language: string
): string {
  const modeLabels: Record<string, string> = {
    symptom: "The user is describing a symptom or health concern",
    plant_name: "The user is asking about a specific plant",
    alias: "The user is using a local or traditional plant name",
    paste_text: "The user has pasted text about a plant or remedy",
    photo: "The user has uploaded a photo (describe based on context)",
    ingredients: "The user is providing ingredients they have available and wants a remedy built from them",
  };

  const cardLabels: Record<string, string> = {
    remedy: "Generate a remedy card with preparation steps, traditional uses, safety notes, and evidence level",
    folklore: "Generate a folklore card with cultural context, traditional beliefs, mystical virtues, and clear labeling as unverified folklore",
    nutrition: "Generate a nutrition card with nutritional information, wellness benefits, and evidence-based content where possible",
  };

  return `${modeLabels[inputMode] || "The user is asking about"}: "${inputText}"

${cardLabels[cardType] || "Generate a botanical knowledge card"}.

Provide comprehensive, well-structured content in both English and French. Include appropriate safety notes and evidence classification.`;
}

export type AppRouter = typeof appRouter;
