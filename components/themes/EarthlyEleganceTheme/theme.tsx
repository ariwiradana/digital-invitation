import React, { FC } from "react";
import Layout from "../layout";
import Cover from "./layouts/cover";
import HeroComponent from "./layouts/hero";
import BridesComponent from "./layouts/brides";
import LocationTimeComponent from "./layouts/location.time";
import { Client } from "@/lib/types";
import useEarthlyEleganceTheme from "@/hooks/themes/useEarthlyEleganceTheme";
import GalleryGridComponent from "./layouts/gallery-grid";
interface Props {
  to: string;
  client: Client;
}

const ThemeComponent: FC<Props> = (props) => {
  const { state, actions } = useEarthlyEleganceTheme(props.client);

  return (
    <Layout
      pageTitle={
        props.client
          ? `${state.groom?.nickname} & ${state.bride?.nickname}`
          : "Meundang"
      }
    >
      <>
        <Cover actions={actions} state={state} to={props.to} />
        {state.open && (
          <div className="relative">
            <HeroComponent state={state} />
            <BridesComponent state={state} />
            <LocationTimeComponent state={state} />
            <GalleryGridComponent state={state} />
          </div>
        )}
      </>
    </Layout>
  );
};

export default ThemeComponent;
