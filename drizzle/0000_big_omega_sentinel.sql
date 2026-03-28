CREATE TABLE `orders` (
	`id` integer PRIMARY KEY NOT NULL,
	`caption` text NOT NULL,
	`status` text DEFAULT 'created' NOT NULL,
	`createdAt` integer NOT NULL,
	`post` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
