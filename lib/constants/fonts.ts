import { Libre_Baskerville, Noto_Serif } from "next/font/google";

const notoSerif = Noto_Serif({ subsets: ["latin"] });
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"] });

export const FONTS = {
    notoSerif,
    libreBaskerville,
}