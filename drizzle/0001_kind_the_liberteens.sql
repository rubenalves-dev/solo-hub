CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`address` text,
	`notes` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`owner_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`due_date` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `time_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text,
	`user_id` text,
	`description` text,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP INDEX "users_username_unique";--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "description" TO "description" text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "color" TO "color" text;--> statement-breakpoint
ALTER TABLE `projects` ADD `client_id` text REFERENCES clients(id);--> statement-breakpoint
ALTER TABLE `projects` ADD `owner_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `projects` ADD `status` text NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `updated_at` integer NOT NULL;