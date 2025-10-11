"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Modal, Input, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "../../../lib/hooks/useTranslation";

const LocationModal = ({
  isOpen,
  onClose,
  selectedMapLocation,
  setSelectedMapLocation,
  onConfirm,
  onUseCurrentLocation
}) => {
  const [searchLocation, setSearchLocation] = useState("");
  const { t, isRTL } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  // Only UAE is available for shipping
  const shippingCountry = { label: "UAE", value: "UAE", flag: "/arabicicon.svg" };

  // Track viewport to switch to full-screen on small devices
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener ? mediaQuery.addEventListener("change", handleChange) : mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeEventListener ? mediaQuery.removeEventListener("change", handleChange) : mediaQuery.removeListener(handleChange);
    };
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleUseCurrentLocation = () => {
    onUseCurrentLocation();
    onClose();
  };

  const TitleBar = (
    <div className={`flex items-center justify-between px-2 ${isMobile ? '' : 'pr-10'}`}>
      <span className="text-base sm:text-xl font-semibold text-gray-900">
        {t("location.addNewAddress") || "Add new address"}
      </span>
      <div className="flex items-center text-sm text-gray-600">
        <Image
          src={shippingCountry.flag}
          alt="UAE Flag"
          width={16}
          height={12}
          className="w-4 h-4 rounded-full mr-2 object-cover"
        />
        <span className="mr-1 text-sm font-semibold text-[11px]">{t("location.shipTo") || "Ship to"}</span>
        <span className="text-[#333333] font-semibold">{shippingCountry.label}</span>
      </div>
    </div>
  );

  const MapAndSearch = (
    <div className={`relative bg-gray-100 ${isMobile ? 'flex-1 min-h-[60vh]' : 'h-72'} mb-3 overflow-hidden rounded-lg`}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462562.6509596!2d54.9475544!3d25.2048493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e48dfb1ab12bd%3A0x33d32f56c0080aa7!2sUnited%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen=""
        aria-hidden="false"
        tabIndex="0"
        title="United Arab Emirates Map"
      />
      {/* Search Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10">
        <Input
          size="middle"
          placeholder={t("location.searchLocation") || "Search location"}
          prefix={
            <Image
              src="/searchicon.svg"
              alt="Search"
              width={20}
              height={20}
              className="w-4 h-4"
            />
          }
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full shadow-lg [&::placeholder]:text-[#333333]"
        />
      </div>
    </div>
  );

  const DesktopFooter = (
    <div className="px-3">
      <div className="flex items-center justify-between">
        <Button
          type="text"
          size="small"
          onClick={handleUseCurrentLocation}
          style={{
            color: 'var(--color-primary)',
            backgroundColor: 'transparent'
          }}
          className="flex items-center text-xs hover:bg-transparent"
        >
          <Image
            src="/currentlocation.svg"
            alt="Current location"
            width={16}
            height={17}
            className="w-4 h-4 mr-1"
          />
          {t("location.useCurrentLocation") || "Use current location"}
        </Button>

        <Button
          type="primary"
          size="large"
          onClick={handleConfirm}
          style={{
            backgroundColor: 'var(--color-primary)',
            borderColor: 'var(--color-primary)',
            borderRadius: '3px',
            fontSize: '13px',
          }}
          className="hover:opacity-80"
        >
          {t("location.confirmLocation") || "Confirm location"}
        </Button>
      </div>
    </div>
  );

  // Render full-screen panel on mobile instead of modal
  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[1000] flex flex-col bg-white" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center px-3 py-2">
          <span className="text-base font-semibold text-gray-900">
            {t("location.addNewAddress") || "Add new address"}
          </span>
          <div className="ml-auto flex items-center">
            <Image
              src={shippingCountry.flag}
              alt="UAE Flag"
              width={16}
              height={12}
              className="w-4 h-4 rounded-full mr-2 object-cover"
            />
            <span className="mr-1 text-sm font-semibold text-[11px]">{t("location.shipTo") || "Ship to"}</span>
            <span className="text-[#333333] font-semibold">{shippingCountry.label}</span>
            <button type="button" aria-label="Close" onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
              <CloseOutlined />
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-1 py-0 min-h-0">
          {MapAndSearch}
        </div>
        <div className="p-3 pt-0 pb-3">
          <div className="flex items-center gap-2">
            <Button
              type="text"
              size="middle"
              onClick={handleUseCurrentLocation}
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'transparent'
              }}
              className="flex-1 text-sm flex items-center justify-center hover:bg-transparent"
            >
              <Image
                src="/currentlocation.svg"
                alt="Current location"
                width={16}
                height={17}
                className="w-4 h-4 mr-1"
              />
              {t("location.useCurrentLocation") || "Use current location"}
            </Button>
            <Button
              type="primary"
              size="middle"
              onClick={handleConfirm}
              style={{
                backgroundColor: 'var(--color-primary)',
                borderColor: 'var(--color-primary)'
              }}
              className="flex-1 text-sm"
            >
              {t("location.confirmLocation") || "Confirm location"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title={TitleBar}
      open={isOpen}
      onCancel={onClose}
      width={720}
      footer={null}
      className="location-modal"
      dir={isRTL ? "rtl" : "ltr"}
      destroyOnHidden
      centered
      maskClosable={true}
      closable={true}
      keyboard={false}
    >
      {MapAndSearch}
      {DesktopFooter}
    </Modal>
  );
};

export default LocationModal;
