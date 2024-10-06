import { Client } from "@/lib/types";
import React from "react";
import EarthlyEleganceTheme from "./Theme1/theme";

export const themes: Record<
  string,
  (client: Client, to: string) => JSX.Element
> = {
  "Earthly Elegance": (client: Client, to: string) => (
    <EarthlyEleganceTheme client={client} to={to} />
  ),
};
