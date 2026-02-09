import { ACCEPTABLE_CURRENCY } from '@/lib/constants/app';
import Cookies from 'js-cookie'

export function useServerLocation() {
    const location = Cookies.get("location");
    const country = location ? location : "PH"
    const currency: typeof ACCEPTABLE_CURRENCY[number] = country === "PH" ? "PHP" : "USD"
    const isPH = country === "PH"
    return { location, country, currency, isPH };
}