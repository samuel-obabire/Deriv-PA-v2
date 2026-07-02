ALTER TABLE "client_kyc_record" RENAME COLUMN "id_front_url" TO "id_front_key";--> statement-breakpoint
ALTER TABLE "client_kyc_record" RENAME COLUMN "id_back_url" TO "id_back_key";--> statement-breakpoint
ALTER TABLE "client_kyc_record" RENAME COLUMN "selfie_video_url" TO "selfie_video_key";