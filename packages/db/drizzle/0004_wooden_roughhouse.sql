CREATE TYPE "public"."client_customer_type_enum" AS ENUM('existing', 'new');--> statement-breakpoint
CREATE TYPE "public"."kyc_document_type_enum" AS ENUM('national_id', 'international_passport', 'drivers_license', 'voters_card');--> statement-breakpoint
CREATE TYPE "public"."kyc_status_enum" AS ENUM('unverified', 'pending_review', 'verified', 'rejected');--> statement-breakpoint
CREATE TABLE "client_kyc_invitation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_type" "client_customer_type_enum" NOT NULL,
	"token_hash" text NOT NULL,
	"organization_id" text NOT NULL,
	"expires_at" timestamp (6) with time zone NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_kyc_invitation_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "client_kyc_record" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"deriv_nickname" text NOT NULL,
	"phone_number" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"status" "kyc_status_enum" DEFAULT 'unverified' NOT NULL,
	"document_type" "kyc_document_type_enum",
	"id_front_url" text,
	"id_back_url" text,
	"selfie_video_url" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_kyc_record_deriv_nickname_unique" UNIQUE("deriv_nickname"),
	CONSTRAINT "client_kyc_record_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "client_kyc_record_whatsapp_number_unique" UNIQUE("whatsapp_number")
);
--> statement-breakpoint
ALTER TABLE "client_kyc_invitation" ADD CONSTRAINT "client_kyc_invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_kyc_record" ADD CONSTRAINT "client_kyc_record_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kyc_invitation_org_idx" ON "client_kyc_invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kyc_record_org_email_unique" ON "client_kyc_record" USING btree ("organization_id","email");--> statement-breakpoint
CREATE INDEX "kyc_record_org_idx" ON "client_kyc_record" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "kyc_record_status_idx" ON "client_kyc_record" USING btree ("status");