ALTER TABLE "rate" ADD COLUMN "min" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "rate" ADD COLUMN "max" integer DEFAULT 1000 NOT NULL;