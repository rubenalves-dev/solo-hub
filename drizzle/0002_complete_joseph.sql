PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text,
	`owner_id` text,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`status` text NOT NULL,
	`repo_url` text,
	`live_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "client_id", "owner_id", "name", "description", "color", "status", "repo_url", "live_url", "created_at", "updated_at") SELECT "id", "client_id", "owner_id", "name", "description", "color", "status", "repo_url", "live_url", "created_at", "updated_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;