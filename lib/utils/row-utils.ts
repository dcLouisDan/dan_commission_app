import { BasicSelectItem } from "@/components/basic-select";

export function rowToSelectItem<T>(row: T, valueKey: string, labelKey: string, labelGetter?: (row: T) => string): BasicSelectItem {
    return {
        value: row[valueKey as keyof T] as string,
        label: labelGetter ? labelGetter(row) : row[labelKey as keyof T] as string,
    }
}

export function rowsToSelectItems<T>(rows: T[], valueKey: string, labelKey: string, labelGetter?: (row: T) => string): BasicSelectItem[] {
    return rows.map((row) => rowToSelectItem(row, valueKey, labelKey, labelGetter))
}