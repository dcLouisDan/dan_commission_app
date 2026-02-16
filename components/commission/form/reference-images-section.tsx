
import { Controller } from "react-hook-form"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { snakeCaseToTitleCase } from "@/lib/utils/string-utils";
import { FolderOpen, Image, Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGE_SUBMIT_OPTIONS } from "@/lib/constants/commision-form";
import { FormInput, FormOutput } from "@/lib/validations/commission";
import { FIELD_PLACEHOLDERS } from "@/lib/constants/commision-form";
import { useFormContext } from "react-hook-form";
import MultiImageInput from "@/components/multi-image-input";

export const REFERENCE_IMAGES_FIELDS: (keyof FormInput)[] = [
    "image_submit_option",
    "google_drive_folder",
    "direct_upload_images",
    "image_links"
]

export default function ReferenceImagesSection() {
    const form = useFormContext<FormInput, unknown, FormOutput>();
    const onUploadMethodChange = () => {
        form.setValue("direct_upload_images", [])
        form.setValue("image_links", [""])
        form.setValue("google_drive_folder", "")
    }
    return (
        <FieldSet>
            <FieldLegend className="text-center">Reference Images</FieldLegend>
            <FieldDescription className="text-center">Upload reference images for your character.</FieldDescription>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Controller
                    name="image_submit_option"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Upload Method</FieldLabel>
                            <RadioGroup orientation="horizontal" defaultValue={IMAGE_SUBMIT_OPTIONS[0]} value={field.value} onValueChange={(value) => { onUploadMethodChange(); field.onChange(value) }}>
                                {IMAGE_SUBMIT_OPTIONS.map((option) => (<Field key={option} orientation="horizontal">
                                    <RadioGroupItem value={option} id={option} />
                                    <FieldLabel htmlFor={option}>{snakeCaseToTitleCase(option)}</FieldLabel>
                                </Field>))}
                            </RadioGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <div className="col-span-2">
                    {form.watch("image_submit_option") === "direct_upload" && <Controller
                        name="direct_upload_images"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="border bg-card p-4 rounded-md">
                                <FieldLabel><Image className="inline w-4 h-4" /> Upload Reference Images</FieldLabel>
                                <FieldDescription>{FIELD_PLACEHOLDERS.direct_upload_images}</FieldDescription>
                                <MultiImageInput images={field.value ?? []} setImages={field.onChange} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />}
                    {form.watch("image_submit_option") === "google_drive_folder" && <Controller
                        name="google_drive_folder"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="border bg-card p-4 rounded-md">
                                <FieldLabel><FolderOpen className="inline w-4 h-4" /> Google Drive Folder Link</FieldLabel>
                                <FieldDescription>{FIELD_PLACEHOLDERS.google_drive_folder}</FieldDescription>
                                <Input placeholder="https://drive.google.com/drive/folders/your-folder-id" {...field} value={(field.value as string) ?? ""} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />}
                    {form.watch("image_submit_option") === "image_links" && <Controller
                        name="image_links"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="border bg-card p-4 rounded-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <FieldLabel><LinkIcon className="inline w-4 h-4" /> Image Links</FieldLabel>
                                        <FieldDescription>{FIELD_PLACEHOLDERS.image_links}</FieldDescription>
                                    </div>
                                    <Button className="shrink-0" variant="secondary" type="button" size="icon" onClick={() => field.onChange([...(field.value as Array<string> || []), ""])}><Plus className="w-4 h-4" /></Button>
                                </div>
                                {
                                    (Array.isArray(field.value) ? field.value : [""]).map((link: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                placeholder="https://image.com/image.jpg"
                                                value={link}
                                                onChange={(e) => {
                                                    const currentLinks = Array.isArray(field.value) ? [...field.value] : [""];
                                                    currentLinks[index] = e.target.value;
                                                    field.onChange(currentLinks);
                                                }}
                                            />
                                            <Button
                                                disabled={(Array.isArray(field.value) ? field.value.length : 1) === 1}
                                                variant="ghost"
                                                type="button"
                                                size="icon"
                                                onClick={() => {
                                                    const currentLinks = Array.isArray(field.value) ? field.value : [""];
                                                    field.onChange(currentLinks.filter((_, i) => i !== index));
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                }
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />}
                </div>
            </div>
        </FieldSet>
    )
}