CREATE TABLE `millennicare_address` (
	`id` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`longitude` float NOT NULL,
	`latitude` float NOT NULL,
	`address` varchar(255),
	`unit` varchar(255),
	`userId` varchar(128) NOT NULL,
	CONSTRAINT `millennicare_address_id` PRIMARY KEY(`id`),
	CONSTRAINT `millennicare_address_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_appointment` (
	`id` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`status` enum('cancelled','pending','confirmed','finished') NOT NULL,
	`serviceId` varchar(128) NOT NULL,
	`careseekerId` varchar(128) NOT NULL,
	`caregiverId` varchar(128) NOT NULL,
	CONSTRAINT `millennicare_appointment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `millennicare_account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_caregiver` (
	`userId` varchar(128) NOT NULL,
	`background_check_completed` boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `millennicare_careseeker` (
	`userId` varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `millennicare_session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `millennicare_session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_user` (
	`id` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`image` varchar(255),
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`biography` varchar(255),
	`profilePicture` varchar(255),
	`birthdate` datetime NOT NULL,
	`userType` enum('careseeker','caregiver','admin'),
	`caregiverId` varchar(128),
	`careseekerId` varchar(128),
	CONSTRAINT `millennicare_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `millennicare_user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `millennicare_verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_child` (
	`id` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`age` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`careseekerId` varchar(255) NOT NULL,
	CONSTRAINT `millennicare_child_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_forgot_password_token` (
	`id` varchar(128) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`expiresIn` bigint NOT NULL,
	`token` varchar(255) NOT NULL,
	CONSTRAINT `millennicare_forgot_password_token_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_review` (
	`id` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`rating` tinyint NOT NULL,
	`caregiverId` varchar(128) NOT NULL,
	`careseekerId` varchar(128) NOT NULL,
	CONSTRAINT `millennicare_review_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_service` (
	`id` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`title` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`price` double(10,2) NOT NULL,
	`category` enum('child_care','senior_care','housekeeping','petcare'),
	CONSTRAINT `millennicare_service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `millennicare_waitlist` (
	`id` varchar(128) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`email` varchar(255) NOT NULL,
	`contacted` boolean DEFAULT false,
	CONSTRAINT `millennicare_waitlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `millennicare_waitlist_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `millennicare_account` (`userId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `millennicare_caregiver` (`userId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `millennicare_careseeker` (`userId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `millennicare_session` (`userId`);