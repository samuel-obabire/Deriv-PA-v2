CREATE TYPE "public"."currency_enum" AS ENUM('USD', 'USDC', 'eUSDT', 'tUSDT');--> statement-breakpoint
CREATE TABLE "currency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" "currency_enum" NOT NULL,
	"label" text NOT NULL,
	"token" text NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "currency" ADD CONSTRAINT "currency_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "currency_org_idx" ON "currency" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "org_currency_unique" ON "currency" USING btree ("organization_id","code");