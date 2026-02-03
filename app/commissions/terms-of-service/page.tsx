import { TypographyH1, TypographyH2, TypographyH3, TypographyH4 } from "@/components/typography";
import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="space-y-6">
            <TypographyH1>Terms of Service</TypographyH1>
            <p>By commissioning me, you acknowledge that you have read, understood, and agreed to the terms below.</p>
            <TypographyH3>1. General Terms</TypographyH3>
            <ul className="list-disc space-y-4 pl-6">
                <li><span className="font-semibold">Acceptance:</span> I reserve the right to decline any commission request without providing a reason.</li>
                <li><span className="font-semibold">Communication:</span> All correspondence should be conducted via email or the platform's messaging system. Please allow 24-48 hours for a response.</li>
                <li><span className="font-semibold">Age Restriction:</span> You must be legally able to enter into a contract. I strictly do <strong>NOT</strong> accept NSFW commissions.</li>
                <li><span className="font-semibold">Medium & Subject:</span> I specialize in <strong>CHARACTER ART</strong>. All artwork is digital, hand-drawn using a pen tablet and professional drawing software.</li>
                <li><span className="font-semibold">No Physical Items:</span> I only provide digital files; no physical paintings, prints, or items will be shipped.</li>
            </ul>
            <TypographyH3>2. Payment & Refunds</TypographyH3>
            <ul className="list-disc space-y-4 pl-6">
                <li><span className="font-semibold">Currency:</span> Primary currency is <strong>Philippine Peso (PHP)</strong>. Payments are processed securely via <strong>Xendit</strong> (accepts GCash, Maya, Credit/Debit Cards, and Bank Transfer).</li>
                <li><span className="font-semibold">Payment Structure:</span>
                    <ul className="list-disc space-y-2 pl-6">
                        <li><span className="font-semibold">Upfront:</span> 100% payment required for commissions under <strong>₱5,000</strong>.</li>
                        <li><span className="font-semibold">Split Payment:</span> 50% non-refundable deposit to start, remaining 50% before file delivery for larger projects.</li>
                    </ul>
                </li>
                <li><span className="font-semibold">Refunds:</span>
                    <ul className="list-disc space-y-2 pl-6">
                        <li><span className="font-semibold">Before Start:</span> 100% refund if I have not started working on your commission.</li>
                        <li><span className="font-semibold">After Sketch:</span> 50% refund if cancelled after the sketch phase.</li>
                        <li><span className="font-semibold">After Lineart/Coloring:</span> No refunds once the artwork has passed the sketch approval stage.</li>
                    </ul>
                </li>
                <li><span className="font-semibold">Chargebacks:</span> Any unauthorized chargebacks will result in an immediate blacklist. I retain the right to dispute the chargeback with evidence of work documented.</li>
                <li><span className="font-semibold">Kill Fee:</span> If a project is cancelled by the client halfway through for reasons unrelated to my performance, the non-refundable deposit serves as the kill fee to cover time lost.</li>
            </ul>

            <TypographyH3>3. Intellectual Property (IP) Rights</TypographyH3>
            <TypographyH4>3.1 Artist Rights</TypographyH4>
            <ul className="list-disc space-y-2 pl-6">
                <li><span className="font-semibold">Copyright:</span> I retain the copyright and ownership of the artwork.</li>
                <li><span className="font-semibold">Portfolio Display:</span> I reserve the right to display the artwork in my portfolio, social media, and art books (unless a Non-Disclosure Agreement is signed for an additional fee).</li>
            </ul>
            <TypographyH4>3.2 Client Rights (Personal Use)</TypographyH4>
            <ul className="list-disc space-y-2 pl-6">
                <li><span className="font-semibold">Non-Exclusive License:</span> You receive a non-exclusive, non-transferable license to use the artwork for personal purposes.</li>
                <li><span className="font-semibold">Allowed:</span>
                    <ul className="list-disc space-y-2 pl-6">
                        <li>Posting on social media (with proper credit).</li>
                        <li>Printing for personal display.</li>
                        <li>Using as a profile picture/banner.</li>
                    </ul>
                </li>
                <li><span className="font-semibold">Prohibited:</span>
                    <ul className="list-disc space-y-2 pl-6">
                        <li>Reselling the artwork or prints.</li>
                        <li>Minting as NFT.</li>
                        <li>Using it for merchandise or commercial products without a Commercial License.</li>
                    </ul>
                </li>
            </ul>
            <TypographyH4>3.3 Commercial Use</TypographyH4>
            <ul className="list-disc space-y-2 pl-6">
                <li>Commercial rights must be discussed and purchased separately.</li>
                <li>Fees typically range from <strong>50% to 200%</strong> of the base price depending on the scale of distribution (e.g., indie game asset vs. mass-market merchandise).</li>
                <li>Commercial rights grant you the license to use the art for profit-generating activities but do not transfer copyright ownership unless explicitly bought out ("Full Buyout").</li>
            </ul>
            <TypographyH3>4. Revisions</TypographyH3>
            <ul className="list-disc space-y-2 pl-6">
                <li>Sketch Phase: Major changes to composition, pose, and elements are free.</li>
                <li>Final Phase: Minor color adjustments are free.</li>
                <li>Excessive Revisions: Any changes requested after approved stages that require significant redrawing will incur an additional fee (min. ₱500 per revision).</li>
            </ul>
            <TypographyH3>5. Deadlines & Rush Orders</TypographyH3>
            <ul className="list-disc space-y-2 pl-6">
                <li>Standard Turnaround: 1-3 weeks depending on complexity and queue.</li>
                <li>Rush Orders: If you need the artwork by a specific date, a **Rush Fee (25-50% surcharge)** will apply to prioritize your slot.</li>
            </ul>
            <TypographyH3>6. AI Generative Tools</TypographyH3>
            <ul className="list-disc space-y-2 pl-6">
                <li>Every piece is hand-drawn using a pen tablet. I do <strong>NOT</strong> use AI generative tools (Midjourney, Stable Diffusion, etc.) in any part of my workflow.</li>
                <li>You are strictly prohibited from feeding my artwork into AI training models.</li>
            </ul>

            <TypographyH3>7. Acceptance of Terms</TypographyH3>
            <p className="mt-4">
                By commissioning me, you acknowledge that you have read, understood, and agreed to the terms and conditions stated above. These policies are in place to ensure a fair and professional process for both artist and client.
            </p>
            <p className="mt-6 text-lg font-medium">
                Thank you for your interest and support! I look forward to collaborating with you and bringing your characters to life. If you are ready to proceed, please feel free to submit your commission request.
            </p>

            <div className="flex items-center justify-center">
                <Link href={"/commissions/new"} className="mt-6 text-lg font-medium border-b border-b-foreground border-dashed hover:border-b-foreground hover:border-solid">Submit Commission Request</Link>
            </div>

        </div>
    )
}