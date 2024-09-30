import { Metadata } from "next";
import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  pageTitle: string;
}

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const Layout: FC<Props> = (props) => {
  return (
    <>
      <div className="w-full h-full flex justify-center">
        <div className="max-w-screen-sm w-full">{props.children}</div>
      </div>
    </>
  );
};

export default Layout;
