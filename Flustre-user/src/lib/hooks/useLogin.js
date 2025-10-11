import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "../axios/axiosInstance";
import {
  setEmailForVerification,
  startOtpTimer,
  clearOtpTimer,
  clearEmailForVerification,
  setUser,
  setIsLoggedIn,
} from "@/features/user/userSlice";
import { useDispatch } from "react-redux";

async function loginRequest({ emailOrPhone }) {
  const res = await axiosInstance.post("/user/login", { email: emailOrPhone });
  return res.data;
}

async function verifyOtpRequest({ otp, email }) {
  const res = await axiosInstance.post("/user/verify-otp", { otp, email });
  return res.data;
}

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      const email = data?.content?.email || data?.data?.email;
      dispatch(setEmailForVerification(email));
      dispatch(startOtpTimer(3 * 60));
      router.push(`/login/otp`);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to login");
    },
  });
};

export const useVerifyOtp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  return useMutation({
    mutationFn: verifyOtpRequest,
    onSuccess: (data) => {
      // API returns token at top-level and user inside content
      const payload = data?.content || data?.data || {};
      const token = data?.token;
      const user = payload?.user;

      try {
        if (typeof window !== "undefined") {
          if (token) localStorage.setItem("userToken", token);
          if (user) localStorage.setItem("user", JSON.stringify(user));
        }
      } catch {}

      if (user) dispatch(setUser(user));
      if (token) dispatch(setIsLoggedIn(true));

      dispatch(clearOtpTimer());
      dispatch(clearEmailForVerification());

      // Check if there's an intended checkout URL to redirect to
      const intendedCheckoutUrl = typeof window !== "undefined" 
        ? window.localStorage.getItem("intendedCheckoutUrl") 
        : null;
      
      if (intendedCheckoutUrl) {
        // Clear the intended URL and redirect to checkout
        window.localStorage.removeItem("intendedCheckoutUrl");
        router.push(intendedCheckoutUrl);
      } else {
        router.push("/");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
    },
  });
};
