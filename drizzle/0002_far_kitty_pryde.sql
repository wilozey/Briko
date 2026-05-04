CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cardId` int,
	`symptoms` text,
	`remedyUsed` text,
	`result` enum('improved','no_change','worsened'),
	`duration` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_health_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`medications` json,
	`allergies` json,
	`isPregnant` boolean DEFAULT false,
	`isBreastfeeding` boolean DEFAULT false,
	`ageGroup` enum('child','teen','adult','senior') DEFAULT 'adult',
	`chronicConditions` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_health_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_health_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `cards` MODIFY COLUMN `sourceType` enum('symptom','plant_name','alias','photo','paste_text','ingredients','admin','community') DEFAULT 'plant_name';--> statement-breakpoint
ALTER TABLE `cards` ADD `confidenceScore` int;--> statement-breakpoint
ALTER TABLE `cards` ADD `cautionLevel` enum('low','medium','high','critical') DEFAULT 'low';--> statement-breakpoint
ALTER TABLE `cards` ADD `originalInput` text;--> statement-breakpoint
ALTER TABLE `cards` ADD `ingredients` json;--> statement-breakpoint
ALTER TABLE `community_posts` ADD `postType` enum('experience','tradition','folklore','question') DEFAULT 'experience';--> statement-breakpoint
ALTER TABLE `community_posts` ADD `aiTags` json;--> statement-breakpoint
ALTER TABLE `plants` ADD `originRegion` varchar(255);--> statement-breakpoint
ALTER TABLE `plants` ADD `culturalTradition` varchar(255);--> statement-breakpoint
ALTER TABLE `plants` ADD `mysticalVirtuesEn` text;--> statement-breakpoint
ALTER TABLE `plants` ADD `mysticalVirtuesFr` text;--> statement-breakpoint
ALTER TABLE `plants` ADD `activeCompounds` json;--> statement-breakpoint
ALTER TABLE `plants` ADD `category` varchar(100);