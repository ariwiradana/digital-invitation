import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useClient } from "@/lib/client";
import { Client, Option, Participant, Theme } from "@/lib/types";
import moment from "moment";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { upload } from "@vercel/blob/client";

const initialParticipants: Participant = {
  name: "",
  nickname: "",
  address: "",
  gender: "male",
  child: "pertama",
  parents_male: "",
  parents_female: "",
  role: "participant",
  image: null,
};

const initalFormData: Client = {
  name: "",
  address: "",
  address_full: "",
  address_url: "",
  date: moment().format("YYYY-MM-DD"),
  start_time: moment("06:00", "HH:mm").format("HH:mm"),
  end_time: moment("06:00", "HH:mm").format("HH:mm"),
  theme_id: null,
  status: "unpaid",
  participants: [initialParticipants],
  gallery: [],
};

export const useAdminCreateClient = () => {
  const [formData, setFormData] = useState<Client>(initalFormData);
  const [toggleEndTime, setToggleEndTime] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [themeOptions, setThemeOptions] = useState<Option[]>([
    {
      label: "",
      value: "",
    },
  ]);
  const router = useRouter();

  const { data: themes } = useSWR<{
    success: boolean;
    data: Theme[];
    total_rows: number;
  }>(`/api/themes`, fetcher);

  useEffect(() => {
    if (themes && themes.data.length > 0) {
      const options: Option[] = themes.data.map((theme) => ({
        label: theme.name,
        value: theme.id,
      }));
      setThemeOptions(options);
      setFormData((state) => ({
        ...state,
        theme_id: Number(options[0].value),
      }));
    }
  }, [themes]);

  const handleUploadGallery = async () => {
    const imageURLs: string[] = [];
    if (formData.gallery && formData.gallery.length > 0) {
      const MAX_SIZE = 2 * 1024 * 1024;

      let i = 0;

      if (formData.gallery instanceof FileList) {
        const images = formData.gallery;
        for (const image of Array.from(formData.gallery)) {
          i++;
          const toastUpload = toast.loading(
            `Uploading image ${i} of ${images.length}`
          );
          try {
            if (image.size > MAX_SIZE) {
              toast.error(`Image (${i}) size to large`, { id: toastUpload });
              continue;
            }
            const res = await fetch(`/api/upload-blob?filename=${image.name}`, {
              method: "POST",
              body: image,
            });
            const result = await res.json();
            if (result.success) {
              toast.success(
                `Image ${i} of ${images.length} uploaded successfully!`,
                { id: toastUpload }
              );
              imageURLs.push(result.data.url);
            }
          } catch (error: any) {
            toast.error(
              error.message || `Error uploading image ${i} of ${images.length}`,
              {
                id: toastUpload,
              }
            );
          }
        }
      }
    }
    return imageURLs;
  };

  const handletoggleEndTime = () => {
    setToggleEndTime(!toggleEndTime);
    setFormData((state) => ({
      ...state,
      end_time: toggleEndTime
        ? moment("06:00", "HH:mm").format("HH:mm")
        : "Selesai",
    }));
  };

  const handleChangeClient = (
    value: string | number | FileList,
    name: string
  ) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleAddAnotherParticipant = () => {
    setFormData((state) => ({
      ...state,
      participants: [...formData.participants, initialParticipants],
    }));
  };

  const handleChangeParticipant = (
    value: string | number | FileList,
    name: string,
    index: number
  ) => {
    let currentParticipants: Participant[] = [...formData.participants];

    currentParticipants[index] = {
      ...currentParticipants[index],
      [name]: value,
    };

    setFormData({
      ...formData,
      participants: currentParticipants,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const newGalleryURLs = await handleUploadGallery();

    const modifiedFormdata: Client = { ...formData };
    modifiedFormdata["gallery"] = newGalleryURLs;

    const createClient = useClient("/api/client", {
      method: "POST",
      body: JSON.stringify(modifiedFormdata),
    });

    toast.promise(createClient, {
      loading: "Creating new client...",
      success: () => {
        setFormData(initalFormData);
        setLoading(false);
        router.push("/admin/clients");
        return "Successfully created new client";
      },
      error: (error: any) => {
        setLoading(false);
        return error.message || "Failed to create new client";
      },
    });
  };

  console.log(formData);

  return {
    state: {
      formData,
      themeOptions,
      toggleEndTime,
      loading,
    },
    actions: {
      handleChangeClient,
      handleSubmit,
      handleAddAnotherParticipant,
      handleChangeParticipant,
      handletoggleEndTime,
    },
  };
};
