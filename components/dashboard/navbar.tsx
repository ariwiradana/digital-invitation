import { afacad } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";
import React, {  useState } from "react";
import { BiMenu } from "react-icons/bi";
import Sidebar from "./sidebar";
import useDashboardStore from "@/lib/dashboardStore";

const navData: string[] = [
  "home",
  "fitur",
  "tema",
  "paket",
  "testimoni",
  "tentang kami",
];

const NavbarComponent = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const { activeSection } = useDashboardStore();

  const setActiveSection = useDashboardStore((state) => state.setActiveSection);

  const handleClick = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white fixed top-0 inset-x-0 z-30 shadow shadow-slate-100">
      <Sidebar
        navData={navData}
        open={isOpenSidebar}
        toggle={() => setIsOpenSidebar((state) => !state)}
      />
      <nav className={`${afacad.className} max-w-screen-xl mx-auto`}>
        <ul className="px-6 md:px-12 lg:px-24 flex items-center justify-between gap-8 h-16 md:h-20 lg:h-24">
          <li className="font-semibold text-dashboard-dark text-xl flex items-center gap-x-2 mr-8">
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
          <li className="flex justify-center items-center gap-x-8">
            {navData.map((title: string, index: number) => (
              <div className="hidden lg:flex group" key={title}>
                <button
                  onClick={() => handleClick(`section${index + 1}`)}
                  className={`text-base cursor-pointer relative text-dashboard-secondary duration-500 font-medium ease-in-out capitalize`}
                >
                  {title}
                  <div
                    className={`absolute group-hover:opacity-100 group-hover:-bottom-2 ${
                      activeSection === `section${index + 1}`
                        ? "opacity-100 -bottom-2"
                        : "opacity-0 -bottom-1"
                    }  left-1/2 transform -translate-x-1/2 w-3 h-[2px] bg-dashboard-primary rounded-full transition-all ease-in-out duration-500 delay-150`}
                  ></div>
                </button>
              </div>
            ))}
          </li>
          <li className="lg:hidden">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsOpenSidebar((state) => !state)}
                className="text-dashboard-primary border-dashboard-primary"
              >
                <BiMenu className="text-2xl" />
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default NavbarComponent;
