DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kyc_rejection_reason_enum') THEN
    CREATE TYPE "public"."kyc_rejection_reason_enum" AS ENUM('blurry_document', 'document_expired', 'name_mismatch', 'incomplete_submission', 'fraudulent_document');
  END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "client_kyc_record" ADD COLUMN IF NOT EXISTS "rejection_reason" "kyc_rejection_reason_enum";
