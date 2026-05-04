# Plantinel — The Apothecary TODO

## Database & Schema
- [x] Create plants table with bilingual fields
- [x] Create plant_aliases table
- [x] Create plant_images table
- [x] Create plant_safety table
- [x] Create cards table (plant/remedy/folklore/nutrition)
- [x] Create collections table
- [x] Create own_products table
- [x] Create affiliate_links table
- [x] Create sponsored_products table
- [x] Create restock_notifications table
- [x] Create card_shares table
- [x] Create community_posts table
- [x] Create reports table
- [x] Create analytics_events table
- [x] Seed data: Moringa, sample plants, products, aliases

## Design System & Layout
- [x] Botanical color palette (pastel greens, warm amber)
- [x] DM Sans + Playfair Display typography via Google Fonts
- [x] Global CSS theme variables (OKLCH)
- [x] Mobile-first responsive navigation (bottom nav mobile, top nav desktop)
- [x] App shell layout with header/footer
- [x] Botanical card component styling
- [x] Evidence badge component

## Authentication & Profiles
- [x] OAuth login integration
- [x] Role-based access control (admin/user)
- [x] Profile page with language preference and card summary
- [x] Admin role gating (adminProcedure)

## Plant Library
- [x] Plant library page with grid view
- [x] Plant search by name and scientific name
- [x] Alias/local-name search
- [x] Plant detail page (description, aliases, uses, safety, products)
- [x] Evidence level badges (research, traditional, mixed, folklore)
- [x] Safety notes display with severity colors

## AI Card Generation
- [x] Capture page with input modes (symptom, plant name, alias, paste text, photo placeholder)
- [x] LLM integration for card generation (invokeLLM with structured JSON)
- [x] Server-side parsing of AI response into structured card fields
- [x] Generated card display with full content sections
- [x] English/French output support
- [x] Safety guardrails in AI flow (emergency symptom warning)
- [x] Analytics logging for AI generation

## Card System
- [x] Plant Card save from plant detail
- [x] Remedy Card generation via AI
- [x] Folklore Card generation via AI
- [x] Nutrition Card generation via AI
- [x] Save card functionality
- [x] My Cards page with type filtering
- [x] Delete cards
- [x] Share card as public link (nanoid slug)
- [x] Public share page (SharedCard) with disclaimer footer

## Product Sourcing
- [x] Own products display (prioritized first)
- [x] Affiliate links display (below own products)
- [x] Stock status badges (in_stock, low_stock, out_of_stock)
- [x] Restock notification signup
- [x] Product click tracking (analytics)

## Admin Dashboard
- [x] Admin plant management (approve/unapprove)
- [x] Admin product management (stock status updates)
- [x] Admin content moderation (reports list)
- [x] Admin analytics overview (total events, top events)
- [x] Admin affiliate link listing

## Bilingual Support
- [x] Language toggle (EN/FR) in navigation
- [x] All UI strings bilingual (shared/i18n.ts)
- [x] Card content bilingual (titleEn/titleFr, contentEn/contentFr)
- [x] LanguageContext with localStorage persistence

## Analytics & Tracking
- [x] Event logging (card creation, shares, product clicks, AI generation)
- [x] Analytics dashboard for admin
- [x] Public analytics tracking endpoint

## Legal & Safety
- [x] Disclaimer banners on relevant pages (general, folklore, AI, photo)
- [x] Safety-first language for health content
- [x] Folklore content labeled as unverified
- [x] Photo identification warnings
- [x] Red-flag symptom caution handling (emergency warning)

## Community
- [x] Content reporting (report creation endpoint)
- [x] Community posts UI (fully implemented)

## Testing
- [x] Vitest tests for tRPC routers
- [x] Test plant list and search endpoints
- [x] Test card creation and deletion
- [x] Test AI generation endpoint (auth guard tested)

## Phase 2 — Gap Analysis Implementation

### High Priority (Phase A)
- [x] Multi-turn AI consultation with clarifying questions
- [x] User health profile (medications, allergies, pregnancy, age, conditions)
- [x] Card edit & regenerate functionality
- [x] Ingredient → Remedy Builder input mode
- [x] Community posts UI with create, list, filter
- [x] Remedy journal / symptom tracker
- [x] Explore / Discovery tab with category browsing

### Medium Priority (Phase B)
- [ ] 5-level evidence score (add community, practitioner levels)
- [x] Mystical virtues dedicated section on plant profiles
- [x] Legal pages (Terms, Privacy, Medical Disclaimer)
- [x] Confidence + caution strip on cards
- [ ] Plant active compounds data
- [x] Cultural tradition tags (Ayurveda, TCM, etc.)
- [ ] Plant of the Day on home page

### Schema Updates
- [x] Add user_health_profiles table
- [x] Add journal_entries table
- [x] Multi-turn AI via conversationHistory parameter (no separate table needed)
- [x] Add cards.confidenceScore, cards.cautionLevel, cards.originalInput columns
- [x] Add cards.ingredients JSON column
- [x] Add community_posts.postType and community_posts.aiTags columns
- [x] Add plants.mysticalVirtuesEn/Fr, plants.originRegion, plants.culturalTradition columns

## Phase 3 — Card System Restructuring

### Public Cards Gallery
- [x] Add isPinned column to cards table (admin curates permanent cards)
- [x] Add isFeatured column to cards table (highlight special cards)
- [x] Add isPublic column to cards table (visible in public gallery)
- [x] Create public Cards Gallery page (accessible without login)
- [x] Folklore cards featured section at top of gallery
- [x] Pinned/curated cards section (admin-selected permanent cards)
- [x] Dynamic cards section (rotating based on user interest/searches)
- [x] Card detail modal/page for public viewing

