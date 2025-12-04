"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import AddressForm from "./AddressForm";
// import { useCurrentUser } from "@/lib/hooks/useCurrentUser"; // Removed API integration

export default function CheckoutRight({
  paymentMethod,
  onPaymentMethodChange,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showMoreCards, setShowMoreCards] = useState(false);
  const [showAddressChooser, setShowAddressChooser] = useState(false);
  // Static user data - no API integration
  const user = null;

  // Check URL parameter to show address form
  useEffect(() => {
    const showAddressFormParam = searchParams.get("showAddressForm");
    const scrollToCenterParam = searchParams.get("scrollToCenter");

    if (showAddressFormParam === "true") {
      setShowAddressForm(true);

      // Scroll to center if requested
      if (scrollToCenterParam === "true") {
        setTimeout(() => {
          const checkoutRight = document.querySelector("[data-checkout-right]");
          if (checkoutRight) {
            checkoutRight.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100); // Small delay to ensure component is rendered
      }

      // Clean up the URL parameters
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete("showAddressForm");
      newUrl.searchParams.delete("scrollToCenter");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  // Current address data used in checkout summary and form
  const [currentAddressData, setCurrentAddressData] = useState({
    email: "",
    country: "IN",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // Helper: map saved address shape to checkout form shape
  const mapSavedAddressToCheckout = (addr, fallbackEmail) => {
    if (!addr) return null;
    const fullName = (addr.fullName || "").trim();
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ").trim();
    const addressParts = [
      addr.houseApartmentName,
      addr.street,
      addr.landmark,
    ].filter(Boolean);
    return {
      email: fallbackEmail || "",
      country: "IN",
      firstName: firstName || "",
      lastName: lastName || "",
      fullName: fullName || "",
      address: addressParts.join(", "),
      // Provide individual fields so the edit form can be fully prefilled
      houseApartment: addr.houseApartmentName || "",
      street: addr.street || "",
      landmark: addr.landmark || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      phone: addr.phoneNumber || "",
    };
  };

  // Initialize from user/default address or persisted checkout override
  useEffect(() => {
    if (typeof window === "undefined") return;
    let override = null;
    try {
      const persisted = window.localStorage.getItem("checkoutAddressOverride");
      if (persisted) override = JSON.parse(persisted);
    } catch {}

    if (override) {
      setCurrentAddressData((prev) => ({
        ...prev,
        ...override,
        email: override.email || user?.email || prev.email,
      }));
      return;
    }

    const saved = (() => {
      // Prefer explicit currentAddress set in My Account
      try {
        const raw = window.localStorage.getItem("currentAddress");
        if (raw) return JSON.parse(raw);
      } catch {}
      const list = user?.address || [];
      return (
        list.find((a) => a?.isDefault) ||
        (Array.isArray(list) && list.length > 0 ? list[0] : null)
      );
    })();

    const mapped = mapSavedAddressToCheckout(saved, user?.email);
    if (mapped) setCurrentAddressData(mapped);
    else if (user?.email)
      setCurrentAddressData((p) => ({ ...p, email: user.email }));
  }, [user]);

  // React to changes in current address set from other pages (e.g., My Account)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyFromStorage = () => {
      try {
        // When user explicitly sets a current address elsewhere, prefer it in checkout.
        // Clear any stale checkout override so the current address shows here.
        try {
          window.localStorage.removeItem("checkoutAddressOverride");
        } catch {}

        const raw = window.localStorage.getItem("currentAddress");
        if (raw) {
          const addr = JSON.parse(raw);
          const mapped = mapSavedAddressToCheckout(addr, user?.email);
          if (mapped) setCurrentAddressData(mapped);
        }
      } catch {}
    };

    const onStorage = (e) => {
      if (e.key === "currentAddress" || e.key === "currentAddressId") {
        applyFromStorage();
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") applyFromStorage();
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", applyFromStorage);
    // Run once on mount in case user navigated back
    applyFromStorage();

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", applyFromStorage);
    };
  }, [user?.email]);

  const handleLogout = () => {
    // Clear any stored authentication data
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedCategory");
      // Clear cart from localStorage when logging out (logged-in users' carts are in DB)
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartCoupon");
      localStorage.removeItem("currentAddressId");
      localStorage.removeItem("currentAddress");
      localStorage.removeItem("checkoutAddressOverride");
      sessionStorage.clear();
      // Notify listeners that cart was cleared
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("coupon-updated"));
    }
    router.push("/login");
  };

  const handleChooseAddress = (addr) => {
    if (!addr) return;
    try {
      if (typeof window !== "undefined") {
        // Persist chosen address as current
        try {
          window.localStorage.setItem("currentAddressId", addr._id || "");
          window.localStorage.setItem("currentAddress", JSON.stringify(addr));
          // Clear any manual checkout override so the chosen address reflects immediately
          window.localStorage.removeItem("checkoutAddressOverride");
        } catch {}
      }
      const mapped = mapSavedAddressToCheckout(addr, user?.email);
      if (mapped) setCurrentAddressData(mapped);
      setShowAddressChooser(false);
    } catch {}
  };

  return (
    <div className="space-y-6" data-checkout-right>
      {!showAddressForm ? (
        <>
          {/* Account Info */}
          <div className="bg-white rounded-lg">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-xl font-semibold text-gray-800">
                Account Info
              </h3>
              <button
                onClick={handleLogout}
                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 underline cursor-pointer"
              >
                Logout
              </button>
            </div>
            <div className="px-4 pb-4 border-b border-gray-200">
              <p className="text-gray-800">
                {currentAddressData.email || user?.email || ""}
              </p>
            </div>
          </div>

          {/* Deliver to */}
          <div className="bg-white rounded-lg">
            <div className="px-4 pt-4 pb-2">
              <h3 className="text-xl font-semibold text-gray-800">
                Deliver to
              </h3>
            </div>
            <div className="pb-4 space-y-2">
              {currentAddressData.address ||
              currentAddressData.city ||
              currentAddressData.state ||
              currentAddressData.pincode ||
              currentAddressData.phone ||
              currentAddressData.firstName ||
              currentAddressData.lastName ||
              currentAddressData.fullName ||
              currentAddressData.houseApartment ||
              currentAddressData.street ||
              currentAddressData.landmark ? (
                <>
                  <div className="flex items-center justify-between px-6">
                    <p className="font-medium text-gray-800">
                      {(currentAddressData.firstName || "").trim() ||
                        currentAddressData.fullName ||
                        ""}
                      {currentAddressData.lastName
                        ? ` ${currentAddressData.lastName}`
                        : ""}
                    </p>
                    <Image
                      src="/threedoticon.svg"
                      alt="More options"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <p className="text-sm text-gray-600 px-6">
                    {currentAddressData.address ||
                      [
                        currentAddressData.houseApartment,
                        currentAddressData.street,
                        currentAddressData.landmark,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                  </p>
                  {(currentAddressData.city ||
                    currentAddressData.state ||
                    currentAddressData.pincode) && (
                    <p className="text-sm text-gray-600 px-6">
                      {[
                        currentAddressData.city,
                        currentAddressData.state,
                        currentAddressData.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {currentAddressData.phone && (
                    <p className="text-sm text-gray-600 px-6">
                      {currentAddressData.phone}
                    </p>
                  )}
                  <div className="border-b border-gray-200 mt-4 px-6"></div>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="ml-4 px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer font-medium"
                    style={{ marginTop: 0, alignSelf: "flex-start" }}
                  >
                    Edit Address
                  </button>
                  {Array.isArray(user?.address) && user.address.length > 1 && (
                    <>
                      <button
                        onClick={() => setShowAddressChooser((v) => !v)}
                        className="ml-2 px-4 py-2 text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 underline cursor-pointer font-medium"
                        style={{ marginTop: 0, alignSelf: "flex-start" }}
                      >
                        {showAddressChooser
                          ? "Less"
                          : "Choose another address"}
                      </button>
                      {showAddressChooser && (
                        <div className="mt-3 px-6 space-y-3">
                          {user.address.map((addr) => (
                            <div
                              key={addr?._id}
                              className="border border-gray-200 rounded p-3"
                            >
                              <p className="font-medium text-gray-800">
                                {(addr?.fullName || "").trim()}
                              </p>
                              <p className="text-sm text-gray-600">
                                {[
                                  addr?.houseApartmentName,
                                  addr?.street,
                                  addr?.landmark,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                              {(addr?.city || addr?.state || addr?.pincode) && (
                                <p className="text-sm text-gray-600">
                                  {[addr?.city, addr?.state, addr?.pincode]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              )}
                              {addr?.phoneNumber && (
                                <p className="text-sm text-gray-600">
                                  {addr.phoneNumber}
                                </p>
                              )}
                              <div className="mt-2">
                                <button
                                  onClick={() => handleChooseAddress(addr)}
                                  className="px-3 py-1.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer text-sm font-medium"
                                >
                                  Deliver to this address
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 px-6">
                    No address added yet.
                  </p>
                  <div className="px-6 pt-1">
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer font-medium"
                    >
                      Add New Address
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <AddressForm
          onBack={() => setShowAddressForm(false)}
          initialData={currentAddressData}
          addressId={(() => {
            // Get the current address ID from localStorage or user data
            if (typeof window !== "undefined") {
              try {
                const currentAddressId =
                  window.localStorage.getItem("currentAddressId");
                if (currentAddressId) return currentAddressId;
              } catch {}
            }
            // Fallback: find the current address ID from user data
            if (user?.address && Array.isArray(user.address)) {
              const currentAddr =
                user.address.find((a) => a.isDefault) || user.address[0];
              return currentAddr?._id;
            }
            return null;
          })()}
          onSave={(newData) => {
            setCurrentAddressData(newData);
            if (typeof window !== "undefined") {
              try {
                window.localStorage.setItem(
                  "checkoutAddressOverride",
                  JSON.stringify(newData)
                );
              } catch {}
            }
          }}
        />
      )}

      {/* Payment Method */}
      <div className="bg-white rounded-lg">
        <div className="px-4 pt-4 pb-3">
          <h3 className="text-xl font-semibold text-gray-800">
            Payment Method
          </h3>
        </div>
        <div className="px-4 pb-5 space-y-3">
          {/* Cash On Delivery */}
          <div className="flex items-start space-x-3 pl-4">
            <input
              type="radio"
              id="cod"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="mt-1"
              style={{ accentColor: "#2B73B8" }}
            />
            <div className="flex-1">
              <label
                htmlFor="cod"
                className="block font-medium text-gray-800 cursor-pointer"
              >
                Cash on Delivery
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Pay when your order is delivered
              </p>
            </div>
          </div>

          {/* Online Payment */}
          <div className="flex items-start space-x-3 pl-4">
            <input
              type="radio"
              id="online"
              name="payment"
              value="online"
              checked={paymentMethod === "online"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="mt-1"
              style={{ accentColor: "#2B73B8" }}
            />
            <div className="flex-1">
              <label
                htmlFor="online"
                className="block font-medium text-gray-800 cursor-pointer"
              >
                Online Payment
              </label>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-1 gap-2">
                <p className="text-sm text-gray-600">
                  Pay securely online
                </p>
                <div className="flex items-center space-x-2 md:justify-end">
                  <Image
                    src="/upi.png"
                    alt="UPI"
                    width={16}
                    height={12}
                    className="h-3 w-auto md:h-4"
                  />
                  <Image
                    src="/rupay.png"
                    alt="RuPay"
                    width={16}
                    height={12}
                    className="h-3 w-auto md:h-4"
                  />
                  {showMoreCards && (
                    <>
                      <Image
                        src="/card3.png"
                        alt="Card 3"
                        width={16}
                        height={12}
                        className="h-3 w-auto md:h-4"
                      />
                      <Image
                        src="/card4.png"
                        alt="Card 4"
                        width={16}
                        height={12}
                        className="h-3 w-auto md:h-4"
                      />
                    </>
                  )}
                  <button
                    onClick={() => setShowMoreCards(!showMoreCards)}
                    className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showMoreCards
                      ? "Less"
                      : "More"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
