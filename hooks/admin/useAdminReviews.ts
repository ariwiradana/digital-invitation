import useSWR from "swr";
import { Client, Option, Review } from "@/lib/types";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getClient } from "@/lib/client";

export const useAdminReviews = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [clientId, setClientId] = useState<number | null>(null);
  const [clientOptions, setClientOptions] = useState<Option[] | []>([]);

  const { data: client } = useSWR<{
    success: boolean;
    data: Client[];
    total_rows: number;
  }>(`/api/client`, fetcher);

  const { data, error, mutate, isLoading } = useSWR<{
    success: boolean;
    data: Review[];
    total_rows: number;
  }>(
    clientId
      ? `/api/wishes?page=${page}&limit=${limit}&client_id=${clientId}`
      : undefined,
    fetcher
  );

  const handleChangeClient = (value: number) => {
    setClientId(value);
  };

  useEffect(() => {
    if (client?.data && client.data.length) {
      if (!clientId) {
        setClientId(client.data[0].id as number);
      }
      const options: Option[] = client.data.map((client) => ({
        label: client.name,
        value: client.id as number,
      }));
      setClientOptions(options);
    }
  }, [client, clientId]);

  const handleChangePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleDelete = (id: number) => {
    const deleteReview = getClient(`/api/wishes?id=${id}`, {
      method: "DELETE",
    });
    toast.promise(deleteReview, {
      loading: "Deleting review...",
      success: () => {
        mutate();
        return "Successfully deleted review";
      },
      error: (error: any) => {
        return error.message || "Failed to delete review";
      },
    });
  };

  return {
    state: {
      reviews: data?.data || [],
      isLoading,
      isError: error,
      page,
      limit,
      toalRows: data?.total_rows || 0,
      clientOptions,
      clientId,
    },
    actions: {
      mutate,
      handleChangePagination,
      handleDelete,
      handleChangeClient,
    },
  };
};
