import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FIELD_PLACEHOLDERS } from "@/lib/constants/commision-form"
import { FormInput } from "@/lib/validations/commission"
import { useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"

export default function CreativeBriefSection() {
    const form = useFormContext<FormInput>()
    const hasBackgroundAddon = useMemo(() => form.watch("other_addons").some((addon) => addon.id?.includes("background")), [form.watch("other_addons")])

    return (

        <FieldSet>
            <FieldLegend>The Creative Brief</FieldLegend>
            <FieldDescription>Tell me about your character and the vision you have for this commission.</FieldDescription>
            <FieldGroup>
                <Controller
                    name="character_name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Character Name(s)</FieldLabel>
                            <Input {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.character_name} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="character_physical_desc"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Character Physical Description</FieldLabel>
                            <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.character_physical_desc} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="character_personality"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Character Personality</FieldLabel>
                            <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.character_personality} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="character_pose"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Character Pose</FieldLabel>
                            <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.character_pose} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="character_setting"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Character {hasBackgroundAddon ? "Background Setting" : "Background Color"}</FieldLabel>
                            <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.character_setting(hasBackgroundAddon)} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="character_lighting"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Character Lighting</FieldLabel>
                            <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.character_lighting} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>
        </FieldSet>
    )
}