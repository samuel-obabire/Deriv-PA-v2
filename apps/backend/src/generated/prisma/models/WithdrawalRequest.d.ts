import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model WithdrawalRequest
 *
 */
export type WithdrawalRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$WithdrawalRequestPayload>;
export type AggregateWithdrawalRequest = {
    _count: WithdrawalRequestCountAggregateOutputType | null;
    _avg: WithdrawalRequestAvgAggregateOutputType | null;
    _sum: WithdrawalRequestSumAggregateOutputType | null;
    _min: WithdrawalRequestMinAggregateOutputType | null;
    _max: WithdrawalRequestMaxAggregateOutputType | null;
};
export type WithdrawalRequestAvgAggregateOutputType = {
    amount: number | null;
    amountNgn: number | null;
};
export type WithdrawalRequestSumAggregateOutputType = {
    amount: number | null;
    amountNgn: number | null;
};
export type WithdrawalRequestMinAggregateOutputType = {
    id: string | null;
    derivId: string | null;
    amount: number | null;
    amountNgn: number | null;
    currency: string | null;
    derivRef: string | null;
    createdAt: Date | null;
    status: $Enums.WithdrawalStatus | null;
};
export type WithdrawalRequestMaxAggregateOutputType = {
    id: string | null;
    derivId: string | null;
    amount: number | null;
    amountNgn: number | null;
    currency: string | null;
    derivRef: string | null;
    createdAt: Date | null;
    status: $Enums.WithdrawalStatus | null;
};
export type WithdrawalRequestCountAggregateOutputType = {
    id: number;
    derivId: number;
    amount: number;
    amountNgn: number;
    currency: number;
    derivRef: number;
    createdAt: number;
    status: number;
    _all: number;
};
export type WithdrawalRequestAvgAggregateInputType = {
    amount?: true;
    amountNgn?: true;
};
export type WithdrawalRequestSumAggregateInputType = {
    amount?: true;
    amountNgn?: true;
};
export type WithdrawalRequestMinAggregateInputType = {
    id?: true;
    derivId?: true;
    amount?: true;
    amountNgn?: true;
    currency?: true;
    derivRef?: true;
    createdAt?: true;
    status?: true;
};
export type WithdrawalRequestMaxAggregateInputType = {
    id?: true;
    derivId?: true;
    amount?: true;
    amountNgn?: true;
    currency?: true;
    derivRef?: true;
    createdAt?: true;
    status?: true;
};
export type WithdrawalRequestCountAggregateInputType = {
    id?: true;
    derivId?: true;
    amount?: true;
    amountNgn?: true;
    currency?: true;
    derivRef?: true;
    createdAt?: true;
    status?: true;
    _all?: true;
};
export type WithdrawalRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which WithdrawalRequest to aggregate.
     */
    where?: Prisma.WithdrawalRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WithdrawalRequests to fetch.
     */
    orderBy?: Prisma.WithdrawalRequestOrderByWithRelationInput | Prisma.WithdrawalRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.WithdrawalRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WithdrawalRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WithdrawalRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned WithdrawalRequests
    **/
    _count?: true | WithdrawalRequestCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: WithdrawalRequestAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: WithdrawalRequestSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: WithdrawalRequestMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: WithdrawalRequestMaxAggregateInputType;
};
export type GetWithdrawalRequestAggregateType<T extends WithdrawalRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateWithdrawalRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWithdrawalRequest[P]> : Prisma.GetScalarType<T[P], AggregateWithdrawalRequest[P]>;
};
export type WithdrawalRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WithdrawalRequestWhereInput;
    orderBy?: Prisma.WithdrawalRequestOrderByWithAggregationInput | Prisma.WithdrawalRequestOrderByWithAggregationInput[];
    by: Prisma.WithdrawalRequestScalarFieldEnum[] | Prisma.WithdrawalRequestScalarFieldEnum;
    having?: Prisma.WithdrawalRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WithdrawalRequestCountAggregateInputType | true;
    _avg?: WithdrawalRequestAvgAggregateInputType;
    _sum?: WithdrawalRequestSumAggregateInputType;
    _min?: WithdrawalRequestMinAggregateInputType;
    _max?: WithdrawalRequestMaxAggregateInputType;
};
export type WithdrawalRequestGroupByOutputType = {
    id: string;
    derivId: string;
    amount: number;
    amountNgn: number;
    currency: string;
    derivRef: string | null;
    createdAt: Date;
    status: $Enums.WithdrawalStatus;
    _count: WithdrawalRequestCountAggregateOutputType | null;
    _avg: WithdrawalRequestAvgAggregateOutputType | null;
    _sum: WithdrawalRequestSumAggregateOutputType | null;
    _min: WithdrawalRequestMinAggregateOutputType | null;
    _max: WithdrawalRequestMaxAggregateOutputType | null;
};
type GetWithdrawalRequestGroupByPayload<T extends WithdrawalRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WithdrawalRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WithdrawalRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WithdrawalRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WithdrawalRequestGroupByOutputType[P]>;
}>>;
export type WithdrawalRequestWhereInput = {
    AND?: Prisma.WithdrawalRequestWhereInput | Prisma.WithdrawalRequestWhereInput[];
    OR?: Prisma.WithdrawalRequestWhereInput[];
    NOT?: Prisma.WithdrawalRequestWhereInput | Prisma.WithdrawalRequestWhereInput[];
    id?: Prisma.StringFilter<"WithdrawalRequest"> | string;
    derivId?: Prisma.StringFilter<"WithdrawalRequest"> | string;
    amount?: Prisma.FloatFilter<"WithdrawalRequest"> | number;
    amountNgn?: Prisma.FloatFilter<"WithdrawalRequest"> | number;
    currency?: Prisma.StringFilter<"WithdrawalRequest"> | string;
    derivRef?: Prisma.StringNullableFilter<"WithdrawalRequest"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"WithdrawalRequest"> | Date | string;
    status?: Prisma.EnumWithdrawalStatusFilter<"WithdrawalRequest"> | $Enums.WithdrawalStatus;
    payout?: Prisma.XOR<Prisma.PayoutNullableScalarRelationFilter, Prisma.PayoutWhereInput> | null;
};
export type WithdrawalRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    derivId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    amountNgn?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    derivRef?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    payout?: Prisma.PayoutOrderByWithRelationInput;
};
export type WithdrawalRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.WithdrawalRequestWhereInput | Prisma.WithdrawalRequestWhereInput[];
    OR?: Prisma.WithdrawalRequestWhereInput[];
    NOT?: Prisma.WithdrawalRequestWhereInput | Prisma.WithdrawalRequestWhereInput[];
    derivId?: Prisma.StringFilter<"WithdrawalRequest"> | string;
    amount?: Prisma.FloatFilter<"WithdrawalRequest"> | number;
    amountNgn?: Prisma.FloatFilter<"WithdrawalRequest"> | number;
    currency?: Prisma.StringFilter<"WithdrawalRequest"> | string;
    derivRef?: Prisma.StringNullableFilter<"WithdrawalRequest"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"WithdrawalRequest"> | Date | string;
    status?: Prisma.EnumWithdrawalStatusFilter<"WithdrawalRequest"> | $Enums.WithdrawalStatus;
    payout?: Prisma.XOR<Prisma.PayoutNullableScalarRelationFilter, Prisma.PayoutWhereInput> | null;
}, "id">;
export type WithdrawalRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    derivId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    amountNgn?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    derivRef?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    _count?: Prisma.WithdrawalRequestCountOrderByAggregateInput;
    _avg?: Prisma.WithdrawalRequestAvgOrderByAggregateInput;
    _max?: Prisma.WithdrawalRequestMaxOrderByAggregateInput;
    _min?: Prisma.WithdrawalRequestMinOrderByAggregateInput;
    _sum?: Prisma.WithdrawalRequestSumOrderByAggregateInput;
};
export type WithdrawalRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.WithdrawalRequestScalarWhereWithAggregatesInput | Prisma.WithdrawalRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.WithdrawalRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WithdrawalRequestScalarWhereWithAggregatesInput | Prisma.WithdrawalRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"WithdrawalRequest"> | string;
    derivId?: Prisma.StringWithAggregatesFilter<"WithdrawalRequest"> | string;
    amount?: Prisma.FloatWithAggregatesFilter<"WithdrawalRequest"> | number;
    amountNgn?: Prisma.FloatWithAggregatesFilter<"WithdrawalRequest"> | number;
    currency?: Prisma.StringWithAggregatesFilter<"WithdrawalRequest"> | string;
    derivRef?: Prisma.StringNullableWithAggregatesFilter<"WithdrawalRequest"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WithdrawalRequest"> | Date | string;
    status?: Prisma.EnumWithdrawalStatusWithAggregatesFilter<"WithdrawalRequest"> | $Enums.WithdrawalStatus;
};
export type WithdrawalRequestCreateInput = {
    id?: string;
    derivId: string;
    amount: number;
    amountNgn: number;
    currency?: string;
    derivRef?: string | null;
    createdAt?: Date | string;
    status?: $Enums.WithdrawalStatus;
    payout?: Prisma.PayoutCreateNestedOneWithoutWithdrawalInput;
};
export type WithdrawalRequestUncheckedCreateInput = {
    id?: string;
    derivId: string;
    amount: number;
    amountNgn: number;
    currency?: string;
    derivRef?: string | null;
    createdAt?: Date | string;
    status?: $Enums.WithdrawalStatus;
    payout?: Prisma.PayoutUncheckedCreateNestedOneWithoutWithdrawalInput;
};
export type WithdrawalRequestUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    derivId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    amountNgn?: Prisma.FloatFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    derivRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus;
    payout?: Prisma.PayoutUpdateOneWithoutWithdrawalNestedInput;
};
export type WithdrawalRequestUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    derivId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    amountNgn?: Prisma.FloatFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    derivRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus;
    payout?: Prisma.PayoutUncheckedUpdateOneWithoutWithdrawalNestedInput;
};
export type WithdrawalRequestCreateManyInput = {
    id?: string;
    derivId: string;
    amount: number;
    amountNgn: number;
    currency?: string;
    derivRef?: string | null;
    createdAt?: Date | string;
    status?: $Enums.WithdrawalStatus;
};
export type WithdrawalRequestUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    derivId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    amountNgn?: Prisma.FloatFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    derivRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus;
};
export type WithdrawalRequestUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    derivId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    amountNgn?: Prisma.FloatFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    derivRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus;
};
export type WithdrawalRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    derivId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    amountNgn?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    derivRef?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type WithdrawalRequestAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
    amountNgn?: Prisma.SortOrder;
};
export type WithdrawalRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    derivId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    amountNgn?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    derivRef?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type WithdrawalRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    derivId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    amountNgn?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    derivRef?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type WithdrawalRequestSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
    amountNgn?: Prisma.SortOrder;
};
export type WithdrawalRequestNullableScalarRelationFilter = {
    is?: Prisma.WithdrawalRequestWhereInput | null;
    isNot?: Prisma.WithdrawalRequestWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type EnumWithdrawalStatusFieldUpdateOperationsInput = {
    set?: $Enums.WithdrawalStatus;
};
export type WithdrawalRequestCreateNestedOneWithoutPayoutInput = {
    create?: Prisma.XOR<Prisma.WithdrawalRequestCreateWithoutPayoutInput, Prisma.WithdrawalRequestUncheckedCreateWithoutPayoutInput>;
    connectOrCreate?: Prisma.WithdrawalRequestCreateOrConnectWithoutPayoutInput;
    connect?: Prisma.WithdrawalRequestWhereUniqueInput;
};
export type WithdrawalRequestUpdateOneWithoutPayoutNestedInput = {
    create?: Prisma.XOR<Prisma.WithdrawalRequestCreateWithoutPayoutInput, Prisma.WithdrawalRequestUncheckedCreateWithoutPayoutInput>;
    connectOrCreate?: Prisma.WithdrawalRequestCreateOrConnectWithoutPayoutInput;
    upsert?: Prisma.WithdrawalRequestUpsertWithoutPayoutInput;
    disconnect?: Prisma.WithdrawalRequestWhereInput | boolean;
    delete?: Prisma.WithdrawalRequestWhereInput | boolean;
    connect?: Prisma.WithdrawalRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInput, Prisma.WithdrawalRequestUpdateWithoutPayoutInput>, Prisma.WithdrawalRequestUncheckedUpdateWithoutPayoutInput>;
};
export type WithdrawalRequestCreateWithoutPayoutInput = {
    id?: string;
    derivId: string;
    amount: number;
    amountNgn: number;
    currency?: string;
    derivRef?: string | null;
    createdAt?: Date | string;
    status?: $Enums.WithdrawalStatus;
};
export type WithdrawalRequestUncheckedCreateWithoutPayoutInput = {
    id?: string;
    derivId: string;
    amount: number;
    amountNgn: number;
    currency?: string;
    derivRef?: string | null;
    createdAt?: Date | string;
    status?: $Enums.WithdrawalStatus;
};
export type WithdrawalRequestCreateOrConnectWithoutPayoutInput = {
    where: Prisma.WithdrawalRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.WithdrawalRequestCreateWithoutPayoutInput, Prisma.WithdrawalRequestUncheckedCreateWithoutPayoutInput>;
};
export type WithdrawalRequestUpsertWithoutPayoutInput = {
    update: Prisma.XOR<Prisma.WithdrawalRequestUpdateWithoutPayoutInput, Prisma.WithdrawalRequestUncheckedUpdateWithoutPayoutInput>;
    create: Prisma.XOR<Prisma.WithdrawalRequestCreateWithoutPayoutInput, Prisma.WithdrawalRequestUncheckedCreateWithoutPayoutInput>;
    where?: Prisma.WithdrawalRequestWhereInput;
};
export type WithdrawalRequestUpdateToOneWithWhereWithoutPayoutInput = {
    where?: Prisma.WithdrawalRequestWhereInput;
    data: Prisma.XOR<Prisma.WithdrawalRequestUpdateWithoutPayoutInput, Prisma.WithdrawalRequestUncheckedUpdateWithoutPayoutInput>;
};
export type WithdrawalRequestUpdateWithoutPayoutInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    derivId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    amountNgn?: Prisma.FloatFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    derivRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus;
};
export type WithdrawalRequestUncheckedUpdateWithoutPayoutInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    derivId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    amountNgn?: Prisma.FloatFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    derivRef?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWithdrawalStatusFieldUpdateOperationsInput | $Enums.WithdrawalStatus;
};
export type WithdrawalRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    derivId?: boolean;
    amount?: boolean;
    amountNgn?: boolean;
    currency?: boolean;
    derivRef?: boolean;
    createdAt?: boolean;
    status?: boolean;
    payout?: boolean | Prisma.WithdrawalRequest$payoutArgs<ExtArgs>;
}, ExtArgs["result"]["withdrawalRequest"]>;
export type WithdrawalRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    derivId?: boolean;
    amount?: boolean;
    amountNgn?: boolean;
    currency?: boolean;
    derivRef?: boolean;
    createdAt?: boolean;
    status?: boolean;
}, ExtArgs["result"]["withdrawalRequest"]>;
export type WithdrawalRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    derivId?: boolean;
    amount?: boolean;
    amountNgn?: boolean;
    currency?: boolean;
    derivRef?: boolean;
    createdAt?: boolean;
    status?: boolean;
}, ExtArgs["result"]["withdrawalRequest"]>;
export type WithdrawalRequestSelectScalar = {
    id?: boolean;
    derivId?: boolean;
    amount?: boolean;
    amountNgn?: boolean;
    currency?: boolean;
    derivRef?: boolean;
    createdAt?: boolean;
    status?: boolean;
};
export type WithdrawalRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "derivId" | "amount" | "amountNgn" | "currency" | "derivRef" | "createdAt" | "status", ExtArgs["result"]["withdrawalRequest"]>;
export type WithdrawalRequestInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    payout?: boolean | Prisma.WithdrawalRequest$payoutArgs<ExtArgs>;
};
export type WithdrawalRequestIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type WithdrawalRequestIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $WithdrawalRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WithdrawalRequest";
    objects: {
        payout: Prisma.$PayoutPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        derivId: string;
        amount: number;
        amountNgn: number;
        currency: string;
        derivRef: string | null;
        createdAt: Date;
        status: $Enums.WithdrawalStatus;
    }, ExtArgs["result"]["withdrawalRequest"]>;
    composites: {};
};
export type WithdrawalRequestGetPayload<S extends boolean | null | undefined | WithdrawalRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload, S>;
export type WithdrawalRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WithdrawalRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WithdrawalRequestCountAggregateInputType | true;
};
export interface WithdrawalRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WithdrawalRequest'];
        meta: {
            name: 'WithdrawalRequest';
        };
    };
    /**
     * Find zero or one WithdrawalRequest that matches the filter.
     * @param {WithdrawalRequestFindUniqueArgs} args - Arguments to find a WithdrawalRequest
     * @example
     * // Get one WithdrawalRequest
     * const withdrawalRequest = await prisma.withdrawalRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WithdrawalRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, WithdrawalRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WithdrawalRequestClient<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one WithdrawalRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WithdrawalRequestFindUniqueOrThrowArgs} args - Arguments to find a WithdrawalRequest
     * @example
     * // Get one WithdrawalRequest
     * const withdrawalRequest = await prisma.withdrawalRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WithdrawalRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WithdrawalRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WithdrawalRequestClient<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first WithdrawalRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalRequestFindFirstArgs} args - Arguments to find a WithdrawalRequest
     * @example
     * // Get one WithdrawalRequest
     * const withdrawalRequest = await prisma.withdrawalRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WithdrawalRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, WithdrawalRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__WithdrawalRequestClient<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first WithdrawalRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalRequestFindFirstOrThrowArgs} args - Arguments to find a WithdrawalRequest
     * @example
     * // Get one WithdrawalRequest
     * const withdrawalRequest = await prisma.withdrawalRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WithdrawalRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WithdrawalRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WithdrawalRequestClient<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more WithdrawalRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WithdrawalRequests
     * const withdrawalRequests = await prisma.withdrawalRequest.findMany()
     *
     * // Get first 10 WithdrawalRequests
     * const withdrawalRequests = await prisma.withdrawalRequest.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const withdrawalRequestWithIdOnly = await prisma.withdrawalRequest.findMany({ select: { id: true } })
     *
     */
    findMany<T extends WithdrawalRequestFindManyArgs>(args?: Prisma.SelectSubset<T, WithdrawalRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a WithdrawalRequest.
     * @param {WithdrawalRequestCreateArgs} args - Arguments to create a WithdrawalRequest.
     * @example
     * // Create one WithdrawalRequest
     * const WithdrawalRequest = await prisma.withdrawalRequest.create({
     *   data: {
     *     // ... data to create a WithdrawalRequest
     *   }
     * })
     *
     */
    create<T extends WithdrawalRequestCreateArgs>(args: Prisma.SelectSubset<T, WithdrawalRequestCreateArgs<ExtArgs>>): Prisma.Prisma__WithdrawalRequestClient<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many WithdrawalRequests.
     * @param {WithdrawalRequestCreateManyArgs} args - Arguments to create many WithdrawalRequests.
     * @example
     * // Create many WithdrawalRequests
     * const withdrawalRequest = await prisma.withdrawalRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends WithdrawalRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, WithdrawalRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many WithdrawalRequests and returns the data saved in the database.
     * @param {WithdrawalRequestCreateManyAndReturnArgs} args - Arguments to create many WithdrawalRequests.
     * @example
     * // Create many WithdrawalRequests
     * const withdrawalRequest = await prisma.withdrawalRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many WithdrawalRequests and only return the `id`
     * const withdrawalRequestWithIdOnly = await prisma.withdrawalRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends WithdrawalRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WithdrawalRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a WithdrawalRequest.
     * @param {WithdrawalRequestDeleteArgs} args - Arguments to delete one WithdrawalRequest.
     * @example
     * // Delete one WithdrawalRequest
     * const WithdrawalRequest = await prisma.withdrawalRequest.delete({
     *   where: {
     *     // ... filter to delete one WithdrawalRequest
     *   }
     * })
     *
     */
    delete<T extends WithdrawalRequestDeleteArgs>(args: Prisma.SelectSubset<T, WithdrawalRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__WithdrawalRequestClient<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one WithdrawalRequest.
     * @param {WithdrawalRequestUpdateArgs} args - Arguments to update one WithdrawalRequest.
     * @example
     * // Update one WithdrawalRequest
     * const withdrawalRequest = await prisma.withdrawalRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends WithdrawalRequestUpdateArgs>(args: Prisma.SelectSubset<T, WithdrawalRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__WithdrawalRequestClient<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more WithdrawalRequests.
     * @param {WithdrawalRequestDeleteManyArgs} args - Arguments to filter WithdrawalRequests to delete.
     * @example
     * // Delete a few WithdrawalRequests
     * const { count } = await prisma.withdrawalRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends WithdrawalRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, WithdrawalRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more WithdrawalRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WithdrawalRequests
     * const withdrawalRequest = await prisma.withdrawalRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends WithdrawalRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, WithdrawalRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more WithdrawalRequests and returns the data updated in the database.
     * @param {WithdrawalRequestUpdateManyAndReturnArgs} args - Arguments to update many WithdrawalRequests.
     * @example
     * // Update many WithdrawalRequests
     * const withdrawalRequest = await prisma.withdrawalRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more WithdrawalRequests and only return the `id`
     * const withdrawalRequestWithIdOnly = await prisma.withdrawalRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends WithdrawalRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WithdrawalRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one WithdrawalRequest.
     * @param {WithdrawalRequestUpsertArgs} args - Arguments to update or create a WithdrawalRequest.
     * @example
     * // Update or create a WithdrawalRequest
     * const withdrawalRequest = await prisma.withdrawalRequest.upsert({
     *   create: {
     *     // ... data to create a WithdrawalRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WithdrawalRequest we want to update
     *   }
     * })
     */
    upsert<T extends WithdrawalRequestUpsertArgs>(args: Prisma.SelectSubset<T, WithdrawalRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__WithdrawalRequestClient<runtime.Types.Result.GetResult<Prisma.$WithdrawalRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of WithdrawalRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalRequestCountArgs} args - Arguments to filter WithdrawalRequests to count.
     * @example
     * // Count the number of WithdrawalRequests
     * const count = await prisma.withdrawalRequest.count({
     *   where: {
     *     // ... the filter for the WithdrawalRequests we want to count
     *   }
     * })
    **/
    count<T extends WithdrawalRequestCountArgs>(args?: Prisma.Subset<T, WithdrawalRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WithdrawalRequestCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a WithdrawalRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WithdrawalRequestAggregateArgs>(args: Prisma.Subset<T, WithdrawalRequestAggregateArgs>): Prisma.PrismaPromise<GetWithdrawalRequestAggregateType<T>>;
    /**
     * Group by WithdrawalRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WithdrawalRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends WithdrawalRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WithdrawalRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: WithdrawalRequestGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WithdrawalRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWithdrawalRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the WithdrawalRequest model
     */
    readonly fields: WithdrawalRequestFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for WithdrawalRequest.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__WithdrawalRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    payout<T extends Prisma.WithdrawalRequest$payoutArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WithdrawalRequest$payoutArgs<ExtArgs>>): Prisma.Prisma__PayoutClient<runtime.Types.Result.GetResult<Prisma.$PayoutPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the WithdrawalRequest model
 */
export interface WithdrawalRequestFieldRefs {
    readonly id: Prisma.FieldRef<"WithdrawalRequest", 'String'>;
    readonly derivId: Prisma.FieldRef<"WithdrawalRequest", 'String'>;
    readonly amount: Prisma.FieldRef<"WithdrawalRequest", 'Float'>;
    readonly amountNgn: Prisma.FieldRef<"WithdrawalRequest", 'Float'>;
    readonly currency: Prisma.FieldRef<"WithdrawalRequest", 'String'>;
    readonly derivRef: Prisma.FieldRef<"WithdrawalRequest", 'String'>;
    readonly createdAt: Prisma.FieldRef<"WithdrawalRequest", 'DateTime'>;
    readonly status: Prisma.FieldRef<"WithdrawalRequest", 'WithdrawalStatus'>;
}
/**
 * WithdrawalRequest findUnique
 */
export type WithdrawalRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * Filter, which WithdrawalRequest to fetch.
     */
    where: Prisma.WithdrawalRequestWhereUniqueInput;
};
/**
 * WithdrawalRequest findUniqueOrThrow
 */
export type WithdrawalRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * Filter, which WithdrawalRequest to fetch.
     */
    where: Prisma.WithdrawalRequestWhereUniqueInput;
};
/**
 * WithdrawalRequest findFirst
 */
export type WithdrawalRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * Filter, which WithdrawalRequest to fetch.
     */
    where?: Prisma.WithdrawalRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WithdrawalRequests to fetch.
     */
    orderBy?: Prisma.WithdrawalRequestOrderByWithRelationInput | Prisma.WithdrawalRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WithdrawalRequests.
     */
    cursor?: Prisma.WithdrawalRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WithdrawalRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WithdrawalRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WithdrawalRequests.
     */
    distinct?: Prisma.WithdrawalRequestScalarFieldEnum | Prisma.WithdrawalRequestScalarFieldEnum[];
};
/**
 * WithdrawalRequest findFirstOrThrow
 */
