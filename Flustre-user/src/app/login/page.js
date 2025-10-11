"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Button from "@/app/_components/common/Button";
import { toast } from "sonner";
import { setEmailForVerification, startOtpTimer } from "@/features/user/userSlice";
// import { useLogin } from "@/lib/hooks/useLogin"; // Removed API integration

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) {
      toast.error("Email or phone number is required");
      return;
    }

    setIsLoading(true);
    
    // Store email/phone in Redux for OTP page
    dispatch(setEmailForVerification(emailOrPhone));
    
    // Start OTP timer (30 seconds)
    dispatch(startOtpTimer(30));
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      toast.success("OTP sent successfully!");
      // Navigate to OTP page
      router.push("/login/otp");
    }, 1000);
  };

  return (
    <div
      className="bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div
        className="max-w-md w-full space-y-4 sm:space-y-5 flex flex-col items-center justify-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Image
              src="https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Logo/Asset+1.svg"
              alt="Souqalmart"
              width={200}
              height={48}
              className="h-10 sm:h-12 w-auto"
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center">
          <h2
            style={{
              color: "#333333",
              textAlign: "center",
              leadingTrim: "both",
              textEdge: "cap",
              fontSize: "28px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              letterSpacing: "-1.6px",
            }}
            className="sm:text-[40px]"
          >
            Welcome{" "}
            <span style={{ color: "var(--color-primary)" }}>
              Shoppers
            </span>
          </h2>

          <p
            style={{
              color: "rgba(51, 51, 51, 0.80)",
              textAlign: "center",
              leadingTrim: "both",
              textEdge: "cap",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
              letterSpacing: "-0.64px",
            }}
            className="sm:text-[16px]"
          >
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Login Form */}
        <form
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 w-full"
          onSubmit={handleSubmit}
        >
          <div className="space-y-3 sm:space-y-4">
            {/* Email/Phone Input */}
            <div>
              <label
                htmlFor="emailOrPhone"
                className="block mb-2 sm:text-[18px]"
                style={{
                  color: "#333333",
                  leadingTrim: "both",
                  textEdge: "cap",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.52px",
                }}
              >
                Email or Phone Number
              </label>
              <input
                id="emailOrPhone"
                name="emailOrPhone"
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 sm:text-[16px]"
                style={{
                  color: "rgba(51, 51, 51, 0.60)",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.64px",
                  boxShadow: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-primary)")
                }
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                placeholder="Enter your email or phone number"
              />
              <style jsx>{`
                #emailOrPhone::placeholder {
                  color: rgba(51, 51, 51, 0.6);
                  /* font-family: 'Nunito Sans', sans-serif; */
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 500;
                  line-height: normal;
                  letter-spacing: -0.64px;
                }
                @media (min-width: 640px) {
                  #emailOrPhone::placeholder {
                    font-size: 16px;
                  }
                }
              `}</style>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={isLoading || !emailOrPhone.trim()}
              loading={isLoading}
              className="w-full sm:text-[16px] rounded-md cursor-pointer"
            >
              {isLoading
                ? "Sending OTP..."
                : "Send OTP"}
            </Button>
          </div>

          {/* Legal Text */}
          <div className="text-center">
            <p
              style={{
                color: "rgba(51, 51, 51, 0.60)",
                textAlign: "center",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
                letterSpacing: "-0.56px",
                leadingTrim: "both",
                textEdge: "cap",
              }}
              className="sm:text-[14px]"
            >
              By continuing, you agree to our{" "}
              <span
                className="underline font-medium cursor-pointer"
                style={{ color: "var(--color-primary)" }}
                onClick={() => router.push("/my-account?tab=terms")}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "rgba(51, 51, 51, 0.60)")
                }
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                className="underline font-medium cursor-pointer"
                style={{ color: "var(--color-primary)" }}
                onClick={() => router.push("/my-account?tab=privacy-policy")}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "rgba(51, 51, 51, 0.60)")
                }
              >
                Privacy Policy
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
