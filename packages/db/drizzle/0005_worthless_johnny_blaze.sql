ALTER TABLE "client_kyc_record" DROP CONSTRAINT "client_kyc_record_phone_number_unique";--> statement-breakpoint
ALTER TABLE "client_kyc_record" DROP CONSTRAINT "client_kyc_record_whatsapp_number_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "kyc_record_org_whatsapp_unique" ON "client_kyc_record" USING btree ("organization_id","whatsapp_number");--> statement-breakpoint
ALTER TABLE "client_kyc_record" DROP COLUMN "phone_number";