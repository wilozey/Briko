# Plantinel — Comprehensive Gap Analysis

**Prepared by:** Manus AI
**Date:** April 5, 2026
**Scope:** Comparison of the expanded MVP specification against the currently deployed Plantinel v1 build

---

## Executive Summary

The expanded MVP specification describes **Plantinel** (originally conceived as "Herbora") as an autonomous AI-powered botanical intelligence platform that combines herbal medicine, plant nutrition, cultural traditions, mystical folklore, community knowledge, and commerce into a single living knowledge ecosystem. The current build delivers a strong foundation covering authentication, a plant library, AI card generation, product sourcing, bilingual support, and an admin dashboard. However, the expanded specification introduces several major feature domains and philosophical shifts that are not yet present. This document catalogues every gap, assesses its priority, and recommends an implementation roadmap.

---

## 1. Feature Comparison Matrix

| Feature Domain | MVP Spec Requirement | Current Build Status | Gap Severity |
|---|---|---|---|
| **Symptom → Remedy AI Consultation** | Multi-turn conversation with follow-up questions, safety intake, emergency detection | Single-shot AI generation with symptom input mode | **High** |
| **Plant → Knowledge Explorer** | Rich profiles with compounds, origin, cultural traditions, preparation methods | Plant detail page with description, uses, safety, products | Medium |
| **Ingredient → Remedy Builder** | Users input ingredients they have; AI generates possible remedies | Not implemented | **High** |
| **Image → Plant Identification** | Photo upload with AI vision analysis, confidence levels, candidate matches | Photo input mode exists but sends text description, not actual image analysis | **High** |
| **Adaptive Knowledge Expansion** | Dynamic category creation based on user demand (fitness, cognitive, longevity) | Static plant categories only | Medium |
| **Evidence Virtue Score (5-level)** | 1-folklore, 2-community, 3-practitioner, 4-research, 5-clinical | 4-level system (research, traditional, mixed, folklore) | Medium |
| **Mystical & Cultural Virtues Section** | Dedicated section per plant with folklore claims labeled as unverified | Folklore label on cards exists; no dedicated mystical section on plant profiles | Medium |
| **Community Discussion System** | Users share experiences, AI auto-tags and moderates posts | Database table exists; no UI or backend endpoints for community posts | **High** |
| **Remedy Journal / Symptom Tracker** | Users track symptoms, remedies used, results; AI detects patterns | Not implemented | **High** |
| **User Health Profile** | Medications, pregnancy, allergies, age group, chronic conditions for safety checks | Not implemented | **High** |
| **Consent & Disclaimer Versioning** | Versioned legal consent capture before using AI features | Disclaimer banners shown but no consent capture or versioning | Medium |
| **Clarifying Question Flow** | AI asks follow-up questions when confidence is low before finalizing cards | Not implemented; one-shot generation only | **High** |
| **Dual Card Generation** | Single input can create both a Plant Card and a linked Remedy Card | Single card output per generation | Low |
| **Card Edit / Regenerate** | Users can edit AI-generated fields and regenerate cards | Not implemented | **High** |
| **Image Provenance System** | Licensed → community → AI-generated fallback; source type, license, attribution | Simple imageUrl field with no provenance metadata | Medium |
| **Source Citation Labels** | Every piece of information tagged with its source and verification status | Not implemented | Medium |
| **Confidence + Caution Strip** | Visual strip at top of every card showing confidence, caution, and evidence levels | Evidence badge exists; no confidence or caution indicators | Medium |
| **Cultural Medicine Traditions** | Ayurveda, TCM, Western herbalism, African, Amazonian tradition tags | Not implemented as structured data | Medium |
| **Plant Active Compounds** | Curcumin, gingerol, etc. with effects | Not stored in schema | Medium |
| **Herbal Knowledge Graph** | Symptom → body system → plant → compound → remedy → preparation → safety | Not implemented | Low (V2) |
| **Subscription / Monetization Tiers** | Free, Premium ($12), Practitioner ($49), API ($299) | Not implemented | Low (V2) |
| **Autonomous Content Generation** | System auto-generates plant profiles, images, categories | Not implemented | Low (V2) |
| **Legal Pages** | Terms of Service, Privacy Policy, Medical Disclaimer page | Disclaimer banners only; no dedicated legal pages | Medium |
| **Explore / Discovery Tab** | Browse by symptom, category, body system, tradition, evidence level | Not implemented | Medium |
| **Unknown Alias Flow** | "We call this something else in my village" — learn new aliases | Not implemented | Medium |
| **Editable Source Memory** | Keep original upload/text alongside generated structured result | Not stored | Low |

