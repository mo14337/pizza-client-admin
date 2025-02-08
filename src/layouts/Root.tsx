import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { self } from "../http/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AxiosError } from "axios";

const getSelf = async () => {
  const { data } = await self();
  return data;
};
const Root = () => {
  const { setUser } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    retry: (FailureCount: number, error) => {
      if (error instanceof AxiosError && error?.response?.status === 401) {
        return false;
      }

      return FailureCount < 3;
    },
  });
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <Outlet />;
};

export default Root;
