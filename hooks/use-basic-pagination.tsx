import { useState } from "react"


export default function useBasicPagination(maxPage: number = 1) {
    const [page, setPage] = useState(1)
    const hasNext = page < maxPage
    const hasPrev = page > 1
    const next = () => setPage(prev => prev == maxPage ? maxPage : prev + 1)
    const prev = () => setPage(prev => prev <= 1 ? 1 : prev - 1)
    const reset = () => setPage(1)
    return { page, next, prev, reset, hasNext, hasPrev, setPage }
}