CREATE TABLE "deriv_client_nickname" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_reference_id" text NOT NULL,
	"nickname" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "deriv_client_nickname_external_reference_id_unique" ON "deriv_client_nickname" USING btree ("external_reference_id");