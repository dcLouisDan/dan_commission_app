"use client"
import * as z from "zod";
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    FieldGroup,
} from "@/components/ui/field"
import { IMAGE_SUBMIT_OPTIONS } from "@/lib/constants/commision-form";
import { formSchema, FormInput, FormOutput } from "@/lib/validations/commission";
import CustomerInfoSection, { CUSTOMER_INFO_FIELDS } from "./commission/form/customer-info-section";
import CommissionSpecsSection, { COMMISSION_SPECS_FIELDS } from "./commission/form/commission-specs-section";
import CreativeBriefSection, { CREATIVE_BRIEF_FIELDS } from "./commission/form/creative-brief-section";
import ReferenceImagesSection, { REFERENCE_IMAGES_FIELDS } from "./commission/form/reference-images-section";
import CostSummarySidebar from "./commission/form/cost-summary-sidebar";
import useBasicPagination from "@/hooks/use-basic-pagination";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Spinner } from "./ui/spinner";

const MAX_PAGES = 5

export default function CommissionForm() {
    const { page, next, prev, hasNext, hasPrev, setPage } = useBasicPagination(MAX_PAGES)
    const [isValidatingPage, setIsValidatingPage] = useState(false)
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
            direct_upload_images: undefined,
            image_links: undefined,
            tos_agreed: false,
            deposit_agreed: false,
        }
    })

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }

    const validatePage = useCallback(async () => {
        setIsValidatingPage(true)
        switch (page) {
            case 1:
                return await form.trigger(CUSTOMER_INFO_FIELDS)
            case 2:
                return await form.trigger(COMMISSION_SPECS_FIELDS)
            case 3:
                return await form.trigger(CREATIVE_BRIEF_FIELDS)
            case 4:
                return await form.trigger(REFERENCE_IMAGES_FIELDS)
            case 5:
                return form.formState.isValid
            default:
                return false
        }
    }, [page, form])

    const getSection = () => {
        switch (page) {
            case 1:
                return <CustomerInfoSection />
            case 2:
                return <CommissionSpecsSection />
            case 3:
                return <CreativeBriefSection />
            case 4:
                return <ReferenceImagesSection />
            case 5:
                return <CostSummarySidebar />
            default:
                return <CustomerInfoSection />
        }
    }

    console.log("errors", form.formState.errors)
    console.log("values", form.getValues("image_links"))

    return (
        <FormProvider {...form}>
            <form id="commission-form" onSubmit={form.handleSubmit(handleSubmit)}>
                <FieldGroup>
                    <div className="flex items-center justify-between">
                        <Button disabled={!hasPrev} variant="outline" size="lg" type="button" onClick={prev}><ChevronLeft /> Back</Button>
                        <div className="flex items-center justify-center gap-2">
                            {Array.from({ length: MAX_PAGES }).map((_, i) => (
                                <Button key={i} variant={page == i + 1 ? "default" : "outline"} size="icon" className="rounded-full hidden sm:block" type="button" onClick={() => setPage(i + 1)}>{i + 1}</Button>
                            ))}
                        </div>
                        <Button disabled={!hasNext || isValidatingPage} size="lg" type="button" onClick={async () => {
                            if (await validatePage()) {
                                next()
                            }
                            setIsValidatingPage(false)
                        }}>Next {isValidatingPage ? <Spinner /> : <ChevronRight />}</Button>
                    </div>
                    {getSection()}
                </FieldGroup>
            </form>
        </FormProvider>
    );
}