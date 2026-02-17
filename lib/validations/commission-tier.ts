import { z } from "zod";
import { imageSchema } from "./commission";

export const formSchema = z.object({
    category: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
    price_php: z.number(),
    price_usd: z.number(),
    slot_limit: z.number(),
    thumbnail: imageSchema,
    variant: z.string().min(1),
})

export type FormInput = z.input<typeof formSchema>
export type FormOutput = z.output<typeof formSchema>