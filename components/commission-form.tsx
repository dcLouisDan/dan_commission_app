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
import SubmissionSummarySection from "./commission/form/submission-summary-section";
import useBasicPagination from "@/hooks/use-basic-pagination";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense, useCallback, useState } from "react";
import { Spinner } from "./ui/spinner";
import { cn } from "@/lib/utils";
import { createCommissionAction } from "@/actions/commission-actions";
import { toast } from "sonner";

const MAX_PAGES = 5

const PAGE_FIELDS = {
    1: CUSTOMER_INFO_FIELDS,
    2: COMMISSION_SPECS_FIELDS,
    3: CREATIVE_BRIEF_FIELDS,
    4: REFERENCE_IMAGES_FIELDS,
    5: []
}

export default function CommissionForm() {
    const { page, next, prev, hasNext, hasPrev } = useBasicPagination(MAX_PAGES)
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
            google_drive_folder: "",
            direct_upload_images: [],
            image_links: [],
            tos_agreed: false,
            deposit_agreed: false,
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const result = await createCommissionAction(data)
        if (!result.ok) {
            toast.error(result.error.message)
            return
        }
        toast.success("Commission created successfully")
        form.reset()
    }

    const validatePage = useCallback(async () => {
        setIsValidatingPage(true)
        if (page === MAX_PAGES) {
            return form.formState.isValid
        }
        return await form.trigger(PAGE_FIELDS[page as keyof typeof PAGE_FIELDS])
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
                return <Suspense fallback={<Spinner />}>
                    <SubmissionSummarySection />
                </Suspense>
            default:
                return <CustomerInfoSection />
        }
    }
    console.log(form.formState.errors)

    return (
        <FormProvider {...form}>
            <form id="commission-form" onSubmit={form.handleSubmit(handleSubmit)}>
                <FieldGroup>
                    <div className="flex items-center justify-between">
                        <Button disabled={!hasPrev} variant="outline" size="lg" type="button" onClick={prev}><ChevronLeft /> Back</Button>
                        <div className="hidden sm:flex items-center justify-center gap-2">
                            {Array.from({ length: MAX_PAGES }).map((_, i) => (
                                <div key={i} className={cn("rounded-full h-10 w-10 border relative flex items-center justify-center text-muted-foreground", page === i + 1 && "bg-primary text-primary-foreground")}>{i + 1}</div>
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