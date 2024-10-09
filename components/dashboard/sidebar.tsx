import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { afacad } from "@/lib/fonts";
import useDashboardStore from "@/lib/dashboardStore";
import {
  AiOutlineInstagram,
  AiOutlineMail,
  AiOutlineWhatsApp,
} from "react-icons/ai";

interface Props {
  open: boolean;
  navData: string[];
  toggle: () => void;
}

const Sidebar: FC<Props> = ({ open, toggle, navData }) => {
  const setActiveSection = useDashboardStore((state) => state.setActiveSection);
  const { activeSection } = useDashboardStore();

  const handleClick = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 50;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      onClick={toggle}
      className={`fixed z-30 inset-y-0 w-full bg-black bg-opacity-50 transition-all ease-in-out ${
        open
          ? "visible opacity-100 duration-300"
          : "invisible opacity-0 duration-300 delay-400"
      }`}
    >
      <ul
        onClick={(e) => e.stopPropagation()}
        className={`h-full bg-white ${
          open ? "w-[80%] delay-200" : "w-0"
        } transition-all duration-300`}
      >
        <li className="h-16 px-6 flex justify-between items-center mb-8">
          <Link href="/">
            <div className="relative w-16 md:w-20 aspect-video">
              <Image
                alt="logo"
                fill
                className="object-cover"
                src="/logo.png"
                sizes="100px"
              />
            </div>
          </Link>
        </li>
        {navData.map((title, index) => (
          <li className="w-full" key={`sidebar-${title}`}>
            <div
              onClick={() => {
                handleClick(`section${index + 1}`);
                toggle();
              }}
              className={`mx-6 py-3 px-4 my-2 rounded ${afacad.className} ${
                activeSection === `section${index + 1}`
                  ? "text-white bg-dashboard-dark"
                  : "text-dashboard-dark"
              }`}
            >
              <span className="capitalize">{title}</span>
            </div>
          </li>
        ))}
        <li
          className={`flex items-center gap-4 text-lg px-10 mt-16 text-dashboard-dark`}
        >
          <Link target="_blank" href="https://wa.me/+6281246768627">
            <AiOutlineWhatsApp />
          </Link>
          <Link target="_blank" href="https://instagram.com/moment">
            <AiOutlineInstagram />
          </Link>
          <Link target="_blank" href="mailto:moment.invitations@gmail.com">
            <AiOutlineMail />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