export type WithdrawalRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * Filter, which WithdrawalRequest to fetch.
     */
    where?: Prisma.WithdrawalRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WithdrawalRequests to fetch.
     */
    orderBy?: Prisma.WithdrawalRequestOrderByWithRelationInput | Prisma.WithdrawalRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WithdrawalRequests.
     */
    cursor?: Prisma.WithdrawalRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WithdrawalRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WithdrawalRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WithdrawalRequests.
     */
    distinct?: Prisma.WithdrawalRequestScalarFieldEnum | Prisma.WithdrawalRequestScalarFieldEnum[];
};
/**
 * WithdrawalRequest findMany
 */
export type WithdrawalRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * Filter, which WithdrawalRequests to fetch.
     */
    where?: Prisma.WithdrawalRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WithdrawalRequests to fetch.
     */
    orderBy?: Prisma.WithdrawalRequestOrderByWithRelationInput | Prisma.WithdrawalRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing WithdrawalRequests.
     */
    cursor?: Prisma.WithdrawalRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WithdrawalRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WithdrawalRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WithdrawalRequests.
     */
    distinct?: Prisma.WithdrawalRequestScalarFieldEnum | Prisma.WithdrawalRequestScalarFieldEnum[];
};
/**
 * WithdrawalRequest create
 */
