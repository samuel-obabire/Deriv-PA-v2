CREATE TABLE `withdrawal_request` (
	`id` text PRIMARY KEY NOT NULL,
	`derivId` text NOT NULL,
	`amount` real NOT NULL,
	`amountNgn` real NOT NULL,
	`currency` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `withdrawal_request_derivId_unique` ON `withdrawal_request` (`derivId`);