import { Database } from "./supabase";

export interface CommissionSummary {
    // Cost Breakdown
    base_price: number;
    addons: {
        name: string;
        price: number;
    }[];
    subtotal: number;
    tax: number;
    xendit_fee: number;
    rush_fee: number;
    total: number;
    deposit: number;
}

export type CommissionInsert = Database["public"]["Tables"]["commissions"]["Insert"]

export type Commission = Database["public"]["Tables"]["commissions"]["Row"]