export type WithdrawalRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * The data needed to create a WithdrawalRequest.
     */
    data: Prisma.XOR<Prisma.WithdrawalRequestCreateInput, Prisma.WithdrawalRequestUncheckedCreateInput>;
};
/**
 * WithdrawalRequest createMany
 */
export type WithdrawalRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many WithdrawalRequests.
     */
    data: Prisma.WithdrawalRequestCreateManyInput | Prisma.WithdrawalRequestCreateManyInput[];
};
/**
 * WithdrawalRequest createManyAndReturn
 */
export type WithdrawalRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * The data used to create many WithdrawalRequests.
     */
    data: Prisma.WithdrawalRequestCreateManyInput | Prisma.WithdrawalRequestCreateManyInput[];
};
/**
 * WithdrawalRequest update
 */
export type WithdrawalRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * The data needed to update a WithdrawalRequest.
     */
    data: Prisma.XOR<Prisma.WithdrawalRequestUpdateInput, Prisma.WithdrawalRequestUncheckedUpdateInput>;
    /**
     * Choose, which WithdrawalRequest to update.
     */
    where: Prisma.WithdrawalRequestWhereUniqueInput;
};
/**
 * WithdrawalRequest updateMany
 */
export type WithdrawalRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update WithdrawalRequests.
     */
    data: Prisma.XOR<Prisma.WithdrawalRequestUpdateManyMutationInput, Prisma.WithdrawalRequestUncheckedUpdateManyInput>;
    /**
     * Filter which WithdrawalRequests to update
     */
    where?: Prisma.WithdrawalRequestWhereInput;
    /**
     * Limit how many WithdrawalRequests to update.
     */
    limit?: number;
};
/**
 * WithdrawalRequest updateManyAndReturn
 */
