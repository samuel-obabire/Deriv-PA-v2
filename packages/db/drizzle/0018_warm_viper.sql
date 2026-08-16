CREATE TABLE "daily_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"business_date" date NOT NULL,
	"total_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total_successful_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total_count" integer DEFAULT 0 NOT NULL,
	"total_successful" integer DEFAULT 0 NOT NULL,
	"total_cancelled" integer DEFAULT 0 NOT NULL,
	"total_failed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_summary_org_business_date_unique" UNIQUE("organization_id","business_date")
);
--> statement-breakpoint
ALTER TABLE "daily_summary" ADD CONSTRAINT "daily_summary_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "daily_summary_org_idx" ON "daily_summary" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "daily_summary_business_date_idx" ON "daily_summary" USING btree ("business_date");