---

## 2. Detailed Gap Analysis by Domain

### 2.1 AI Consultation Engine

The current build provides a single-shot AI generation flow where users select an input mode (symptom, plant name, alias, paste text, or photo), type their query, and receive a fully generated card. The expanded MVP specification envisions a **multi-turn conversational AI** that asks follow-up questions about duration, severity, medications, allergies, pregnancy status, and age group before generating a remedy. This is the single most impactful gap because it directly affects both the quality of AI output and user safety.

**What needs to change:** The AI generation endpoint should support a "session" model where the first call may return clarifying questions instead of a final card. The frontend Capture page needs a conversation-like UI that displays questions and collects answers before the final card is generated. The system prompt should include safety intake logic that triggers emergency warnings for red-flag symptoms.

### 2.2 Ingredient → Remedy Builder

The specification describes a mode where users input ingredients they already have (e.g., ginger, lemon, honey) and the AI generates possible remedies such as teas, syrups, decoctions, and tonics. This is entirely absent from the current build and represents a distinct input pathway that differs from symptom-based consultation.

**What needs to change:** Add an "ingredients" input mode to the Capture page with a multi-ingredient entry UI. The AI prompt should be adapted to generate remedy cards based on known herbal pairings, cultural preparation traditions, and safety filters.

### 2.3 Image-Based Plant Identification

The current photo input mode accepts a text description rather than performing actual image analysis. The MVP specification calls for users to upload plant photos and receive AI-powered identification with candidate matches, confidence levels, and links to plant profiles.

**What needs to change:** The Capture page should accept actual image uploads. The server should use the built-in LLM's vision capabilities (image_url content type) to analyze the photo and return candidate plant identifications with confidence scores. A dedicated plant identification result UI should show multiple candidates with "Is this your plant?" confirmation.

### 2.4 User Health Profile & Safety Engine

The specification describes a comprehensive safety engine that checks user-specific factors including medications, pregnancy, breastfeeding, allergies, age group, and chronic conditions. The current build has no user health profile and relies solely on general safety warnings stored per plant.

**What needs to change:** Add a user health profile table and UI where users can optionally record their medications, allergies, pregnancy status, age group, and chronic conditions. The AI generation prompt should incorporate these factors when generating remedy cards, and the system should flag interactions (e.g., "St John's Wort + antidepressants → interaction warning").

### 2.5 Remedy Journal / Symptom Tracker

Users should be able to track symptoms, remedies used, results, and duration over time. The AI can then detect patterns (e.g., "Users who reported insomnia improved with valerian"). This feature transforms Plantinel from a one-time lookup tool into a personal health companion.

**What needs to change:** Add a journal_entries table and a Journal page where users can log entries. Each entry links to a remedy card and includes fields for symptoms, remedy used, result (improved/no change/worsened), and duration.

### 2.6 Community Discussion System

The database already has a community_posts table, but there is no UI or backend endpoint for creating, listing, or moderating community posts. The specification calls for users to share remedy outcomes, cultural traditions, mystical plant uses, and regional traditions, with AI-powered auto-tagging and moderation.

**What needs to change:** Build a Community page with post creation, listing, and filtering. Add tRPC endpoints for CRUD operations on community posts. Implement content labeling (Community Experience, Traditional Belief, Folklore) and integrate with the existing reports system for moderation.

### 2.7 Card Edit & Regenerate

The specification emphasizes that all AI outputs must be editable and that users should be able to regenerate cards. The current build allows saving and deleting cards but not editing or regenerating them.

**What needs to change:** Add an edit mode to the card detail view where users can modify any field. Add a "Regenerate" button that re-runs the AI with the original input (or modified input) to produce an updated card.

### 2.8 Explore / Discovery Tab

The specification calls for an Explore tab that allows browsing by symptom, plant category, body system, evidence level, folklore uses, fitness/nutrition uses, and cultural tradition. This discovery layer is essential for users who want to browse rather than search.

**What needs to change:** Build an Explore page with categorized entry points. This can leverage the existing plant library data but present it through thematic lenses (e.g., "Digestive Health," "Immune Support," "Fitness & Performance," "Mystical Traditions").

---

## 3. Schema Gaps

The following database changes are needed to support the missing features:

| New Table / Column | Purpose |
|---|---|
| `user_health_profiles` table | Store medications, allergies, pregnancy, age group, chronic conditions |
| `journal_entries` table | Symptom tracking and remedy journaling |
| `ai_sessions` table | Multi-turn AI conversation sessions with follow-up questions |
| `plant_compounds` table | Active compounds per plant (curcumin, gingerol, etc.) |
| `plants.originRegion` column | Geographical origin of the plant |
| `plants.culturalTradition` column | Ayurveda, TCM, Western, African, Amazonian |
| `plants.mysticalVirtuesEn/Fr` columns | Dedicated mystical/folklore text per plant |
| `cards.confidenceScore` column | AI confidence level (0-100) |
| `cards.cautionLevel` column | Caution severity for the card content |
| `cards.originalInput` column | Preserve the original user input alongside structured output |
| `cards.ingredients` column (JSON) | Structured ingredient list for remedy cards |
| `community_posts.postType` column | Community Experience, Traditional Belief, Folklore |
| `community_posts.aiTags` column (JSON) | AI-generated content tags |
| `consent_records` table | Versioned legal consent capture |

---

## 4. My Recommendations (Beyond the MVP Spec)

Based on my analysis of the specification and current market trends, I recommend the following additional features that would significantly strengthen Plantinel:

**4.1 Seasonal Plant Calendar.** Display which plants are in season for harvesting or preparation based on the user's region. This adds a practical dimension that no competitor offers and encourages regular app usage.

**4.2 Interaction Checker Tool.** A standalone tool where users can input two or more plants/herbs and check for known interactions. This is simpler than the full health profile but immediately useful and builds trust.

**4.3 Preparation Timer.** When viewing a remedy card that involves steeping, decoction, or infusion, offer a built-in timer. This transforms the card from reference material into an active cooking-style assistant.

**4.4 Plant of the Day.** A rotating featured plant on the home page that introduces users to new plants daily. This drives engagement and discovery without requiring the full Explore tab.

**4.5 QR Code Sharing.** In addition to link-based sharing, generate QR codes for cards that can be printed and attached to physical herb jars or remedy preparations. This bridges digital and physical use cases.

**4.6 Dosage Calculator.** A simple calculator that adjusts remedy dosages based on user-provided body weight and age. This addresses one of the most common questions in herbal medicine and adds significant practical value.

**4.7 Dark Mode.** The botanical design system currently uses a light theme. Adding a dark mode with deep forest greens and warm amber accents would improve nighttime usability and appeal to a broader audience.

---

## 5. Implementation Priority Roadmap

### Phase A — Critical (Implement Now)

These features are essential to the core product promise and user safety:

1. **Clarifying Question Flow** — Multi-turn AI sessions with follow-up questions
2. **User Health Profile** — Medications, allergies, pregnancy, age group for safety checks
3. **Card Edit & Regenerate** — Editable AI outputs with regeneration capability
4. **Ingredient → Remedy Builder** — New input mode for ingredient-based remedy generation
5. **Community Posts UI** — Complete the community discussion system
6. **Remedy Journal** — Symptom and remedy tracking

### Phase B — Important (Implement Next)

These features enhance the product significantly but are not blockers:

7. **Explore / Discovery Tab** — Browse by category, symptom, tradition
8. **5-Level Evidence Score** — Upgrade from 4-level to 5-level system
9. **Mystical Virtues Section** — Dedicated section on plant profiles
10. **Legal Pages** — Terms of Service, Privacy Policy, Medical Disclaimer
11. **Confidence + Caution Strip** — Visual indicators on every card
12. **Plant Active Compounds** — Structured compound data per plant
13. **Cultural Tradition Tags** — Ayurveda, TCM, Western, African, Amazonian

### Phase C — Enhancement (V2)

14. **Image-Based Plant Identification** — Vision AI for photo analysis
15. **Adaptive Knowledge Expansion** — Dynamic category creation
16. **Autonomous Content Generation** — Auto-generate plant profiles
17. **Subscription Tiers** — Monetization with Stripe
18. **Herbal Knowledge Graph** — Structured relationship mapping
19. **Unknown Alias Learning** — Community-driven alias discovery

---

## 6. Conclusion

The current Plantinel build is a solid foundation that covers approximately 60% of the expanded MVP specification. The most critical gaps are in the AI consultation experience (multi-turn conversations, clarifying questions, safety intake), user personalization (health profiles, remedy journals), and community features. Implementing Phase A features would bring the app to approximately 85% coverage of the specification and create a genuinely differentiated product in the botanical wellness space. The remaining features in Phases B and C can be rolled out iteratively as the user base grows.
