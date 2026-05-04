CREATE TABLE `folklore_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plantId` int,
	`plantName` varchar(255),
	`titleEn` varchar(500) NOT NULL,
	`titleFr` varchar(500),
	`storyEn` text NOT NULL,
	`storyFr` text,
	`region` varchar(255),
	`culturalTradition` varchar(255),
	`imageUrl` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `folklore_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `own_products` ADD `stockQuantity` int DEFAULT 0;