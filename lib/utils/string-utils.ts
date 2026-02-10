export function snakeCaseToTitleCase(str: string) {
    return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatClientName(name: string) {
    return name.replace(/\s+/g, "_").toLowerCase()
}