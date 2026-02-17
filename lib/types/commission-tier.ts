import { Database } from "./supabase";

export type CommissionTier = Database["public"]["Tables"]["commission_tiers"]["Row"]

export type CommissionTierInsert = Database["public"]["Tables"]["commission_tiers"]["Insert"]

export type CommissionTierUpdate = Database["public"]["Tables"]["commission_tiers"]["Update"]