CREATE TABLE `affiliate_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plantId` int,
	`supplierName` varchar(255),
	`productName` varchar(255) NOT NULL,
	`productFormat` varchar(100),
	`packSize` varchar(100),
	`priceLabel` varchar(50),
	`affiliateUrl` text NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`priorityRank` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliate_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(100),
	`eventName` varchar(100) NOT NULL,
	`entityType` varchar(50),
	`entityId` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `card_shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cardId` int NOT NULL,
	`sharedByUserId` int NOT NULL,
	`shareMethod` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `card_shares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plantId` int,
	`cardType` enum('plant','remedy','folklore','nutrition') NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleFr` varchar(500),
	`contentEn` text,
	`contentFr` text,
	`traditionalUsesEn` text,
	`traditionalUsesFr` text,
	`preparationEn` text,
	`preparationFr` text,
	`safetyNotesEn` text,
	`safetyNotesFr` text,
	`evidenceLevel_card` enum('research','traditional','mixed','folklore') DEFAULT 'traditional',
	`folkloreLabel` boolean DEFAULT false,
	`sourceType` enum('symptom','plant_name','alias','photo','paste_text','admin','community') DEFAULT 'plant_name',
	`aiGenerated` boolean DEFAULT false,
	`shareSlug` varchar(100),
	`publicShareEnabled` boolean DEFAULT false,
	`savedImageUrl` text,
	`collectionId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cards_id` PRIMARY KEY(`id`),
	CONSTRAINT `cards_shareSlug_unique` UNIQUE(`shareSlug`)
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500),
	`content` text,
	`plantId` int,
	`approved` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `own_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plantId` int,
	`name` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`originCountry` varchar(100),
	`originLocalName` varchar(255),
	`shippedFrom` varchar(100),
	`priceGbp` decimal(10,2),
	`weightLabel` varchar(50),
	`stockStatus` enum('in_stock','out_of_stock','low_stock') DEFAULT 'in_stock',
	`priorityRank` int DEFAULT 0,
	`imageUrl` text,
	`buyUrl` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `own_products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plant_aliases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plantId` int NOT NULL,
	`alias` varchar(255) NOT NULL,
	`language` varchar(10) DEFAULT 'en',
	`region` varchar(100),
	`aliasType` enum('local','common','traditional','scientific') DEFAULT 'local',
	CONSTRAINT `plant_aliases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plant_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plantId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`caption` varchar(255),
	`isPrimary` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plant_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plant_safety` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plantId` int NOT NULL,
	`warningEn` text,
	`warningFr` text,
	`severity` enum('low','medium','high','critical') DEFAULT 'low',
	`category` varchar(100),
	CONSTRAINT `plant_safety_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scientificName` varchar(255) NOT NULL,
	`commonNameEn` varchar(255) NOT NULL,
	`commonNameFr` varchar(255),
	`descriptionEn` text,
	`descriptionFr` text,
	`traditionalUsesEn` text,
	`traditionalUsesFr` text,
	`preparationTypes` json,
	`evidenceLevel` enum('research','traditional','mixed','folklore') DEFAULT 'traditional',
	`imageUrl` text,
	`approved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterUserId` int NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int NOT NULL,
	`reason` text,
	`status` enum('pending','reviewed','dismissed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `restock_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`plantId` int,
	`ownProductId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`notifiedAt` timestamp,
	CONSTRAINT `restock_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsored_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plantId` int,
	`brandName` varchar(255),
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`imageUrl` text,
	`targetUrl` text,
	`sponsorshipType` varchar(50),
	`active` boolean NOT NULL DEFAULT true,
	`startAt` timestamp,
	`endAt` timestamp,
	CONSTRAINT `sponsored_products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLanguage` enum('en','fr') DEFAULT 'en' NOT NULL;