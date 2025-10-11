import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

const TopNavbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const handleOpenDraftModal = () => setIsDraftModalOpen(true);
  const handleCloseDraftModal = () => setIsDraftModalOpen(false);
  const handleConfirmSaveDraft = () => {
    // TODO: Hook up actual save-as-draft logic here if needed
    setIsDraftModalOpen(false);
  };

  // Function to get the page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const queryProductId = searchParams.get("productId");
    const stateProductId = location.state?.productId;
    const hasEditProductId = Boolean(queryProductId || stateProductId);

    if (path === "/admin") return "Dashboard";
    if (path.includes("/addproduct")) {
      return hasEditProductId ? "Edit product" : "Add new product";
    }
    if (path.includes("/admin/product")) return "Products";
    if (path.includes("/admin/order")) return "Orders";
    if (path.includes("/admin/category")) return "Categories";
    if (path.includes("/admin/subcategory")) return "SubCategories";
    if (path.includes("/admin/banner")) return "Banners";
    if (path.includes("/admin/label")) return "Labels";
    if (path.includes("/admin/coupon")) return "Coupons";
    if (path.includes("/admin/insta-carousel")) return "Insta Carousel";
    if (path.includes("/admin/review")) return "Reviews";
    if (path.includes("/admin/customer")) return "Customers";
    if (path.includes("/admin/active-offer")) return "Active Offers";
    if (path.includes("/admin/sales")) return "Sales";
    if (path.includes("/admin/inventory")) return "Inventory";
    if (path.includes("/admin/feedback")) return "Feedback";

    // For nested routes like add product, edit product, etc.
    if (path.includes("product")) return "Products";
    if (path.includes("order")) return "Orders";
    if (path.includes("category")) return "Categories";
    if (path.includes("subcategory")) return "SubCategories";
    if (path.includes("banner")) return "Banners";
    if (path.includes("label")) return "Labels";
    if (path.includes("coupon")) return "Coupons";
    if (path.includes("insta-carousel")) return "Insta Carousel";
    if (path.includes("review")) return "Reviews";
    if (path.includes("customer")) return "Customers";
    if (path.includes("sales")) return "Sales";
    if (path.includes("inventory")) return "Inventory";
    if (path.includes("feedback")) return "Feedback";

    return "Admin Panel";
  };

  // Function to get subtitle for specific pages
  const getPageSubtitle = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const queryProductId = searchParams.get("productId");
    const stateProductId = location.state?.productId;
    const hasEditProductId = Boolean(queryProductId || stateProductId);

    // Specific action subtitles
    if (path.includes("/addproduct")) {
      return hasEditProductId
        ? "Product / Edit product"
        : "Product / Add new product";
    }
    if (path.includes("/edit")) return "Edit existing information";
    if (path.includes("/view")) return "View details";

    // Default subtitles for main pages
    if (path === "/admin")
      return "Track sales, orders, and key store performance at a glance";
    if (
      path.includes("product") &&
      !path.includes("/addproduct") &&
      !path.includes("/edit")
    )
      return "Add or modify product information";
    if (path.includes("order")) return "Manage customer orders";
    if (path.includes("category")) return "Organize product categories";
    if (path.includes("subcategory")) return "Organize product subcategories";
    if (path.includes("banner")) return "Manage promotional banners";
    if (path.includes("label")) return "Manage product labels";
    if (path.includes("coupon")) return "Manage discount coupons";
    if (path.includes("insta-carousel"))
      return "Upload and manage social reels";
    if (path.includes("review")) return "Manage customer reviews";
    if (path.includes("customer")) return "Manage customer accounts";
    if (path.includes("active-offer"))
      return "Manage active promotional offers";
    if (path.includes("sales")) return "View sales analytics and reports";
    if (path.includes("inventory")) return "Manage product inventory";
    if (path.includes("feedback")) return "View customer feedback";

    return "";
  };

  return (
    <nav className="fixed top-0 left-64 right-0 z-50 bg-white border-b border-gray-200 shadow-sm sm:left-64 h-19">
      <div className="px-3 py-2 lg:px-5 lg:pl-3 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center justify-start rtl:justify-end">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                />
              </svg>
            </button>

            {/* Page Title and Subtitle */}
            <div className="ml-4">
              {location.pathname === "/admin" ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-800">Hello!</h1>
                    <span className="text-2xl">👋</span>
                  </div>
                  {getPageSubtitle() && (
                    <p
                      className="text-xs text-gray-500"
                      style={{ color: "#0A0A0ACC" }}
                    >
                      {getPageSubtitle()}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getPageTitle()}
                  </h1>
                  {getPageSubtitle() && (
                    <p
                      className="text-xs text-gray-500"
                      style={{ color: "#0A0A0ACC" }}
                    >
                      {getPageSubtitle()}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right side - Save as draft button */}
          <div className="flex items-center">
            {getPageTitle() === "Add new product" && (
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200"
                style={{
                  backgroundColor: "#2B73B81A",
                  color: "#2B73B8",
                }}
                onClick={handleOpenDraftModal}
              >
                Save as draft
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDraftModalOpen}
        onClose={handleCloseDraftModal}
        onConfirm={handleConfirmSaveDraft}
        title="Save product as draft?"
        message="Your product details will be saved as a draft. You can come back anytime to complete and publish it."
        confirmButtonText="Save"
        confirmButtonColor="custom-save"
        customConfirmButtonStyle={{
          borderRadius: "8px",
          borderBottom: "1px solid #2B73B8",
          background: "linear-gradient(180deg, #2B73B8 30.96%, #A94962 100%)",
          boxShadow: "0 1px 2px 0 rgba(189, 93, 118, 0.69)",
          color: "#fff",
          minWidth: "100px",
        }}
      />
    </nav>
  );
};

export default TopNavbar;
