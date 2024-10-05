import ThemeNotFound from "@/components/themes/theme.notfound";
import Loading from "@/components/themes/EarthlyEleganceTheme/elements/loading";
import { fetcher } from "@/lib/fetcher";
import { Client } from "@/lib/types";
import { GetServerSideProps } from "next";
import React, { FC, useEffect } from "react";
import useSWR from "swr";
import { themes } from "@/components/themes/themes";
import ClientNotFound from "@/components/themes/client.notfound";
import AOS from "aos";
import "aos/dist/aos.css";

interface Props {
  slug: string;
  to: string;
}

const MainPage: FC<Props> = (props) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 100,
    });
  }, []);

  const { data, error } = useSWR(
    props.slug ? `/api/client?slug=${props.slug}` : null,
    fetcher
  );

  const client: Client | null = data?.data?.length ? data.data[0] : null;

  if (!data && !error) return <Loading />;
  if (!client) return <ClientNotFound />;
  if (client.status === "unpaid") return <ClientNotFound />;

  const themeName = client.theme?.name || "";
  const ThemeComponent = themes[themeName];

  return ThemeComponent ? (
    ThemeComponent(client, props.to)
  ) : (
    <ThemeNotFound theme={themeName} />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { to } = context.query;
  const { slug } = context.params as { slug: string };

  return {
    props: {
      to: to ?? "",
      slug,
    },
  };
};

export default MainPage;