export type WithdrawalRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * The data used to update WithdrawalRequests.
     */
    data: Prisma.XOR<Prisma.WithdrawalRequestUpdateManyMutationInput, Prisma.WithdrawalRequestUncheckedUpdateManyInput>;
    /**
     * Filter which WithdrawalRequests to update
     */
    where?: Prisma.WithdrawalRequestWhereInput;
    /**
     * Limit how many WithdrawalRequests to update.
     */
    limit?: number;
};
/**
 * WithdrawalRequest upsert
 */
export type WithdrawalRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * The filter to search for the WithdrawalRequest to update in case it exists.
     */
    where: Prisma.WithdrawalRequestWhereUniqueInput;
    /**
     * In case the WithdrawalRequest found by the `where` argument doesn't exist, create a new WithdrawalRequest with this data.
     */
    create: Prisma.XOR<Prisma.WithdrawalRequestCreateInput, Prisma.WithdrawalRequestUncheckedCreateInput>;
    /**
     * In case the WithdrawalRequest was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.WithdrawalRequestUpdateInput, Prisma.WithdrawalRequestUncheckedUpdateInput>;
};
/**
 * WithdrawalRequest delete
 */
export type WithdrawalRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
    /**
     * Filter which WithdrawalRequest to delete.
     */
    where: Prisma.WithdrawalRequestWhereUniqueInput;
};
/**
 * WithdrawalRequest deleteMany
 */
export type WithdrawalRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which WithdrawalRequests to delete
     */
    where?: Prisma.WithdrawalRequestWhereInput;
    /**
     * Limit how many WithdrawalRequests to delete.
     */
    limit?: number;
};
/**
 * WithdrawalRequest.payout
 */
export type WithdrawalRequest$payoutArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payout
     */
    select?: Prisma.PayoutSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payout
     */
    omit?: Prisma.PayoutOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PayoutInclude<ExtArgs> | null;
    where?: Prisma.PayoutWhereInput;
};
/**
 * WithdrawalRequest without action
 */
export type WithdrawalRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WithdrawalRequest
     */
    select?: Prisma.WithdrawalRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the WithdrawalRequest
     */
    omit?: Prisma.WithdrawalRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.WithdrawalRequestInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=WithdrawalRequest.d.ts.map