DROP INDEX "kyc_record_org_deriv_nickname";--> statement-breakpoint
CREATE UNIQUE INDEX "kyc_record_org_deriv_nickname" ON "client_kyc_record" USING btree ("organization_id",lower("deriv_nickname"));