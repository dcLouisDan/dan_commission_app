import { BasicSelectItem, stringArrayToBasicSelectItems } from "@/components/basic-select";
import { Constants } from "@/lib/types/supabase";

export const SOCIAL_PLATFORMS_SELECT_ITEMS: BasicSelectItem[] = [
    {
        value: "email",
        label: "Email"
    },
    {
        value: "facebook_messenger",
        label: "Facebook Messenger"
    },
    {
        value: "viber",
        label: "Viber"
    },
    {
        value: "twitter",
        label: "Twitter"
    }
]

export const SOCIAL_PLATFORM_HANDLE_LABELS: Record<string, string> = {
    email: "Email Address",
    facebook_messenger: "Facebook Messenger ID",
    viber: "Viber Phone Number",
    twitter: "Twitter Handle"
}

export const PRIORITY_LEVELS_SELECT_ITEMS: BasicSelectItem[] = stringArrayToBasicSelectItems(Array.from(Constants.public.Enums.priority_level_enum))