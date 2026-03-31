ALTER TABLE "payout_request" ALTER COLUMN "reciepient_account" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payout_request" ALTER COLUMN "reciepient_bank" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payout_request" ADD COLUMN "client_cr" text;