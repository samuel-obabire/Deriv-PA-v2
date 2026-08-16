import { relations } from "drizzle-orm";
import { accessRequestAuditLog } from "./accessRequestAuditLog";
import { account } from "./account";
import { clientKycInvitation } from "./clientKycInvitation";
import { clientKycRecord } from "./clientKycRecord";
import { currency } from "./currency";
import { dailySummary } from "./dailySummary";
import { elevatedAccessGrant } from "./elevatedAccessGrant";
import { invitation } from "./invitation";
import { member } from "./member";
import { organization } from "./organization";

import { rate } from "./rate";
import { session } from "./session";
import { user } from "./user";

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	members: many(member),
	invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member),
	invitations: many(invitation),
	clientKycInvitations: many(clientKycInvitation),
	clientKycRecords: many(clientKycRecord),
}));

export const clientKycRecordRelations = relations(
	clientKycRecord,
	({ one }) => ({
		organization: one(organization, {
			fields: [clientKycRecord.organizationId],
			references: [organization.id],
		}),
	}),
);

export const clientKycInvitationRelations = relations(
	clientKycInvitation,
	({ one }) => ({
		organization: one(organization, {
			fields: [clientKycInvitation.organizationId],
			references: [organization.id],
		}),
	}),
);

export const memberRelations = relations(member, ({ one }) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
	}),
	inviter: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
	}),
}));

export const currencyRelation = relations(currency, ({ one }) => ({
	organization: one(organization, {
		fields: [currency.id],
		references: [organization.id],
	}),
}));

export const rateRelation = relations(rate, ({ one }) => ({
	organization: one(organization, {
		fields: [rate.id],
		references: [organization.id],
	}),
}));

export const dailySummaryRelations = relations(dailySummary, ({ one }) => ({
	organization: one(organization, {
		fields: [dailySummary.organizationId],
		references: [organization.id],
	}),
}));

export const elevatedAccessGrantRelations = relations(
	elevatedAccessGrant,
	({ one }) => ({
		session: one(session, {
			fields: [elevatedAccessGrant.sessionId],
			references: [session.id],
		}),
		targetUser: one(user, {
			fields: [elevatedAccessGrant.targetUserId],
			references: [user.id],
		}),
		organization: one(organization, {
			fields: [elevatedAccessGrant.organizationId],
			references: [organization.id],
		}),
	}),
);

export const accessRequestAuditLogRelations = relations(
	accessRequestAuditLog,
	({ one }) => ({
		organization: one(organization, {
			fields: [accessRequestAuditLog.organizationId],
			references: [organization.id],
		}),
		member: one(user, {
			fields: [accessRequestAuditLog.memberId],
			references: [user.id],
		}),
		actor: one(user, {
			fields: [accessRequestAuditLog.actorUserId],
			references: [user.id],
		}),
	}),
);