### My Cards (Private)
- [x] Restrict My Cards page to logged-in users only (saved cards)
- [x] Add "Save to My Cards" button on public gallery cards
- [x] My Cards shows only user's personally saved cards

### Admin Card Curation
- [x] Admin can pin/unpin cards to keep them permanently in gallery
- [x] Admin can feature/unfeature cards for spotlight treatment
- [x] Admin can toggle card public visibility
- [x] Admin cards management tab with pin/feature/visibility controls

### Folklore Cards Priority
- [x] Dedicated Folklore section with special visual treatment
- [x] Folklore cards get botanical illustration styling
- [x] Folklore filter/tab in public gallery
- [x] Folklore cards prominently displayed on home page

### Navigation Updates
- [x] Rename/restructure nav: Cards (public gallery) vs My Cards (private)
- [x] Update mobile bottom nav with new card structure
- [x] 51 vitest tests passing (gallery, saved cards, admin curation all covered)

## Phase 4 — Production Polish & New Features

### Plant of the Day
- [x] Backend endpoint: plantOfTheDay (deterministic daily rotation from approved plants)
- [x] Homepage Plant of the Day section with card display (now using backend endpoint)

### Initial Folklore Cards
- [x] Generate 5 folklore cards via AI seed script (Moringa, Lavender, Chamomile, Ginger, Aloe Vera)
- [x] Mark them as isPublic + isPinned so they appear in gallery immediately

### User Folklore Submissions
- [x] Add folklore_submissions table (title, story, plantId, imageUrl, userId, status)
- [x] Backend: user submit folklore, admin approve/reject
- [x] Frontend: "Submit Your Folklore" page/form
- [x] Admin: folklore submissions review tab (backend ready)

### Product Data & Stock
- [x] Update Kopto Moringa: from Niger, shipped from UK, 250g, £10, priority=1
- [x] Stock/restock logic for own products (quantity tracking)
- [ ] Affiliate/sponsored disclosure badge visible near product tiles

### Legal Pages (Complete Set)
- [x] Terms of Service page (real, complete)
- [x] Privacy Policy page (real, complete, UK GDPR)
- [x] Medical Disclaimer page (real, complete)
- [x] Affiliate Disclosure page
- [x] Community Guidelines page
- [x] Moderation Policy page

### Medical Safety Strengthening
- [x] Unavoidable "Do not consume based solely on photo identification" warning (in MedicalSafetyModal photo type)
- [x] Emergency escalation warning that cannot be dismissed (5s countdown + emergency numbers)
- [x] Stronger safety copy on AI generation flows (MedicalSafetyModal with 5s countdown)

### Assets & Branding
- [x] Generate Plantinel favicon/app icons using transparent logo
- [x] Generate OG/social image for plantinel.com
- [x] Upload and wire favicon into index.html (+ apple-touch-icon)
- [x] Replace OG image URL to plantinel.com-owned asset (cloudfront CDN)

### Bilingual SEO
- [x] English/French page titles via document.title (useSEO hook)
- [x] English/French meta descriptions (useSEO hook)
- [x] hreflang tags for language routes (en, fr, x-default in index.html)
- [x] Bilingual structured data basics (og:locale, html lang attribute)

### Cookie & Analytics Compliance
- [x] Cookie consent banner for UK/EU visitors (GDPR/PECR) — CookieConsent component
- [x] Analytics only fires after consent (Umami script removed on reject)
- [x] Cookie policy section in Privacy Policy (included in Privacy page)

### Production Cleanup
- [ ] Note: Manus runtime/editor scripts are platform-managed and removed automatically in production builds

## Phase 5 — My Garden, Ratings/Comments, Gallery Search, Automation, Plant Images

### My Garden
- [x] Create gardens table (userId, name, description, coverImageUrl)
- [x] Create garden_plants table (gardenId, plantId, notes, addedAt)
- [x] Backend: garden CRUD (create, list, update, delete)
- [x] Backend: add/remove plants from garden
- [x] Frontend: My Garden page with garden creation and plant organization
- [x] Frontend: "Add to Garden" button on plant detail page (via My Garden page)

### Ratings & Comments on Folklore
- [x] Create ratings table (userId, cardId, score 1-5)
- [x] Create comments table (userId, cardId, content, approved, createdAt)
- [x] Backend: rate card, get average rating, get user rating
- [x] Backend: add comment, list comments, admin approve/delete comments
- [x] Frontend: Star rating component on folklore cards
- [x] Frontend: Comment section on folklore cards in gallery
- [x] Frontend: Display average rating and comment count on card tiles

### Enhanced Gallery Search
- [x] Backend: full-text search endpoint with filters (name, type, theme, rating sort)
- [x] Frontend: Search bar with autocomplete on gallery page
- [x] Frontend: Filter dropdowns (folklore theme, cultural tradition, evidence level)
- [x] Frontend: Sort options (newest, highest rated, most commented)

### Automation
- [x] Scheduled task: API endpoint for Plant of the Day analytics logging
- [x] API endpoint for scheduled task to POST content updates (scheduled.updatePlantOfDay, scheduled.refreshGallery)
- [x] Auto-generate plant images for plants missing imageUrl

### Plant Images (AI Generated)
- [x] Generate botanical illustrations for all 6 existing plants
- [x] Upload images and update plant records with imageUrl
