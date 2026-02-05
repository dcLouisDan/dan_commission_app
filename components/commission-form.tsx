"use client"
import * as z from "zod";
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    FieldGroup,
    FieldSeparator,
} from "@/components/ui/field"
import { Separator } from "./ui/separator";
import { IMAGE_SUBMIT_OPTIONS } from "@/lib/constants/commision-form";
import { formSchema, FormInput, FormOutput } from "@/lib/validations/commission";
import CustomerInfoSection from "./commission/form/customer-info-section";
import CommissionSpecsSection from "./commission/form/commission-specs-section";
import CreativeBriefSection from "./commission/form/creative-brief-section";
import ReferenceImagesSection from "./commission/form/reference-images-section";
import CostSummarySidebar from "./commission/form/cost-summary-sidebar";


export default function CommissionForm() {
    const form = useForm<FormInput, unknown, FormOutput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client_name: "",
            client_email: "",
            social_platform: "email",
            social_handle: "",
            commission_type: undefined,
            priority_level: "STANDARD",
            addon_extra_characters: false,
            addon_extra_characters_count: "0",
            addon_commercial: false,
            intended_use: "",
            other_addons: [],
            character_name: "",
            character_physical_desc: "",
            character_personality: "",
            character_pose: "",
            character_setting: "",
            character_lighting: "",
            image_submit_option: IMAGE_SUBMIT_OPTIONS[0],
            google_drive_folder: undefined,
            direct_upload_images: [],
            image_links: undefined,
            tos_agreed: false,
            deposit_agreed: false,
        }
    })

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }

    return (
        <FormProvider {...form}>
            <form id="commission-form" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex flex-col md:flex-row gap-4">
                    <FieldGroup>
                        <CustomerInfoSection />
                        <FieldSeparator />
                        <CommissionSpecsSection />
                        <FieldSeparator />
                        <CreativeBriefSection />
                        <Separator />
                        <ReferenceImagesSection />
                    </FieldGroup>
                    <CostSummarySidebar />
                </div>
            </form>
        </FormProvider>
    );
}