import React, { ReactNode } from "react";
import { afacad, dm } from "@/lib/fonts";
import {
  BiCalendar,
  BiCalendarPlus,
  BiEdit,
  BiEnvelope,
  BiGlobe,
  BiGroup,
  BiImage,
  BiImageAdd,
  BiMap,
  BiMusic,
  BiParty,
  BiVideo,
} from "react-icons/bi";
import Link from "next/link";
import { HiArrowLongRight } from "react-icons/hi2";
import ButtonPrimary from "./elements/button.primary";

export type Feature = {
  title: string;
  icon: ReactNode;
  description: string;
};
export const featured: Feature[] = [
  {
    title: "Revisi Tidak Terbatas",
    icon: <BiEdit />,
    description:
      "Nikmati kemampuan untuk melakukan revisi tanpa batasan pada undangan Anda.",
  },
  {
    title: "Nama Tamu Tidak Terbatas",
    icon: <BiGroup />,
    description:
      "Tambahkan nama tamu sebanyak yang Anda inginkan tanpa batasan.",
  },
  {
    title: "Acara Tak Terbatas per Undangan",
    icon: <BiParty />,
    description:
      "Buat dan kelola berbagai acara dalam satu undangan tanpa batas.",
  },
  {
    title: "Galeri Foto",
    icon: <BiImage />,
    description: "Unggah hingga 20 foto untuk mempercantik undangan Anda.",
  },
  {
    title: "Rekaman Video",
    icon: <BiVideo />,
    description: "Sertakan hingga 2 video untuk menambahkan elemen multimedia.",
  },
  {
    title: "Kontak Media Sosial",
    icon: <BiGlobe />,
    description: "Integrasikan akun media sosial Anda untuk kemudahan akses.",
  },
  {
    title: "Musik Latar",
    icon: <BiMusic />,
    description: "Tambahkan musik latar untuk meningkatkan suasana undangan.",
  },
  {
    title: "RSVP & Ucapan",
    icon: <BiCalendar />,
    description: "Fasilitasi tamu untuk memberikan tanggapan dan ucapan.",
  },
  {
    title: "Lokasi Terintegrasi dengan Google Maps",
    icon: <BiMap />,
    description: "Tampilkan lokasi acara dengan integrasi Google Maps.",
  },
  {
    title: "Fitur Tambahkan ke Kalender",
    icon: <BiCalendarPlus />,
    description: "Izinkan tamu untuk menambahkan acara ke kalender mereka.",
  },
  {
    title: "Pilih Cover Foto Undangan",
    icon: <BiImageAdd />,
    description: "Pilih gambar penutup undangan yang sesuai dengan tema.",
  },
  {
    title: "Amplop Digital",
    icon: <BiEnvelope />,
    description: "Kirim undangan dalam bentuk amplop digital yang menarik.",
  },
];

const FeaturesComponent = () => {
  return (
    <section
      data-aos="fade-up"
      className="py-16 lg:py-24 relative"
      id="section2"
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 relative">
        <div className="flex justify-between items-center" data-aos="fade-up">
          <h1
            className={`${dm.className} text-2xl lg:text-4xl text-dashboard-dark`}
          >
            Fitur Undangan
          </h1>
          <Link href="/fitur">
            <div className="flex gap-x-2 items-center">
              <p className={`${afacad.className}`}>Semua Fitur</p>
              <HiArrowLongRight />
            </div>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 mt-6 gap-4">
          {featured.slice(0, 4).map((f: Feature) => (
            <div
              key={`feature-${f.title}`}
              data-aos="fade-up"
              data-aos-delay="200"
              className="p-8 bg-zinc-50 rounded flex flex-col justify-center items-center"
            >
              <div className="h-12 w-12 flex justify-center items-center bg-dashboard-primary text-3xl rounded">
                {f.icon}
              </div>
              <h2
                className={`${afacad.className} text-xl font-semibold text-dashboard-dark mt-4 text-center`}
              >
                {f.title}
              </h2>
              <h2
                className={`${afacad.className} text-dashboard-dark text-lg text-center mt-2`}
              >
                {f.description}
              </h2>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center md:hidden" data-aos="fade-up">
          <Link href="/fitur">
            <ButtonPrimary title="Lihat Semua Fitur" size="medium" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesComponent;
