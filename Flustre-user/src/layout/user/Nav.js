"use client";

import { useState, useRef, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import NavigationBar from "./NavigationBar";
import CartSidebar from "../../app/_components/cart/CartSidebar";
// import useCategories from "../../lib/hooks/useCategories"; // Removed API integration
 
import LocationModal from "../../app/_components/common/LocationModal";

// Import your data
import {
  featuredProducts as fp,
  bestSellers as bs,
  catalogProducts,
} from "../../lib/data";

// Custom hook to detect bigTablet screen
function useBigTablet() {
  const [isBigTablet, setIsBigTablet] = useState(false);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setIsBigTablet(width >= 992 && width <= 1199.98);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isBigTablet;
}

function NavContent() {
  // All state management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserData] = useState(null);
  
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("UAE");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedMapLocation, setSelectedMapLocation] = useState("UAE");

  // Language removed; default to LTR/static text
  const isRTL = false;

  // Helper: map country to flag path
  const getFlagSrc = (country) => {
    switch (country) {
      case "UAE":
        return "/arabicicon.svg";
      case "KSA":
        return "/ksa.svg";
      case "Egypt":
        return "/Egypt.svg";
      case "Kuwait":
        return "/Kuwait.svg";
      case "Bahrain":
        return "/Bahrain.svg";
      case "Qatar":
        return "/Qatar.svg";
      case "Oman":
        return "/Oman.svg";
      default:
        return "/arabicicon.svg";
    }
  };

  // Refs
  const resultsRef = useRef(null);
  
  const locationRef = useRef(null);

  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isBigTablet = useBigTablet();
  // Static categories - no API integration
  const categories = [
    { name: "Living", image: "/category/category1.jpg" },
    { name: "Bedroom", image: "/category/category2.jpg" },
    { name: "Dining & Kitchen", image: "/category/category3.jpg" },
    { name: "Office", image: "/category/category4.jpg" },
    { name: "Outdoor", image: "/category/category5.jpg" }
  ];
  const categoriesLoading = false;
  const categoriesError = null;

  // Initialize authentication state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        window.localStorage?.getItem("token") ||
        window.localStorage?.getItem("userToken");
      const user = window.localStorage?.getItem("user");

      setAuthToken(token);
      setIsAuthenticated(!!token);
      if (user) {
        try {
          setUserData(JSON.parse(user));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, []);

  // Refresh auth state on route changes (helps reflect login without full refresh)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        window.localStorage?.getItem("token") ||
        window.localStorage?.getItem("userToken");
      const user = window.localStorage?.getItem("user");

      setAuthToken(token);
      setIsAuthenticated(!!token);
      if (user) {
        try {
          setUserData(JSON.parse(user));
        } catch (e) {
          // no-op
        }
      } else {
        setUserData(null);
      }
    }
  }, [pathname]);

  // Build product search list
  const allProducts = useMemo(() => {
    const fpProducts = (fp || []).map((p) => ({
      id: String(p.id),
      name: p.name,
      image: p.image,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category,
    }));

    const bsProducts = (bs || []).map((p) => ({
      id: String(p.id),
      name: p.name,
      image: p.image,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category,
    }));

    const catalogProductsList = (catalogProducts || []).map((p) => ({
      id: String(p.id),
      name: p.name,
      image: p.image,
      price: p.price ? `AED ${p.price}` : undefined,
      originalPrice: p.originalPrice,
      category: p.category || p.type,
    }));

    return [...fpProducts, ...bsProducts, ...catalogProductsList];
  }, []);

  // Search functionality
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const nameMatches = allProducts.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
    const results = nameMatches.slice(0, 8);

    setSearchResults(results);
  }, [searchQuery, allProducts]);

  // Close search results on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (!resultsRef.current?.contains(e.target)) {
        setSearchQuery("");
        setSearchResults([]);
      }
    }
    if (showSearchBar) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSearchBar]);

  

  // Close desktop dropdowns on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      // Check if click is outside all dropdowns
      const isOutsideUserDropdown = !e.target.closest(".user-dropdown");
      const isOutsideLocationDropdown = !e.target.closest(".location-dropdown");

      if (
        isOutsideUserDropdown &&
        isOutsideLocationDropdown
      ) {
        setIsUserDropdownOpen(false);
        setIsLocationDropdownOpen(false);
      }
    }

    if (
      isUserDropdownOpen ||
      isLocationDropdownOpen
    ) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isUserDropdownOpen, isLocationDropdownOpen]);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMobileMenuOpen]);

  // Cart event listeners
  useEffect(() => {
    const openCart = () => setIsCartOpen(true);
    const handler = () => openCart();

    const readCartCount = () => {
      try {
        const raw =
          typeof window !== "undefined"
            ? window.localStorage.getItem("cartItems")
            : null;
        const items = raw ? JSON.parse(raw) : [];
        const count = Array.isArray(items)
          ? items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0)
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("open-cart", handler);
      window.addEventListener("cart-updated", readCartCount);
      window.addEventListener("storage", readCartCount);
      window.__openCart = openCart;
      readCartCount();
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-cart", handler);
        window.removeEventListener("cart-updated", readCartCount);
        window.removeEventListener("storage", readCartCount);
        delete window.__openCart;
      }
    };
  }, []);

  // Event handlers
  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    setShowSearchBar(false);
    router.push("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowSearchBar(false);
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  const openLocationModal = () => {
    setIsLocationModalOpen(true);
    setIsLocationDropdownOpen(false);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  const confirmLocation = () => {
    setSelectedLocation(selectedMapLocation);
    setIsLocationModalOpen(false);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // You can implement reverse geocoding here to get the country
          setSelectedMapLocation("UAE");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Reusable Location Dropdown Component
  const LocationDropdown = ({ isOpen, onClose, className = "" }) => (
    <div
      className={`absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 transition-all duration-200 z-50 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } ${className}`}
    >
      <div className="py-2">
        <button
          onClick={() => handleLocationChange("UAE")}
          className="flex items-center w-full px-3 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
        >
          <Image
            src="/arabicicon.svg"
            alt="UAE Flag"
            width={24}
            height={18}
            className="w-6 h-[25px] rounded-sm mr-2 object-cover"
          />
          <span
            className={`text-sm ${
              selectedLocation === "UAE"
                ? "text-[#2B73B8] font-medium"
                : "text-gray-400"
            }`}
          >
            UAE
          </span>
        </button>
        <button
          onClick={() => handleLocationChange("KSA")}
          className="flex items-center w-full px-3 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
        >
          <Image
            src="/arabicicon.svg"
            alt="KSA Flag"
            width={16}
            height={12}
            className="w-4 h-3 rounded-sm mr-2 object-cover"
          />
          <span
            className={`text-sm ${
              selectedLocation === "KSA"
                ? "text-[#2B73B8] font-medium"
                : "text-gray-400"
            }`}
          >
            KSA
          </span>
        </button>
      </div>
    </div>
  );

  

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const navigateToTab = (tab) => {
    if (pathname === "/my-account") {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      router.push(`/my-account?${params.toString()}`);
    } else {
      router.push(`/my-account?tab=${tab}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage?.removeItem("token");
      window.localStorage?.removeItem("userToken");
      window.localStorage?.removeItem("user");
      window.localStorage?.removeItem("selectedCategory");
      window.sessionStorage?.clear();
    }
    setAuthToken(null);
    setUserData(null);
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    router.push("/login");
  };

  const handleSearchProductClick = (productId) => {
    router.push(`/products/${productId}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchBar(false);
  };

  // Dynamic navigation items from API categories
  const navigationItems = useMemo(() => {
    const items = [
      {
        label: "Products", // Use static text here, will be translated in the component
        hasDropdown: false,
        href: "/products",
      },
    ];

    // Static categories and subcategories
    const staticCategories = [
      {
        name: "Living",
        subcategories: [
          "Sofas & Sectionals",
          "Coffee Tables",
          "TV Units / Entertainment Centers",
          "Recliners",
          "Side Tables",
          "Console Tables",
          "Ottomans & Stools",
        ],
      },
      {
        name: "Bedroom",
        subcategories: [
          "Beds (King, Queen, Single)",
          "Wardrobes & Closets",
          "Dressers & Mirrors",
          "Nightstands",
          "Bedside Tables",
          "Mattresses",
          "Headboards",
        ],
      },
      {
        
        name: "Dining & Kitchen",
        subcategories: [
          "Kitchen Cabinets",
          "Kitchen Appliances",
          "Kitchen Storage",
          "Kitchen Tools",
          "Kitchen Decor",
          "Dining Tables",
          "Dining Chairs",
          "Dining Sets",
          "Bar Units",
          "Sideboards / Buffets",
        ],
      },
      {
        name: "Office",
        subcategories: [

          
          "Office Chairs",
          "Office Desks",
          "Conference Tables",
          "File Cabinets",
          "Bookcases",
          "Reception Desks",
        ],
      },
      {
        name: "Outdoor",
        subcategories: [
          "Patio Chairs & Tables",
          "Garden Benches",
          "Hammocks",
          "Outdoor Sofas & Loungers",
          "Umbrellas & Gazebos",
        ],
      },
   
   
    ];

    // Add static categories first
    staticCategories.forEach((category) => {
      const hasSubcategories = Array.isArray(category.subcategories) && category.subcategories.length > 0;
      items.push({
        label: category.name,
        hasDropdown: hasSubcategories,
        href: `/products?category=${encodeURIComponent(category.name)}`,
        submenu: hasSubcategories ? category.subcategories : [],
      });
    });

    // Add categories from API
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        const hasSubcategories =
          category.subcategories &&
          Array.isArray(category.subcategories) &&
          category.subcategories.length > 0;

        items.push({
          label: category.name,
          hasDropdown: hasSubcategories,
          href: `/products?category=${encodeURIComponent(category.name)}`,
          submenu: hasSubcategories
            ? category.subcategories.map((sub) => sub.name || sub)
            : [],
        });
      });
    }

    return items;
  }, [categories]);

  // No translations; use navigationItems directly

  return (
    <>
      <nav
        className="bg-white shadow-sm sticky top-0 z-50 relative"
        style={{ isolation: "isolate" }}
        dir={"ltr"}
      >
        {/* Main Header */}
        <div className="bg-white">
          <div className={`container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 xl:px-12 2xl:px-16 text-left`}>
            <div className={`flex items-center h-3 lg:h-16 justify-between`}>
              {/* Desktop Logo */}
              <div className="flex-shrink-0 pr-6 hidden lg:block">
                <Link href="/" className="flex items-center">
                  <Image
                    src="https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Logo/Asset+1.svg"
                    alt="Flustre"
                    width={200}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

            

              {/* Desktop Search Bar */}
              <div className="hidden lg:flex lg:items-center flex-1 justify-center">
                {showSearchBar ? (
                  <div className="relative">
                    <div
                      className="flex items-center h-10 rounded-lg px-4 w-[350px] md:w-[500px] lg:w-[450px] xl:w-[550px]"
                      style={{
                        borderRadius: "8px",
                        border: "1px solid rgba(0, 0, 0, 0.10)",
                        background: "rgba(0, 0, 0, 0.02)",
                      }}
                    >
                      <Image
                        src="/searchicon.svg"
                        alt="search"
                        width={16}
                        height={16}
                        className="w-4 h-4 mr-2 opacity-60"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={"Search for products..."}
                        className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
                      />
                    </div>
                    {searchQuery.trim().length > 0 && (
                      <div
                        ref={resultsRef}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[400px] md:w-[700px] lg:w-[520px] xl:w-[640px] bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto z-50"
                      >
                        {searchResults.length > 0 ? (
                          searchResults.map((p) => (
                            <div
                              key={`${p.id}-${p.name}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleSearchProductClick(p.id)}
                            >
                              {p.image && (
                                <Image
                                  src={p.image}
                                  alt={p.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/40x40?text=Product";
                                  }}
                                  unoptimized={p.image?.includes(
                                    "amazonaws.com"
                                  )}
                                />
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="text-gray-900 text-sm font-medium truncate">
                                  {p.name}
                                </span>
                                {(p.category || p.price) && (
                                  <span className="text-xs text-gray-500 truncate">
                                    {p.category ? `${p.category}` : ""}
                                    {p.category && p.price ? " · " : ""}
                                    {p.price ? `${p.price}` : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-6 text-gray-500">
                            <Image
                              src="/searchicon.svg"
                              alt="no results"
                              width={16}
                              height={16}
                              className="w-4 h-4 opacity-60"
                            />
                            <span className="text-sm">No products found</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="flex items-center h-10 rounded-lg px-4 w-[350px] md:w-[500px] lg:w-[450px] xl:w-[550px] cursor-pointer"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid rgba(0, 0, 0, 0.10)",
                      background: "rgba(0, 0, 0, 0.02)",
                    }}
                    onClick={() => setShowSearchBar(true)}
                  >
                    <Image
                      src="/searchicon.svg"
                      alt="search"
                      width={16}
                      height={16}
                      className={`w-4 h-4 opacity-60 mr-2`}
                    />
                    <input
                      type="text"
                      placeholder={"Search for products..."}
                      className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 cursor-pointer"
                      readOnly
                    />
                  </div>
                )}
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex lg:items-center flex-shrink-0">
                <div
                  className={`flex items-center ${
                    isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                  }`}
                >
                  
                  {/* Wishlist */}
                  <Link
                    href="/wishlist"
                    className="relative p-2 text-gray-600 hover:text-[#2B73B8] transition-colors duration-200 cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Image
                      src="/like-black.svg"
                      alt="wishlist"
                      width={24}
                      height={20}
                      className="w-6 h-5"
                    />
                  </Link>

                  {/* Cart */}
                  <button
                    onClick={toggleCart}
                    className="relative p-2 text-gray-600 hover:text-[#2B73B8] transition-colors duration-200 cursor-pointer"
                  >
                    <Image
                      src="/Carticon.svg"
                      alt="cart"
                      width={44}
                      height={44}
                      className="w-[44px] h-[44px]"
                    />
                    {cartCount > 0 && (
                      <span
                        className="absolute top-3.5 right-3.5 block w-3 h-3 rounded-full bg-[#2B73B8]"
                        aria-label={`Cart items: ${cartCount}`}
                        title={`${cartCount}`}
                      />
                    )}
                  </button>

                  {/* User Profile / Login */}
                  <div className="relative group user-dropdown">
                    <button
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-[#2B73B8] transition-colors duration-200 cursor-pointer"
                      onClick={toggleUserDropdown}
                    >
                      <Image
                        src="/usericon.svg"
                        alt="user"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <Image
                        src="/dropdownicon.svg"
                        alt="dropdown"
                        width={8}
                        height={5}
                        className={`w-[8px] h-[5px] transition-transform duration-200 ${
                          isUserDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* User Dropdown */}
                    <div
                      className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 z-50 ${
                        isUserDropdownOpen ||
                        "group-hover:opacity-100 group-hover:visible"
                      } ${
                        isUserDropdownOpen
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                    >
                      <div className="py-2">
                        {isAuthenticated ? (
                          <>
                            <button
                              onClick={() => {
                                navigateToTab("account");
                                setIsUserDropdownOpen(false);
                              }}
                              className="flex items-center w-full text-left px-4 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
                            >
                              <svg
                                className="w-4 h-4 mr-3"
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
                              Personal Information
                            </button>

                            <button
                              onClick={() => {
                                navigateToTab("my-orders");
                                setIsUserDropdownOpen(false);
                              }}
                              className="flex items-center w-full text-left px-4 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
                            >
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                              </svg>
                              Orders
                            </button>

                            <button
                              onClick={() => {
                                navigateToTab("saved-address");
                                setIsUserDropdownOpen(false);
                              }}
                              className="flex items-center w-full text-left px-4 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
                            >
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Addresses
                            </button>

                            <button
                              onClick={() => {
                                navigateToTab("help");
                                setIsUserDropdownOpen(false);
                              }}
                              className="flex items-center w-full text-left px-4 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
                            >
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM9.75 9a2.25 2.25 0 114.5 0c0 1.5-2.25 1.875-2.25 3.375m0 3.375h.008v.008H12v-.008z"
                                />
                              </svg>
                              Help & Support
                            </button>

                            <button
                              onClick={() => {
                                navigateToTab("privacy-policy");
                                setIsUserDropdownOpen(false);
                              }}
                                className="flex items-center w-full text-left px-4 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
                            >
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Privacy & Policy
                            </button>

                            <hr className="my-2" />

                            <button
                              onClick={handleSignOut}
                              className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                            >
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => navigateToTab("help")}
                              className="flex items-center w-full text-left px-4 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
                            >
                              <Image
                                src="/icon3.svg"
                                alt="help support"
                                width={20}
                                height={20}
                                className="w-5 h-5 mr-3"
                              />
                              Help & Support
                            </button>

                            <button
                              onClick={() => navigateToTab("privacy-policy")}
                              className="flex items-center w-full text-left px-4 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-red-50 hover:text-[#2B73B8]"
                            >
                              <Image
                                src="/icon8.svg"
                                alt="privacy policy"
                                width={20}
                                height={20}
                                className="w-5 h-5 mr-3"
                              />
                              Privacy & Policy
                            </button>

                            <hr className="my-2" />

                            <button
                              onClick={handleLogin}
                              className="flex items-center w-full text-left px-4 py-2 text-[#2B73B8] hover:bg-red-50 hover:text-[#2B73B8] transition-colors duration-200 cursor-pointer"
                            >
                              <Image
                                src="/usericon.svg"
                                alt="login"
                                width={20}
                                height={20}
                                className="w-5 h-5 mr-3"
                              />
                              Login
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <NavigationBar navigationItems={navigationItems} />

          {/* Mobile Layout */}
          <div className={`lg:hidden flex items-center justify-between w-full h-12 px-3 md:px-6`}>
            {/* Left Group - Hamburger and Logo */}
            <div className={`flex items-center ${isRTL ? "ml-2" : "ml-2"}`}>
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-1.5 rounded-lg text-gray-600 hover:text-[#2B73B8] hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>

              {!showSearchBar && (
              <div className={`flex items-center ml-2`}>
                  <Link href="/" className="flex items-center">
                    <Image
                      src="https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Logo/Asset+1.svg"
                      alt="Flustre"
                      width={120}
                      height={20}
                      className="h-5 w-auto"
                    />
                  </Link>
                </div>
              )}
            </div>

            {/* Center Group - Search Bar */}
            {showSearchBar && (
              <div className={`flex-1 flex justify-center mx-2`}>
                <div className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[400px]">
                  <div className="relative">
                    <div className="flex items-center h-10 border border-gray-300 rounded-lg px-3 bg-white">
                      <Image
                        src="/searchicon.svg"
                        alt="search"
                        width={16}
                        height={16}
                        className={`w-4 h-4 opacity-60 ${
                          isRTL ? "ml-2" : "mr-2"
                        }`}
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={"Search for products..."}
                        className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
                      />
                    </div>
                    {searchQuery.trim().length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto z-50">
                        {searchResults.length > 0 ? (
                          searchResults.map((p) => (
                            <div
                              key={`${p.id}-${p.name}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleSearchProductClick(p.id)}
                            >
                              {p.image && (
                                <Image
                                  src={p.image}
                                  alt={p.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/40x40?text=Product";
                                  }}
                                  unoptimized={p.image?.includes(
                                    "amazonaws.com"
                                  )}
                                />
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="text-gray-900 text-sm font-medium truncate">
                                  {p.name}
                                </span>
                                {(p.category || p.price) && (
                                  <span className="text-xs text-gray-500 truncate">
                                    {p.category ? `${p.category}` : ""}
                                    {p.category && p.price ? " · " : ""}
                                    {p.price ? `${p.price}` : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-6 text-gray-500">
                            <Image
                              src="/searchicon.svg"
                              alt="no results"
                              width={16}
                              height={16}
                              className="w-4 h-4 opacity-60"
                            />
                            <span className="text-sm">No products found</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Right Group - Search Icon and Cart */}
            <div className={`flex items-center space-x-1`}>
              {showSearchBar ? (
                <button
                  onClick={() => setShowSearchBar(false)}
                  className="p-1.5 text-gray-600 hover:text-[#2B73B8] transition-colors duration-200 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setShowSearchBar(true)}
                  className="p-1.5 text-gray-600 hover:text-[#2B73B8] transition-colors duration-200 cursor-pointer"
                >
                  <Image
                    src="/searchicon.svg"
                    alt="search"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </button>
              )}

              

              {/* Mobile Wishlist - Hidden on small screens */}
              <Link
                href="/wishlist"
                  className="relative p-1.5 text-gray-600 hover:text-[#2B73B8] transition-colors duration-200 cursor-pointer"
                aria-label="Wishlist"
              >
                <Image
                  src="/like-black.svg"
                  alt="wishlist"
                  width={20}
                  height={18}
                  className="w-5 h-[18px]"
                />
              </Link>

              {/* Mobile Cart */}
              <button
                onClick={toggleCart}
                className="relative py-1.5 px-0 text-gray-600 hover:text-[#2B73B8] transition-colors duration-200 cursor-pointer"
              >
                <Image
                  src="/Carticon.svg"
                  alt="cart"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                {cartCount > 0 && (
                  <span
                    className={`absolute top-3 block w-2 h-2 rounded-full bg-[#2B73B8] ${
                      isRTL ? "left-3" : "right-3"
                    }`}
                    aria-label={`Cart items: ${cartCount}`}
                    title={`${cartCount}`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Deliver-To Strip (below navbar) */}
        {/* <div className="lg:hidden w-full bg-white border-t border-b border-gray-200">
          <button
            onClick={openLocationModal}
            className={`container mx-auto px-3 md:px-6 h-8 w-full flex items-center ${
              isRTL ? "flex-row-reverse" : ""
            } text-gray-700`}
            aria-label="Delivery Location"
            style={{
              paddingLeft: "1.8rem",
            }}
          >
            <Image
              src={getFlagSrc(selectedLocation)}
              alt="Location Flag"
              width={16}
              height={12}
              className={`w-4 h-3 rounded-sm ${
                isRTL ? "ml-2" : "mr-2"
              } object-cover`}
            />
            <span className="text-xs text-gray-600">Deliver to</span>
            <span
              className={`text-xs font-semibold ${isRTL ? "mr-1" : "ml-1"}`}
            >
              {selectedLocation}
            </span>
            <Image
              src="/dropdownicon.svg"
              alt="dropdown"
              width={10}
              height={6}
              className={`w-[10px] h-[6px] ${
                isRTL ? "mr-1" : "ml-1"
              } transition-transform duration-200 ${
                isLocationModalOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div> */}

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "fixed inset-x-0 top-14 bottom-0 bg-white z-[9999] opacity-100 overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-0 pb-6 space-y-2 bg-white border-t border-gray-200">
            {/* Mobile Navigation Items */}
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-100 last:border-b-0"
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between w-full py-3 ${
                      isRTL ? "text-right" : "text-left"
                    } text-gray-700 font-normal transition-colors duration-200 cursor-pointer hover:text-[#2B73B8]`}
                    onClick={(e) => {
                      if (item.label === "Products") {
                        e.preventDefault();
                        if (typeof window !== "undefined") {
                          window.localStorage?.removeItem("selectedCategory");
                        }
                        router.push("/products");
                      }
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between w-full py-3 ${
                      isRTL ? "text-right" : "text-left"
                    } text-gray-700 font-normal transition-colors duration-200 cursor-pointer hover:text-[#2B73B8]`}
                    onClick={(e) => {
                      if (item.hasDropdown) {
                        e.preventDefault();
                        toggleDropdown(item.label);
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <Image
                        src="/dropdownicon.svg"
                        alt="dropdown"
                        width={7}
                        height={4}
                        className={`w-[7px] h-[4px] transition-transform duration-200 ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                )}

                {/* Mobile Submenu */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div className={`${isRTL ? "pr-4" : "pl-4"} pb-2 space-y-1`}>
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={`/products?category=${encodeURIComponent(
                          subItem
                        )}`}
                        className={`block py-2 text-gray-600 transition-colors duration-200 cursor-pointer hover:text-[#2B73B8] ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile User Section */}
            <div>
              <div className="space-y-2">
                {/* Wishlist - moved here, icon first */}

                
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/my-account");
                      }}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                      } hover:text-[#2B73B8]`}
                    >
                      <Image
                        src="/icon7.svg"
                        alt="personal info"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span>Personal Information</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/my-account?tab=my-orders");
                      }}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                        } hover:text-[#2B73B8]`}
                    >
                      <Image
                        src="/icon6.svg"
                        alt="my orders"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span>Orders</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/my-account?tab=saved-address");
                      }}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                      } hover:text-[#2B73B8]`}
                    >
                      <Image
                        src="/icon4.svg"
                        alt="addresses"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span>Addresses</span>
                    </button>

                    <button
                      onClick={() => navigateToTab("help")}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                      } hover:text-[#2B73B8]`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM9.75 9a2.25 2.25 0 114.5 0c0 1.5-2.25 1.875-2.25 3.375m0 3.375h.008v.008H12v-.008z"
                        />
                      </svg>
                      <span>Help & Support</span>
                    </button>

                    <button
                      onClick={() => navigateToTab("privacy-policy")}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                      } hover:text-[#2B73B8]`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 12a3 3 0 013 3v3H9v-3a3 3 0 013-3zm0-7a5 5 0 00-5 5v2h10V10a5 5 0 00-5-5z"
                        />
                      </svg>
                      <span>Privacy & Policy</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                      } hover:text-[#2B73B8]`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/my-account?tab=help");
                      }}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                      } hover:text-[#2B73B8]`}
                    >
                      <Image
                        src="/icon3.svg"
                        alt="help support"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span>Help & Support</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/my-account?tab=privacy-policy");
                      }}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                      } hover:text-[#2B73B8]`}
                    >
                      <Image
                        src="/icon8.svg"
                        alt="privacy policy"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span>Privacy & Policy</span>
                    </button>
                    <hr
                      className="my-1"
                      style={{ borderColor: "rgba(0,0,0,0.15)" }}
                    />

                    <button
                      onClick={handleLogin}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      } py-2 text-gray-700 transition-colors duration-200 cursor-pointer w-full ${
                        isRTL ? "text-right" : "text-left"
                      } hover:text-[#2B73B8]`}
                    >
                      <Image
                        src="/usericon.svg"
                        alt="login"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span>Login</span>
                    </button>
               
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        selectedMapLocation={selectedMapLocation}
        setSelectedMapLocation={setSelectedMapLocation}
        onConfirm={confirmLocation}
        onUseCurrentLocation={useCurrentLocation}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .lg-scrollbar-hide {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .lg-scrollbar-hide::-webkit-scrollbar {
          display: none !important;
        }
      `,
        }}
      />
    </>
  );
}

export default function Nav() {
  return (
    <Suspense
      fallback={
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ">
          <div className="max-w-7xl mx-auto px-0.5 sm:px-0.5 lg:px-0.5">
            <div className="flex items-center h-20 justify-between">
              <div className="flex-shrink-0 pr-4 hidden lg:block">
                <Image
                  src="https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Logo/Asset+1.svg"
                  alt="Flustre"
                  width={200}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
              </div>
            </div>
          </div>
        </nav>
      }
    >
      <NavContent />
    </Suspense>
  );
}
