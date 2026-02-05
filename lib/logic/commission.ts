import { SystemSettings } from "@/hooks/use-system-settings"
import { FormInput } from "../validations/commission"
import { ACCEPTABLE_CURRENCY } from "../constants/app"
import { CostSummary } from "../types/commission"

export function calculateCostSummary(data: FormInput, settings: SystemSettings, currency: typeof ACCEPTABLE_CURRENCY[number] = 'PHP'): CostSummary {
    const summary: CostSummary = {
        base_price: 0,
        addons: [],
        subtotal: 0,
        tax: 0,
        xendit_fee: 0,
        rush_fee: 0,
        total: 0,
        deposit: 0,
    }

    const { commission_type, addon_extra_characters, addon_extra_characters_count, addon_commercial, priority_level, other_addons } = data
    const { commercial_multiplier, rush_multiplier, extra_character_multiplier, tax_rate, xendit_fee_fixed, xendit_fee_percent } = settings

    if (!commission_type) {
        return summary
    }

    const { price_php, price_usd } = commission_type

    if (!price_php || !price_usd) {
        return summary
    }

    const basePrice = currency === "PHP" ? price_php : price_usd
    let subtotal = basePrice;

    const count = Number(addon_extra_characters_count)
    if (addon_extra_characters && addon_extra_characters_count && count > 0 && extra_character_multiplier) {
        const addonPrice = basePrice * count * extra_character_multiplier
        subtotal += addonPrice
        summary.addons.push({
            name: `Extra Characters (${count})`,
            price: addonPrice
        })
    }

    if (addon_commercial && commercial_multiplier) {
        const addonPrice = basePrice * commercial_multiplier
        subtotal += addonPrice
        summary.addons.push({
            name: "Commercial Use",
            price: addonPrice
        })
    }

    if (other_addons && other_addons.length > 0) {
        other_addons.forEach((addon) => {
            const addonPrice = currency === "PHP" ? addon.price_php : addon.price_usd
            if (addon.title && addonPrice) {
                subtotal += addonPrice
                summary.addons.push({
                    name: addon.title,
                    price: addonPrice
                })
            }
        })
    }

    if (priority_level == "RUSH" && rush_multiplier) {
        const rushFee = subtotal * rush_multiplier
        summary.rush_fee = rushFee
    }

    summary.base_price = basePrice
    summary.subtotal = subtotal
    summary.tax = tax_rate ? subtotal * tax_rate : 0
    summary.xendit_fee = xendit_fee_percent ? subtotal * xendit_fee_percent : xendit_fee_fixed ? xendit_fee_fixed : 0
    summary.total = subtotal + summary.tax + summary.xendit_fee + summary.rush_fee
    summary.deposit = summary.total * 0.5


    return summary
}

