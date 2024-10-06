import { afacad } from "@/lib/fonts";
import React, { FC, ReactNode } from "react";
import { BiLoaderAlt } from "react-icons/bi";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: ReactNode;
  isLoading?: boolean;
}

const Button: FC<Props> = (props) => {
  return (
    <button
      {...props}
      className={`${afacad.className} ${
        props.disabled || props.isLoading ? "pointer-events-none" : ""
      } text-white bg-theme1-primary pl-4 pr-3 py-3 lg:pl-4 lg:pr-3 text-base flex items-center gap-x-3 lg:gap-x-4 relative overflow-hidden shadow-sm`}
    >
      <span className="absolute inset-0 bg-[url('/images/theme1/pattern2.png')] bg-cover bg-no-repeat opacity-5"></span>
      <span className="text-sm lg:text-base">{props.title}</span>
      <div className="w-5 lg:w-8 h-5 lg:h-8 bg-white text-theme1-primary flex justify-center items-center">
        <span>
          {props.isLoading ? (
            <BiLoaderAlt className="animate-spin" />
          ) : (
            props.icon
          )}
        </span>
      </div>
    </button>
  );
};

export default Button;
