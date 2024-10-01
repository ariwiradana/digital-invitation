import useSWR from "swr";
import { ClientV2 } from "@/lib/types";
import { fetcher } from "@/lib/fetcher";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

export const useAdminClients = () => {
  const { data, error, mutate, isLoading } = useSWR<{
    success: boolean;
    data: ClientV2[];
  }>("/api/clientv2", fetcher);

  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    let toastId: string | undefined;
    if (isLoading && !isLoadingRef.current) {
      toastId = toast.loading("Loading client data...");
    } else if (!isLoading && isLoadingRef.current) {
      if (data) {
        toast.success("Client data loaded successfully!", {
          id: toastId,
        });
      } else {
        toast.error("Failed to load client data.", {
          id: toastId,
        });
      }
    }
    isLoadingRef.current = isLoading;
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isLoading, data]);

  return {
    clients: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};
