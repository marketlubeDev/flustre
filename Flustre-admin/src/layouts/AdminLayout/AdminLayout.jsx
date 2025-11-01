import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../components/Logo";
import TopNavbar from "../../components/Admin/TopNavbar";
import { adminLogout } from "../../sevices/adminApis";
import { useSelector, useDispatch } from "react-redux";
import { setStore } from "../../redux/features/storeSlice";
import { persistor } from "../../redux/store";
import { FaInstagram } from "react-icons/fa";
import useMenuCounts from "../../hooks/useMenuCounts";

function AdminLayout() {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store.store);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { menuCounts } = useMenuCounts();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      count: null,
      icon: (
        <img
          src="/icons/MenuIcon1.svg"
          alt="Dashboard"
          className="w-5 h-5"
          style={{ filter: "brightness(0) saturate(100%)" }}
        />
      ),
    },
    {
      name: "Products",
      path: "product",
      count: menuCounts.products,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Orders",
      path: "order",
      count: menuCounts.orders,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
    },
    {
      name: "Categories",
      path: "category",
      count: menuCounts.categories,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: "SubCategories",
      path: "subcategory",
      count: menuCounts.subcategories,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      ),
    },
    {
      name: "Banners",
      path: "banner",
      count: menuCounts.banners,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          />
        </svg>
      ),
    },
    {
      name: "Labels",
      path: "label",
      count: menuCounts.labels,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z"
          />
        </svg>
      ),
    },
    {
      name: "Coupons",
      path: "coupon",
      count: menuCounts.coupons,
      icon: (
        <img
          src="/icons/Menu Icon3.svg"
          alt="Coupons"
          className="w-5 h-5"
          style={{ filter: "brightness(0) saturate(100%)" }}
        />
      ),
    },
    {
      name: "Insta Carousel",
      path: "insta-carousel",
      count: menuCounts.instaCarousel,
      icon: (
        <FaInstagram
          className="w-5 h-5"
          style={{ filter: "brightness(0) saturate(100%)" }}
        />
      ),
    },
    {
      name: "Reviews",
      path: "review",
      count: menuCounts.reviews,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      name: "Customers",
      path: "customer",
      count: menuCounts.customers,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    // {
    //   name: "Active Offers",
    //   path: "active-offer",
    //   count: 5,
    //   icon: (
    //     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    //       <path
    //         fillRule="evenodd"
    //         d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   name: "Sales",
    //   path: "sales",
    //   count: null,
    //   icon: (
    //     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    //       <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
    //     </svg>
    //   )
    // },
    // {
    //   name: "Inventory",
    //   path: "inventory",
    //   count: null,
    //   icon: (
    //     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    //       <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
    //     </svg>
    //   )
    // },
    // {
    //   name: "Feedback",
    //   path: "feedback",
    //   count: 24,
    //   icon: (
    //     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    //       <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"/>
    //     </svg>
    //   )
    // }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    persistor.purge();
    dispatch(setStore(null));
    navigate("/");
  };

  const isActiveRoute = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    // Use exact path matching to prevent subcategory from activating category
    return (
      location.pathname === `/admin/${path}` ||
      location.pathname === `/admin/${path}/`
    );
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Top Navigation */}
      <TopNavbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 border-r border-gray-200 shadow-lg`}
        style={{ backgroundColor: "#3573ba11" }}
        aria-label="Sidebar"
      >
        <div
          className="h-full pl-6 pr-4 pb-4 overflow-y-auto scrollbar-hide"
          style={{ backgroundColor: "#3573BA05" }}
        >
          {/* Logo Section */}
          <div className="pt-6 pb-4 border-b border-gray-200 mb-6">
            <Logo />
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img
                  src="/icons/searchicon.svg"
                  alt="Search"
                  className="w-4 h-4"
                />
              </div>
              <input
                type="text"
                placeholder="Search or jump to"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Menu Section */}
          <div className="mt-2">
            <p className="px-4 text-xs font-normal text-gray-400 uppercase tracking-wider mb-4">
              MAIN MENU
            </p>
            <ul className="space-y-1">
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => item.path && navigate(item.path)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                        isActiveRoute(item.path)
                          ? "border-l-2"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      style={
                        isActiveRoute(item.path)
                          ? {
                              backgroundColor: "#3573BA0D",
                              borderLeftColor: "#3573BA",
                              color: "#3573BA",
                            }
                          : {}
                      }
                    >
                      <div
                        className={`mr-3 flex items-center ${
                          isActiveRoute(item.path)
                            ? ""
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      >
                        {React.cloneElement(item.icon, {
                          style: {
                            ...item.icon.props.style,
                            filter: isActiveRoute(item.path)
                              ? "brightness(0) saturate(100%) invert(39%) sepia(24%) saturate(1256%) hue-rotate(175deg) brightness(90%) contrast(97%)"
                              : item.icon.props.style?.filter ||
                                "brightness(0) saturate(100%) invert(47%) sepia(8%) saturate(1077%) hue-rotate(185deg) brightness(95%) contrast(88%)",
                          },
                        })}
                      </div>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.count && (
                        <div
                          className="px-2 py-1 text-xs font-medium rounded-full min-w-[20px] text-center"
                          style={{
                            backgroundColor: "#3573BA1F",
                            color: "#3573BA",
                          }}
                        >
                          {item.count}
                        </div>
                      )}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  No results found
                </li>
              )}
            </ul>
          </div>

          {/* Logout Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="mr-3 text-red-500">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  />
                </svg>
              </div>
              <span className="flex-1 text-left">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div
        className="sm:ml-64 bg-white"
        style={{ height: "calc(100vh - 56px)", marginTop: "56px" }}
      >
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
