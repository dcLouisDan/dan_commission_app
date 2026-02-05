import { BasicSelectItem, stringArrayToBasicSelectItems } from "@/components/basic-select";
import { Constants } from "@/lib/types/supabase";
import { snakeCaseToTitleCase } from "../utils/string-utils";

export const SOCIAL_PLATFORMS = ['email', 'facebook_messenger', 'viber', 'twitter'] as const;

export const SOCIAL_PLATFORMS_SELECT_ITEMS: BasicSelectItem[] = stringArrayToBasicSelectItems(Array.from(SOCIAL_PLATFORMS), snakeCaseToTitleCase)

export const SOCIAL_PLATFORM_HANDLE_LABELS: Record<string, string> = {
    email: "Email Address",
    facebook_messenger: "Facebook Messenger ID",
    viber: "Viber Phone Number",
    twitter: "Twitter Handle"
}

export const PRIORITY_LEVELS_SELECT_ITEMS: BasicSelectItem[] = stringArrayToBasicSelectItems(Array.from(Constants.public.Enums.priority_level_enum))

export const IMAGE_SUBMIT_OPTIONS = ['direct_upload', 'google_drive_folder', 'image_links'] as const;
export const IMAGE_UPLOAD_LIMIT = 10;
export const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const FIELD_PLACEHOLDERS = {
    // Identity & Contact
    client_name: "What should I call you? (Your name or nickname)",
    client_email: "Where should I send updates and your final artwork?",
    social_platform: "Which platform is best to reach you on?",
    social_handle: "Your username so I can find you or tag you later!",
    // Technical Specs
    commission_type: "Select the illustration style that fits your vision.",
    priority_level: "When do you need this masterpiece finished?",
    addon_extra_characters: "Would you like to add more friends to the scene?",
    addon_extra_characters_count: "How many additional characters should I include?",
    addon_commercial: "Is this for a business, streaming, or commercial project?",
    intended_use: "Tell me a little about what this piece will be used for!",
    other_addons: "Any extra bells and whistles you'd like to add?",
    // Creative Brief
    character_name: "What is the name of the character I'll be drawing?",
    character_physical_desc: "Describe their hair, eyes, outfit, and any unique details I should know!",
    character_personality: "What are they like? This helps me capture their 'vibe' and soul!",
    character_pose: "How should they be standing or sitting? Feel free to be specific!",
    character_setting: (hasBackgroundAddon: boolean) => hasBackgroundAddon ? "Where does this take place? Describe the background or atmosphere." : "What color should the background be? It can be a solid color or a gradient.",
    character_lighting: "What's the mood? (e.g., warm sunset, dramatic shadows, soft indoor light)",
    image_submit_option: "Pick the easiest way for you to share your reference materials.",
    direct_upload_images: `Upload your reference files directly (up to ${IMAGE_UPLOAD_LIMIT} images).`,
    image_links: "Paste links to your reference images or mood boards here. Click on the plus button to add more links.",
    google_drive_folder: "Paste the link to your shared Google Drive folder here.",
    // TOS
    tos_agreed: "I have read and agree to the artist's Terms of Service.",
    deposit_agreed: "I agree to pay the non-refundable deposit to secure my spot and start the work.",
} as const