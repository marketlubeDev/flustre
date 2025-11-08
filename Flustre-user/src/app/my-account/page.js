"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AccountInfo from "./_components/AccountInfo";
import SavedAddress from "./_components/SavedAddress";
import MyOrders from "./_components/MyOrders";
import HelpSupport from "./_components/HelpSupport";
import PrivacyPolicy from "./_components/PrivacyPolicy";
import TermsConditions from "./_components/TermsConditions";

function MyAccountContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get("tab") || "").toLowerCase();

  // Auth state derived from localStorage tokens
  // Initialize with false to avoid hydration mismatch (server vs client)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getIsAuthenticated = () => {
    if (typeof window === "undefined") return false;
    const token =
      window.localStorage?.getItem("token") ||
      window.localStorage?.getItem("userToken");
    return !!token;
  };

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(getIsAuthenticated());
    // Initial sync in case of late hydration
    syncAuth();
    // Update on storage changes (other tabs) and window focus
    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") syncAuth();
    });
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
      document.removeEventListener("visibilitychange", () => {});
    };
  }, []);

  // Define tabs with their keys and corresponding display names
  const tabsConfig = [
    { key: "accountInfo", displayName: "Account Info" },
    { key: "savedAddress", displayName: "Saved Address" },
    { key: "myOrders", displayName: "My Orders" },
    { key: "helpSupport", displayName: "Help & Support" },
    { key: "privacyPolicy", displayName: "Privacy & Policy" },
    { key: "termsConditions", displayName: "Terms & Conditions" },
  ];

  const protectedTabs = ["accountInfo", "savedAddress", "myOrders"];

  const mapParamToTabKey = (param) => {
    switch (param) {
      case "account":
      case "info":
      case "accountinfo":
        return "accountInfo";
      case "addresses":
      case "saved-address":
      case "saved-addresses":
      case "savedaddress":
        return "savedAddress";
      case "orders":
      case "my-orders":
      case "order-history":
      case "myorders":
        return "myOrders";
      case "help":
      case "support":
      case "helpsupport":
        return "helpSupport";
      case "privacy":
      case "policy":
      case "privacy-policy":
      case "privacypolicy":
        return "privacyPolicy";
      case "terms":
      case "conditions":
      case "terms-conditions":
      case "termsconditions":
        return "termsConditions";
      default:
        return "accountInfo";
    }
  };

  const [activeTab, setActiveTab] = useState(mapParamToTabKey(tabParam));

  // Sync activeTab with URL query changes
  useEffect(() => {
    const nextTab = mapParamToTabKey(tabParam);
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [tabParam]);

  // Guard: if not authenticated and a protected tab is selected via URL, redirect to login with redirect back
  useEffect(() => {
    if (!isAuthenticated) {
      if (protectedTabs.includes(activeTab)) {
        const desiredUrl = `${pathname}?tab=${activeTab}`;
        const redirectParam = encodeURIComponent(desiredUrl);
        router.replace(`/login?redirect=${redirectParam}`);
      }
    }
  }, [isAuthenticated, activeTab, pathname]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "accountInfo":
        return <AccountInfo />;
      case "savedAddress":
        return <SavedAddress />;
      case "myOrders":
        return <MyOrders />;
      case "helpSupport":
        return <HelpSupport />;
      case "privacyPolicy":
        return <PrivacyPolicy />;
      case "termsConditions":
        return <TermsConditions />;
      default:
        return <AccountInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {tabsConfig.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  if (!isAuthenticated && protectedTabs.includes(tab.key)) {
                    const desiredUrl = `${pathname}?tab=${tab.key}`;
                    const redirectParam = encodeURIComponent(desiredUrl);
                    router.push(`/login?redirect=${redirectParam}`);
                    return;
                  }
                  setActiveTab(tab.key);
                  const newSearch = new URLSearchParams(
                    searchParams.toString()
                  );
                  newSearch.set("tab", tab.key);
                  if (protectedTabs.includes(tab.key)) {
                    router.replace(`${pathname}?${newSearch.toString()}`);
                  } else {
                    router.push(`${pathname}?${newSearch.toString()}`);
                  }
                }}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.displayName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-[#F5F5F5] rounded-lg p-4 sm:p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default function MyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <MyAccountContent />
    </Suspense>
  );
}
