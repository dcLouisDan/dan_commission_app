import { NextRequest } from "next/server";

const DEFAULT_COUNTRY = "PH";
const VERCEL_COUNTRY_HEADER = "x-vercel-ip-country";

export function setLocationCookie(request: NextRequest) {
    const location = request.cookies.get("location")?.value
    if (!location) {
        const country = request.headers.get(VERCEL_COUNTRY_HEADER);
        if (country) {
            request.cookies.set("location", country);
        } else {
            request.cookies.set("location", DEFAULT_COUNTRY);
        }
    }
}