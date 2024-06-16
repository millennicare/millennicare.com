DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('cancelled', 'pending', 'confirmed', 'finished');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('child_care', 'senior_care', 'housekeeping', 'pet_care');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('caregiver', 'careseeker', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"provider_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "accounts_provider_id_provider_user_id_pk" PRIMARY KEY("provider_id","provider_user_id"),
	CONSTRAINT "accounts_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"line1" varchar(128) NOT NULL,
	"line2" varchar(128),
	"city" varchar(128) NOT NULL,
	"state" varchar(128) NOT NULL,
	"zip_code" varchar(128) NOT NULL,
	"longitude" double precision NOT NULL,
	"latitude" double precision NOT NULL,
	"place_id" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp NOT NULL,
	"status" "status" NOT NULL,
	"service_id" text NOT NULL,
	"careseeker_id" text NOT NULL,
	"caregiver_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "caregivers" (
	"user_id" text,
	"background_check_completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "caregivers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "careseekers" (
	"user_id" text,
	CONSTRAINT "careseekers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "children" (
	"id" text PRIMARY KEY NOT NULL,
	"age" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact-us" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"price" double precision NOT NULL,
	"category" "category" NOT NULL,
	"caregiver_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_info" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone_number" varchar(255) NOT NULL,
	"biography" varchar(255),
	"profile_picture" text,
	"birthdate" date NOT NULL,
	"stripe_id" text NOT NULL,
	CONSTRAINT "user_info_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"type" "type" NOT NULL,
	"onboarding_complete" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waitlists" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"contacted" boolean DEFAULT false,
	CONSTRAINT "waitlists_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "caregivers" ADD CONSTRAINT "caregivers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "careseekers" ADD CONSTRAINT "careseekers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "children" ADD CONSTRAINT "children_user_id_careseekers_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."careseekers"("user_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_caregiver_id_caregivers_user_id_fk" FOREIGN KEY ("caregiver_id") REFERENCES "public"."caregivers"("user_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_userId_idx" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointment_serviceId_idx" ON "appointments" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointment_careseekerId_idx" ON "appointments" USING btree ("careseeker_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointment_caregiverId_idx" ON "appointments" USING btree ("caregiver_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "caregiver_userId_idx" ON "caregivers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "careseeker_userId_idx" ON "careseekers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "child_userId_idx" ON "children" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "service_userId_idx" ON "services" USING btree ("caregiver_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_stripeId_idx" ON "user_info" USING btree ("stripe_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_userId_idx" ON "user_info" USING btree ("user_id");