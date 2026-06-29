import crypto from "node:crypto";

export const generateInviteToken = () => crypto.randomBytes(6).toString("hex");
