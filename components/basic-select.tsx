import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface BasicSelectItem {
    value: string
    label: string
}

interface BasicSelectProps {
    options: BasicSelectItem[]
    placeholder: string,
    className?: string
    disabled?: boolean
    value?: string
    onValueChange?: (value: string) => void
    defaultValue?: string
    ariaInvalid?: boolean
}

export function stringArrayToBasicSelectItems(arr: string[], transformFn?: (item: string) => string): BasicSelectItem[] {
    return arr.map((item) => ({ value: item, label: transformFn ? transformFn(item) : item }))
}

export default function BasicSelect({ options, placeholder = "Select an option", onValueChange, defaultValue, className, disabled, ariaInvalid, value }: BasicSelectProps) {
    return (
        <Select defaultValue={defaultValue} value={value} disabled={disabled} onValueChange={onValueChange}>
            <SelectTrigger aria-invalid={ariaInvalid} className={cn("w-full", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{placeholder}</SelectLabel>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
