CREATE TYPE "public"."transaction_status_enum" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."transaction_type_enum" AS ENUM('deposit', 'withdrawal');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key" text,
	"client_id" text NOT NULL,
	"client_name" text,
	"organization_id" text NOT NULL,
	"staff_id" text,
	"amount" numeric(12, 2) NOT NULL,
	"type" "transaction_type_enum" NOT NULL,
	"currency" "currency_enum" NOT NULL,
	"status" "transaction_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_staff_id_user_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "transaction_org_idx" ON "transactions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "transaction_client_idx" ON "transactions" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "transaction_org_created_idx" ON "transactions" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "transaction_staff_idx" ON "transactions" USING btree ("staff_id");