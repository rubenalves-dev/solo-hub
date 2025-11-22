PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`address` text,
	`notes` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_clients`("id", "owner_id", "name", "email", "phone", "address", "notes") SELECT "id", "owner_id", "name", "email", "phone", "address", "notes" FROM `clients`;--> statement-breakpoint
DROP TABLE `clients`;--> statement-breakpoint
ALTER TABLE `__new_clients` RENAME TO `clients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;