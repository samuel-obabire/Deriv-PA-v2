CREATE TYPE "public"."access_request_action_enum" AS ENUM('requested', 'approved', 'rejected', 'revoked');--> statement-breakpoint
CREATE TABLE "access_request_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"member_id" text,
	"member_email" text NOT NULL,
	"action_type" "access_request_action_enum" NOT NULL,
	"actor_user_id" text,
	"actor_email" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "elevated_access_grant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"target_user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"is_granted" boolean DEFAULT false NOT NULL,
	"granted_at" timestamp (6) with time zone,
	"expires_at" timestamp (6) with time zone,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "elevated_access_grant_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
ALTER TABLE "access_request_audit_log" ADD CONSTRAINT "access_request_audit_log_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_request_audit_log" ADD CONSTRAINT "access_request_audit_log_member_id_user_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_request_audit_log" ADD CONSTRAINT "access_request_audit_log_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elevated_access_grant" ADD CONSTRAINT "elevated_access_grant_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elevated_access_grant" ADD CONSTRAINT "elevated_access_grant_target_user_id_user_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elevated_access_grant" ADD CONSTRAINT "elevated_access_grant_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "access_request_audit_log_org_idx" ON "access_request_audit_log" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "access_request_audit_log_member_idx" ON "access_request_audit_log" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "access_request_audit_log_action_idx" ON "access_request_audit_log" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "access_request_audit_log_org_created_idx" ON "access_request_audit_log" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "elevated_access_grant_org_idx" ON "elevated_access_grant" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "elevated_access_grant_user_idx" ON "elevated_access_grant" USING btree ("target_user_id");--> statement-breakpoint
CREATE INDEX "elevated_access_grant_org_granted_idx" ON "elevated_access_grant" USING btree ("organization_id","is_granted");