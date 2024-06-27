ALTER TABLE "user_info" RENAME COLUMN "name" TO "firstName";--> statement-breakpoint
ALTER TABLE "user_info" ADD COLUMN "lastName" varchar(255) NOT NULL;