import { fetcher } from "@/lib/fetcher";
import moment from "moment";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Blobs {
  url: string;
}

export interface UseApp {
  state: {
    countdown: Countdown;
    open: boolean;
    blobs: Blobs[];
  };
  actions: {
    handleOpenCover: () => void;
  };
}

const useApp = (dateEvent: string, prefix: string): UseApp => {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [open, setOpen] = useState<boolean>(false);

  const { data } = useSWR(
    `/api/images?pathname=digital-invitation/${prefix}/gallery`,
    fetcher
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const duration = moment.duration(moment(dateEvent).diff(now));

      setCountdown({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });

      if (duration.asSeconds() <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenCover = () => {
    setOpen(true);
  };

  return {
    state: {
      open,
      blobs: (data?.blobs as Blobs[]) || [],
      countdown,
    },
    actions: {
      handleOpenCover,
    },
  };
};

export default useApp;
