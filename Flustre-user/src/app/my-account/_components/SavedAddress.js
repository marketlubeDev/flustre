"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/app/_components/common/Button";
// import {
//   useCurrentUser,
//   useDeleteUserAddress,
//   useUpdateCurrentUser,
// } from "@/lib/hooks/useCurrentUser"; // Removed API integration

export default function SavedAddress() {
  const router = useRouter();
  // Static data - no API integration
  const user = null;
  const isLoading = false;
  const isError = false;
  const deleteAddress = { mutate: () => {}, isLoading: false };
  const updateUser = { mutate: () => {}, isLoading: false };
  const savedAddresses = [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    houseApartmentName: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (!isModalOpen) return;
    setForm((f) => ({ ...f, phoneNumber: f.phoneNumber || "" }));
  }, [isModalOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const persisted = window.localStorage.getItem("currentAddressId");
        if (persisted) setCurrentAddressId(persisted);
      } catch {}
    }
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setForm({
      fullName: "",
      phoneNumber: "",
      houseApartmentName: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    });
    setIsModalOpen(true);
    setPhoneError("");
  };

  const openEditModal = (addr) => {
    setModalMode("edit");
    setEditingId(addr?._id);
    setForm({
      fullName: addr?.fullName || "",
      phoneNumber: addr?.phoneNumber || "",
      houseApartmentName: addr?.houseApartmentName || "",
      street: addr?.street || "",
      landmark: addr?.landmark || "",
      city: addr?.city || "",
      state: addr?.state || "",
      pincode: addr?.pincode || "",
    });
    setIsModalOpen(true);
    setPhoneError("");
  };

  const closeModal = () => {
    if (updateUser.isLoading || deleteAddress.isLoading) return;
    setIsModalOpen(false);
  };

  const handleDeleteAddress = (addressId) => {
    if (!addressId || deleteAddress.isLoading) return;
    deleteAddress.mutate(addressId);
    if (addressId === currentAddressId) {
      setCurrentAddressId(null);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("currentAddressId");
          window.localStorage.removeItem("currentAddress");
        } catch {}
      }
    }
  };

  const handleDeleteClick = (e, addressId) => {
    e.preventDefault(); // Prevent default link behavior
    handleDeleteAddress(addressId);
  };

  const setAsCurrent = (addr) => {
    if (!addr?._id) return;
    setCurrentAddressId(addr._id);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("currentAddressId", addr._id);
        window.localStorage.setItem("currentAddress", JSON.stringify(addr));
      } catch {}
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateUser.isLoading) return;
    const trimmedPhone = (form.phoneNumber || "").trim();
    const phoneOk = /^\+?[0-9]{7,15}$/.test(trimmedPhone);
    if (!phoneOk) {
      setPhoneError("Enter a valid phone like +1234567890");
      return;
    }
    setPhoneError("");
    if (modalMode === "add") {
      updateUser.mutate(
        { address: { ...form, phoneNumber: trimmedPhone } },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else if (modalMode === "edit") {
      if (!editingId) return;
      deleteAddress.mutate(editingId, {
        onSuccess: () => {
          updateUser.mutate(
            { address: { ...form, phoneNumber: trimmedPhone } },
            { onSuccess: () => setIsModalOpen(false) }
          );
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Saved Addresses
        </h2>
        <Button
          variant="primary"
          size="large"
          onClick={openAddModal}
          className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base bg-[var(--color-primary)] text-white rounded-md transition-colors cursor-pointer"
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
          Add New Address
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-sm text-red-600">Failed to load addresses</p>
      ) : savedAddresses.length === 0 ? (
        <p className="text-sm text-gray-600">No saved addresses yet.</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {savedAddresses.map((address) => (
            <div
              key={address._id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {address.fullName || "Address"}
                    </h3>
                    {(address.isDefault ||
                      address._id === currentAddressId) && (
                      <span className="px-2 py-1 bg-[#F7F3F4] text-[#2B73B8] text-[10px] sm:text-xs rounded-full">
                        {address._id === currentAddressId
                          ? "Current"
                          : "Default"}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">
                    {[
                      address.houseApartmentName,
                      address.street,
                      address.landmark,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {address.phoneNumber}
                  </p>
                </div>
                <div className="flex space-x-3 sm:space-x-2 sm:self-start sm:mt-0 mt-1">
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setAsCurrent(address);
                    }}
                    className="text-gray-700 hover:text-gray-900 text-xs sm:text-sm md:text-base cursor-pointer px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 transition-colors"
                  >
                    {address._id === currentAddressId
                      ? "Current"
                      : "Set current"}
                  </Link>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openEditModal(address);
                    }}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 text-xs sm:text-sm md:text-base cursor-pointer px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    href="#"
                    onClick={(e) => handleDeleteClick(e, address._id)}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm md:text-base cursor-pointer px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 transition-colors"
                  >
                    {deleteAddress.isLoading
                      ? "Deleting..."
                      : "Delete"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 z-40"
            onClick={closeModal}
          />
          <div className="relative bg-white w-full max-w-lg mx-3 rounded-lg shadow-lg z-50">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {modalMode === "add" ? "Add Address" : "Edit Address"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-sm"
                disabled={updateUser.isLoading || deleteAddress.isLoading}
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-400 bg-white"
                    required
                    disabled={updateUser.isLoading || deleteAddress.isLoading}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => {
                      const raw = e.target.value;
                      // allow only leading + and digits
                      const sanitized = raw
                        .replace(/[^\d+]/g, "")
                        .replace(/(?!^)[+]/g, "");
                      setForm((f) => ({ ...f, phoneNumber: sanitized }));
                      if (sanitized && !/^\+?[0-9]{7,15}$/.test(sanitized)) {
                        setPhoneError("Format: + and 7-15 digits");
                      } else {
                        setPhoneError("");
                      }
                    }}
                    inputMode="tel"
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 bg-white ${
                      phoneError
                        ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                        : "border-gray-300 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                    }`}
                    placeholder="e.g. +1234567890"
                    required
                    disabled={updateUser.isLoading || deleteAddress.isLoading}
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                  House / Apartment
                </label>
                <input
                  type="text"
                  value={form.houseApartmentName}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      houseApartmentName: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-400 bg-white"
                  disabled={updateUser.isLoading || deleteAddress.isLoading}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    value={form.street}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, street: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-400 bg-white"
                    disabled={updateUser.isLoading || deleteAddress.isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, landmark: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-400 bg-white"
                    disabled={updateUser.isLoading || deleteAddress.isLoading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-400 bg-white"
                    disabled={updateUser.isLoading || deleteAddress.isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, state: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-400 bg-white"
                    disabled={updateUser.isLoading || deleteAddress.isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, pincode: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-400 bg-white"
                    disabled={updateUser.isLoading || deleteAddress.isLoading}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={updateUser.isLoading || deleteAddress.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm rounded-md bg-[var(--color-primary)] text-white disabled:opacity-60"
                  disabled={updateUser.isLoading || deleteAddress.isLoading}
                >
                  {updateUser.isLoading || deleteAddress.isLoading
                    ? "Saving..."
                    : modalMode === "add"
                    ? "Add"
                    : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
