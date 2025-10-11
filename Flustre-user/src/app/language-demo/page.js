"use client";

import { useTranslation } from "../../lib/hooks/useTranslation";

export default function LanguageDemo() {
  const { t, language, isRTL, changeLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("homepage.hero.title")}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {t("homepage.hero.subtitle")}
            </p>
            
            {/* Language Switcher */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => changeLanguage("EN")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  language === "EN"
                    ? "bg-[#2B73B8] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage("AR")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  language === "AR"
                    ? "bg-[#2B73B8] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                العربية
              </button>
            </div>

            <div className="text-sm text-gray-500">
              {t("common.currentLanguage")}: {language} | 
              {t("common.direction")}: {isRTL ? "RTL" : "LTR"}
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Navigation Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t("nav.navigation")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("nav.home")}:</span>
                  <span className="font-medium">{t("nav.home")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{t("nav.products")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-medium">{t("nav.categories")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">About:</span>
                  <span className="font-medium">{t("nav.about")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">{t("nav.contact")}</span>
                </div>
              </div>
            </div>

            {/* Homepage Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t("homepage.title")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-medium">{t("homepage.featured.title")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-medium">{t("homepage.categories.title")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Sellers:</span>
                  <span className="font-medium">{t("homepage.bestSellers.title")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Services:</span>
                  <span className="font-medium">{t("homepage.services.title")}</span>
                </div>
              </div>
            </div>

            {/* Product Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t("product.title")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Add to Cart:</span>
                  <span className="font-medium">{t("product.addToCart")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Add to Wishlist:</span>
                  <span className="font-medium">{t("product.addToWishlist")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Out of Stock:</span>
                  <span className="font-medium">{t("product.outOfStock")}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">In Stock:</span>
                  <span className="font-medium">{t("product.inStock")}</span>
                </div>
              </div>
            </div>

            {/* Cart Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t("cart.title")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.subtotal")}:</span>
                  <span className="font-medium">{t("cart.subtotal")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.shipping")}:</span>
                  <span className="font-medium">{t("cart.shipping")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.tax")}:</span>
                  <span className="font-medium">{t("cart.tax")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.total")}:</span>
                  <span className="font-medium">{t("cart.total")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 