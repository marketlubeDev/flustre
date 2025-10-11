"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/app/_components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { startOtpTimer } from "@/features/user/userSlice";
import { toast } from "sonner";
// import { useVerifyOtp } from "@/lib/hooks/useLogin"; // Removed API integration

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const dispatch = useDispatch();
  const otpExpiresAt = useSelector((state) => state.user.otpExpiresAt);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const { emailForVerification } = useSelector((state) => state.user);
  useEffect(() => {
    if (!emailForVerification) {
      // If email is cleared because OTP succeeded, token should be present
      if (typeof window !== "undefined") {
        const token =
          window.localStorage?.getItem("userToken") ||
          window.localStorage?.getItem("token");
        if (token) {
          router.replace("/");
          return;
        }
      }
      router.replace("/login");
    }
  }, [emailForVerification, router]);

  useEffect(() => {
    const computeRemaining = () => {
      if (!otpExpiresAt) return 0;
      const diffMs = otpExpiresAt - Date.now();
      return Math.max(0, Math.ceil(diffMs / 1000));
    };

    const first = computeRemaining();
    setTimer(first);
    setCanResend(first <= 0);

    const id = setInterval(() => {
      const remaining = computeRemaining();
      setTimer(remaining);
      setCanResend(remaining <= 0);
    }, 1000);

    return () => clearInterval(id);
  }, [otpExpiresAt]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (startIndex, e) => {
    e.preventDefault();
    try {
      const raw = e.clipboardData?.getData("text") || "";
      const digits = String(raw)
        .replace(/\D/g, "")
        .slice(0, 4 - startIndex)
        .split("");
      if (digits.length === 0) return;
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[startIndex + i] = d;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(startIndex + digits.length, 3);
      const nextInput = document.getElementById(`otp-${focusIndex}`);
      if (nextInput) nextInput.focus();
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setIsVerifying(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      toast.success("OTP verified successfully!");
      
      // Store demo user data
      const demoUser = {
        username: "Demo User",
        email: emailForVerification,
        phonenumber: "",
      };
      
      if (typeof window !== "undefined") {
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("user", JSON.stringify(demoUser));
      }
      
      // Navigate to my-account
      router.push("/my-account");
    }, 1500);
  };

  const handleResendOTP = () => {
    dispatch(startOtpTimer(30));
  };

  const onEditEmail = () => {
    // Navigate back to login page to edit email
    router.push("/login");
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
            <div className="flex items-center space-x-2">
              <Image
                src="https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Logo/Asset+1.svg"
                alt="flustre"
                width={200}
                height={48}
                className="h-10 sm:h-12 w-auto"
              />
            </div>
          </div>
        </div>

        {/* OTP Message */}
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
            Verify{" "}
            <span
              style={{
                color: "#2B73B8",
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "-1.6px",
                lineHeight: "normal",
                fontStyle: "normal",
                textEdge: "cap",
                leadingTrim: "both",
              }}
              className="sm:text-[40px]"
            >
              OTP
            </span>
          </h2>
          <div className="text-center">
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
              We sent a code to{" "}
              <span
                className="text-[var(--color-primary)] font-medium"
                style={{
                  fontWeight: 500,
                  letterSpacing: "-0.64px",
                }}
              >
                {emailForVerification}
              </span>
              <button
                type="button"
                className="inline-flex items-center ml-2 text-[#2B73B8] font-medium text-xs hover:underline focus:outline-none"
                style={{
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "16px",
                }}
                onClick={onEditEmail}
              >
                <Image
                  src="/editbutton.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                  className="inline-block w-4 h-4 mr-1 align-text-bottom"
                  style={{ marginRight: "2px" }}
                />
                Edit
              </button>
            </p>
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
              Enter the code below to verify your account
            </p>
          </div>
        </div>

        {/* OTP Form */}
        <form
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 w-full"
          onSubmit={handleSubmit}
        >
          <div className="space-y-3 sm:space-y-4">
            {/* OTP Input */}
            <div>
              <div className="flex justify-center">
                <div
                  style={{
                    width: "calc(4 * 64px + 3 * 12px)",
                    maxWidth: "292px",
                  }}
                >
                  <label
                    htmlFor="otp-0"
                    className="block mb-2 sm:text-[18px] text-left"
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
                    Enter OTP
                  </label>
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={(e) => handlePaste(index, e)}
                        placeholder="0"
                        className="w-16 h-12 sm:w-16 sm:h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors duration-200"
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
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="buy"
              size="medium"
              disabled={isVerifying || otp.join("").length !== 4}
              loading={isVerifying}
              className="w-[292px] max-w-[292px] rounded-md cursor-pointer"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium cursor-pointer"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-600 cursor-not-allowed">
                Resend OTP in{" "}
                <span className="text-black">{timer} Sec</span>
              </p>
            )}
          </div>
        </form>

        {/* Back to Login
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to Login
          </Link>
        </div> */}
      </div>
    </div>
  );
}
