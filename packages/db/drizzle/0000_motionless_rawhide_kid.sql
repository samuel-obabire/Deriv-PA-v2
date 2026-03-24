CREATE TYPE "public"."withdrawal_status" AS ENUM('PENDING', 'MATCHED', 'FLAGGED', 'MISSING');--> statement-breakpoint
CREATE TABLE "withdrawal_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deriv_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"amount_ngn" numeric(12, 2) NOT NULL,
	"currency" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "withdrawal_status" DEFAULT 'PENDING' NOT NULL,
	CONSTRAINT "withdrawal_request_deriv_id_unique" UNIQUE("deriv_id")
);
