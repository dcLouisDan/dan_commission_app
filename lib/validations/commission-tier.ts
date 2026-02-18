import { z } from "zod";
import { imageSchema } from "./commission";

export const formSchema = z.object({
    category: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
    price_php: z.coerce.number<string>(),
    price_usd: z.coerce.number<string>(),
    slot_limit: z.coerce.number<string>(),
    thumbnail: imageSchema,
    variant: z.string().min(1),
})

export type FormInput = z.input<typeof formSchema>
export type FormOutput = z.output<typeof formSchema>