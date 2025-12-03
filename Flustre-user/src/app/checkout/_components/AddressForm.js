"use client";

import { useState } from "react";
import Button from "@/app/_components/common/Button";
import { useUpdateUserAddress } from "@/lib/hooks/useUpdateUserAddress";
// import { useUpdateCurrentUser } from "@/lib/hooks/useCurrentUser"; // Removed API integration

export default function AddressForm({ onBack, initialData, onSave, addressId }) {

  const { mutate: updateUserAddress, isLoading: isUpdatingUserAddress } = useUpdateUserAddress();
  // Static update user function - no API integration



  
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    houseApartment: initialData?.houseApartment || "",
    street: initialData?.street || "",
    landmark: initialData?.landmark || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (isUpdatingUserAddress) return;
    // Map checkout form fields to API expected fields
    const payload = {
      address: {
        fullName: formData.fullName,
        phoneNumber: (formData.phone || "").trim(),
        houseApartmentName: formData.houseApartment,
        street: formData.street,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };


    // If we have an addressId, include it to update the existing address
    if (addressId) {
      payload.addressId = addressId;
    }

    updateUserAddress(payload, {
      onSuccess: (data) => {
        const currentAddressId = data?.address?.[0]?._id;
        localStorage.setItem("currentAddressId", currentAddressId);
        localStorage.setItem("currentAddress", JSON.stringify(formData));
        onSave(formData);
        onBack();
      },
      onError: (error) => {
        console.log(error, "error");
      },
      // Optional: surface error to user in future
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-xl font-semibold text-gray-800">Deliver to</h3>
        </div>
        <div className="px-4 pb-4 space-y-4">
          {/* Full name and Phone number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-600 bg-white"
              />
            </div>
            <div className="space-y-2">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-600 bg-white"
              />
            </div>
          </div>

          {/* House / Apartment */}
          <div className="space-y-2">
            <input
              type="text"
              name="houseApartment"
              value={formData.houseApartment}
              onChange={handleInputChange}
              placeholder="House / Apartment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-600 bg-white"
            />
          </div>

          {/* Street and Landmark */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Street"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-600 bg-white"
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="Landmark"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-600 bg-white"
              />
            </div>
          </div>

          {/* City, State, Pincode */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-600 bg-white"
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-600 bg-white"
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Pincode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-900 placeholder:text-gray-600 bg-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            <Button
              variant="secondary"
              size="medium"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-500 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="outlinePrimary"
              size="medium"
              onClick={handleSave}
              className="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer font-medium"
            >
              Save Address
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}