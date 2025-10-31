"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCategories from "../../lib/hooks/useCategories";

// You can move this to a separate constants file if needed

const socialLinks = [
  { name: "X (Twitter)", icon: "/link1.svg", href: "#" },
  { name: "Facebook", icon: "/link2.svg", href: "#" },
  { name: "Instagram", icon: "/link3.svg", href: "#" },
  { name: "YouTube", icon: "/link4.svg", href: "#" },
];

export default function Footer() {
  const router = useRouter();
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const { categories, loading: categoriesLoading } = useCategories();
  const navigationLinks = Array.isArray(categories)
    ? categories.map((c) => c?.name).filter(Boolean)
    : [];

  const normalizeSlug = (value) =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleCategoryClick = (categoryName) => {
    router.push(`/category/${normalizeSlug(categoryName)}`);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleMarketlubeClick = () => {
    window.open("https://www.marketlube.in/", "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="bg-[#B2C1DF] text-white overflow-hidden">
      <div className="flex flex-col items-center px-4 pt-6 pb-8 sm:pt-8 sm:pb-12 lg:pt-12 lg:pb-16">
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 items-center justify-start w-full max-w-6xl">
          {/* Logo Section */}
          <div className="flex justify-center w-full">
            <button
              onClick={handleLogoClick}
              className="relative h-12 w-48 sm:h-16 sm:w-64 lg:h-20 lg:w-80 hover:opacity-80 transition-opacity duration-200"
              aria-label="Go to homepage"
            >
              <Image
                src="https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Logo/Asset+1.svg"
                alt="Flustre Logo"
                fill
                className="object-contain"
                priority
              />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="w-full">
            <ul className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 w-full text-sm sm:text-base lg:text-lg font-medium leading-normal tracking-tight">
              {navigationLinks.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="text-[#000000] hover:text-gray-700 transition-colors duration-200 whitespace-nowrap px-2 py-1"
                    aria-label={`Browse ${category} products`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Divider */}
          <div className="w-full h-px bg-[#000000]/20" />

          {/* Social Media Icons */}
          <div className="flex gap-6 sm:gap-8 lg:gap-10 items-center justify-center">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="relative w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
                onMouseEnter={() => setHoveredSocial(index)}
                onMouseLeave={() => setHoveredSocial(null)}
                aria-label={`Visit our ${social.name} page`}
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  fill
                  className="object-contain"
                />
              </Link>
            ))}
          </div>

          {/* Copyright and Powered By */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center text-center">
            <p className="text-black/40 text-xs sm:text-sm lg:text-base font-normal whitespace-nowrap">
              © 2025 Flustre All rights reserved
            </p>

            <div className="hidden sm:block w-px h-4 bg-[#000000]/20" />

            <p className="text-[#000000]/40 text-xs sm:text-sm lg:text-base font-normal">
              Powered by{" "}
              <button
                onClick={handleMarketlubeClick}
                className="text-[#00000]/40 hover:text-[#000000]/60 transition-colors duration-200 underline focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
                aria-label="Visit Marketlube website"
              >
                Marketlube
              </button>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
