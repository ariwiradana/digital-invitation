import {
  Comfortaa,
  Montserrat,
  Afacad,
  DM_Serif_Display,
  Marcellus,
  The_Nautigal,
} from "next/font/google";

export const comforta = Comfortaa({
  subsets: ["latin"],
});

export const montserrat = Montserrat({
  subsets: ["latin"],
});

export const afacad = Afacad({
  subsets: ["latin"],
});

export const dm = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
});

export const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
});

export const nautigal = The_Nautigal({
  subsets: ["latin"],
  weight: ["400", "700"],
});
