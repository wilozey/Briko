CREATE TABLE `saved_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cardId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cards` ADD `isPinned` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `cards` ADD `isFeatured` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `cards` ADD `isPublic` boolean DEFAULT false NOT NULL;