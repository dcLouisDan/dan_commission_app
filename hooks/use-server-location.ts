import { cookies } from "next/headers";

export async function useServerLocation() {
    const location = (await cookies()).get("location")?.value;
    return location;
}