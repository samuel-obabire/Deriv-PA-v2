CREATE TABLE "payout_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"withdrawal_id" uuid,
	"amount_ngn" numeric(12, 2) NOT NULL,
	"reciepient_name" text NOT NULL,
	"reciepient_account" text NOT NULL,
	"reciepient_bank" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "payout_status" DEFAULT 'UNMATCHED' NOT NULL,
	"flag_reason" text
);
--> statement-breakpoint
ALTER TABLE "payout_request" ADD CONSTRAINT "payout_request_withdrawal_id_withdrawal_request_id_fk" FOREIGN KEY ("withdrawal_id") REFERENCES "public"."withdrawal_request"("id") ON DELETE no action ON UPDATE no action;