import * as z from "zod";
import { Constants } from "@/lib/types/supabase";

const formSchema = z.object({
    // Identity and Contant
    client_name: z.string().min(1, "Client name is required"),
    client_email: z.string().email("Invalid email"),
    preferred_social: z.string().min(1, "Preferred social is required"),
    social_contact: z.string().min(1, "Social contact is required"),
    // Technical Specs
    commission_type: z.string().min(1, "Commission type is required"),
    priority_level: z.enum(Constants.public.Enums.priority_level_enum),
})

export default function CommissionForm() {
    return (
        <form>
            <input type="text" />
        </form>
    );
}