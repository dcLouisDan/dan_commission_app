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
