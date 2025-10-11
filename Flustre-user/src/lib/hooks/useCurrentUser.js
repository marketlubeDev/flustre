import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axios/axiosInstance";

async function fetchCurrentUser() {
  const res = await axiosInstance.get("/user/check-user");
  return res.data?.user || res.data?.content?.user || res.data;
}

export function useCurrentUser(options = {}) {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    ...options,
  });
}

async function updateCurrentUserApi(payload) {
  const res = await axiosInstance.patch("/user/update-user", payload);
  return res.data;
}

export function useUpdateCurrentUser(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCurrentUserApi,
    onSuccess: (data) => {
      // data is the updated user object per controller
      qc.setQueryData(["current-user"], data);
      qc.invalidateQueries({ queryKey: ["current-user"] });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("user", JSON.stringify(data));
        } catch {}
      }
    },
    ...options,
  });
}

async function deleteUserAddressApi(addressId) {
  const res = await axiosInstance.patch(`/user/delete-address/${addressId}`);
  // server returns { status, message, data: updatedUser }
  return res.data?.data || res.data;
}

export function useDeleteUserAddress(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUserAddressApi,
    onSuccess: (updatedUser) => {
      qc.setQueryData(["current-user"], updatedUser);
      qc.invalidateQueries({ queryKey: ["current-user"] });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch {}
      }
    },
    ...options,
  });
}
