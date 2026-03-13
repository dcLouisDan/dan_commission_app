'use client'
import { useTierList } from "@/hooks/use-tier-list"
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function TierList() {
    const { tiers } = useTierList()

    return (
        <div className="flex flex-col gap-4 border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>Price (PHP)</TableHead>
                        <TableHead>Price (USD)</TableHead>
                        <TableHead>Is Active</TableHead>
                        <TableHead>Slot Limit</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tiers.map((tier) => (
                        <TableRow key={tier.id}>
                            <TableCell>{tier.category}</TableCell>
                            <TableCell>{tier.variant}</TableCell>
                            <TableCell>{tier.price_php}</TableCell>
                            <TableCell>{tier.price_usd}</TableCell>
                            <TableCell>
                                <Badge variant={tier.is_active ? "default" : "secondary"}>
                                    {tier.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>{tier.slot_limit}</TableCell>
                            <TableCell>
                                <Link href={`/admin/commission-tiers/edit/${tier.id}`} className={buttonVariants({ variant: "outline" })}>
                                    Edit
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}