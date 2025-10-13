"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Button from "@/app/_components/common/Button";
import { toast } from "sonner";
// import {
//   useCurrentUser,
//   useUpdateCurrentUser,
// } from "@/lib/hooks/useCurrentUser"; // Removed API integration
import { setUser } from "@/features/user/userSlice";

export default function AccountInfo() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [formValues, setFormValues] = useState({
    username: "",
    phonenumber: "",
  });
  const userFromStore = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  
  // Static data - no API integration
  const queriedUser = null;
  const isLoading = false;
  const isError = false;
  
  // Mock mutation object for demo
  const updateUserMutation = {
    isLoading: false,
    mutate: (values) => {
      // Simulate saving - update local state and localStorage
      const updatedUser = { ...userData, ...values };
      dispatch(setUser(updatedUser));
      setLocalUser(updatedUser);
      
      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    },
  };
  const userData = useMemo(() => {
    const userCandidate = localUser || queriedUser || userFromStore;
    if (userCandidate) return userCandidate;
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage?.getItem("user");
        return stored ? JSON.parse(stored) : null;
      } catch {}
    }
    return null;
  }, [localUser, queriedUser, userFromStore]);

  useEffect(() => {
    if (userData && isEditing) {
      setFormValues({
        username: userData?.username || "",
        phonenumber: userData?.phonenumber || "",
      });
    }
  }, [userData, isEditing]);

  const handleLogout = () => {
    // Clear any stored authentication data
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedCategory");
      localStorage.removeItem("cartItems");
      sessionStorage.clear();
    }
    // Navigate to login page
    router.push("/login");
  };

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5 md:mb-6">
        <h2 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900">
          Personal Information
        </h2>
        {isEditing ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="large"
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-xs sm:text-sm md:text-base"
              style={{ transition: "color 0.2s" }}
              onMouseOver={e => e.currentTarget.style.color = "#777"}
              onMouseOut={e => e.currentTarget.style.color = ""}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={() => updateUserMutation.mutate(formValues)}
              className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-[var(--color-primary)] text-white rounded-md transition-colors cursor-pointer text-xs sm:text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                backgroundColor: "var(--color-primary)",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#2B73B8")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-primary)")
              }
              disabled={updateUserMutation.isLoading}
            >
              {updateUserMutation.isLoading && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {updateUserMutation.isLoading ? "Saving" : "Save"}
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="large"
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-[var(--color-primary)] text-white rounded-md transition-colors cursor-pointer text-xs sm:text-sm md:text-base"
            style={{
              backgroundColor: "var(--color-primary)",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#2B73B8")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gray-300 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Details */}
        <dl
          className={`divide-y divide-gray-200 rounded-md border border-gray-200 ${
            isEditing && updateUserMutation.isLoading ? "opacity-60" : ""
          }`}
        >
          {/* Name */}
          <div className="py-3 px-3 sm:px-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
            <dt className="text-xs sm:text-sm font-medium text-gray-600">
              Name
            </dt>
            <dd className="sm:col-span-2 text-sm sm:text-base text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  value={formValues.username}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, username: e.target.value }))
                  }
                  className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  placeholder="Your name"
                  disabled={updateUserMutation.isLoading}
                />
              ) : isLoading ? (
                <span className="text-gray-500">Loading...</span>
              ) : isError ? (
                <span className="text-red-600">Failed to load</span>
              ) : (
                <span>{userData?.username || "-"}</span>
              )}
            </dd>
          </div>

          {/* Phone number */}
          <div className="py-3 px-3 sm:px-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
            <dt className="text-xs sm:text-sm font-medium text-gray-600">
              Phone number
            </dt>
            <dd className="sm:col-span-2 text-sm sm:text-base text-gray-900">
              {isEditing ? (
                <input
                  type="tel"
                  value={formValues.phonenumber}
                  onChange={(e) =>
                    setFormValues((v) => ({
                      ...v,
                      phonenumber: e.target.value,
                    }))
                  }
                  className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  placeholder="e.g. +1234567890"
                  disabled={updateUserMutation.isLoading}
                />
              ) : isLoading ? (
                <span className="text-gray-500">Loading...</span>
              ) : isError ? (
                <span className="text-red-600">Failed to load</span>
              ) : (
                <span>{userData?.phonenumber || "-"}</span>
              )}
            </dd>
          </div>

          {/* Email */}
          <div className="py-3 px-3 sm:px-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
            <dt className="text-xs sm:text-sm font-medium text-gray-600">
              Email
            </dt>
            <dd className="sm:col-span-2 text-sm sm:text-base text-gray-900">
              {isLoading ? (
                <span className="text-gray-500">Loading...</span>
              ) : isError ? (
                <span className="text-red-600">Failed to load</span>
              ) : (
                <span>{userData?.email || "-"}</span>
              )}
            </dd>
          </div>
        </dl>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Logout Button */}
        <Button
          variant="secondary"
          size="large"
          onClick={handleLogout}
          className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer text-xs sm:text-sm md:text-base"
          style={{
            '--tw-text-opacity': '1',
            color: '#2B73B8',
          }}
        >
          <span style={{
            color: '#2B73B8',
            transition: 'color 0.2s',
            display: "inline-block"
          }}
            className="group-[.hover]:text-[#2B73B8]"
          >
            Logout
          </span>
        </Button>
        <style jsx>{`
          button:hover, button:focus {
            color: #2B73B8 !important;
          }
        `}</style>
      </div>
    </div>
  );
}
