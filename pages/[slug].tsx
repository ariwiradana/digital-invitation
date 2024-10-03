import Theme1 from "@/components/theme1/theme1";
import { ClientV2 } from "@/lib/types";
import { GetServerSideProps } from "next";
import React, { FC } from "react";

interface Props {
  client: ClientV2;
  to: string;
}

const MainPage: FC<Props> = (props) => {
  if (!props.client) return <div>Not Found</div>;
  return <Theme1 client={props.client} to={props.to} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  const { to } = context.query!;
  let client = null;

  const apiBaseURL = process.env.API_BASE_URL;

  const response = await fetch(`${apiBaseURL}/api/clientv2?slug=${slug}`);

  if (response.ok) {
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      client = result.data[0];
    }
  }

  return {
    props: {
      client,
      to: to ?? "",
    },
  };
};

export default MainPage;
