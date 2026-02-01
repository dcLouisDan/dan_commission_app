import { Geist, Hubot_Sans, Libre_Baskerville, Mona_Sans, Noto_Serif } from "next/font/google";

const notoSerif = Noto_Serif({ subsets: ["latin"] });
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"] });
const geistSans = Geist({
    variable: "--font-geist-sans",
    display: "swap",
    subsets: ["latin"],
});
const hubotSans = Hubot_Sans({
    variable: "--font-hubot-sans",
    display: "swap",
    subsets: ["latin"],
});
const monaSans = Mona_Sans({
    variable: "--font-mona-sans",
    display: "swap",
    subsets: ["latin"],
});

export const FONTS = {
    notoSerif,
    libreBaskerville,
    geistSans,
    hubotSans,
    monaSans,
}