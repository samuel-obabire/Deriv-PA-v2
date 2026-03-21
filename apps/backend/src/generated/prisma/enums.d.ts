export declare const WithdrawalStatus: {
    readonly PENDING: "PENDING";
    readonly MATCHED: "MATCHED";
    readonly FLAGGED: "FLAGGED";
    readonly MISSING: "MISSING";
};
export type WithdrawalStatus = (typeof WithdrawalStatus)[keyof typeof WithdrawalStatus];
export declare const PayoutStatus: {
    readonly UNMATCHED: "UNMATCHED";
    readonly MATCHED: "MATCHED";
    readonly FLAGGED: "FLAGGED";
};
export type PayoutStatus = (typeof PayoutStatus)[keyof typeof PayoutStatus];
//# sourceMappingURL=enums.d.ts.map