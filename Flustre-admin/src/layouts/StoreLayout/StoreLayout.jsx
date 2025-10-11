import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { useSelector, useDispatch } from "react-redux";
import { setStore } from "../../redux/features/storeSlice";
import { persistor } from "../../redux/store";

function StoreLayout() {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store.store);
  const menuItems = [
    { name: "Dashboard", path: "/store" },
    { name: "Products", path: "product" },
    { name: "Enquiry", path: "enquiry" },
    { name: "Orders", path: "order" },
    { name: "Categories", path: "category" },
    { name: "SubCategories", path: "subcategory" },
    { name: "Brands", path: "brand" },
    { name: "Labels", path: "label" },
    { name: "Customers", path: "customer" },
    { name: "Banners", path: "banner" },
    { name: "Banners With Links", path: "banner-with-link" },
    // { name: "Active Offers", path: "active-offer" },
    { name: "Sales", path: "sales" },
    { name: "Inventory", path: "inventory" },
  ];
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("storeToken");
    persistor.purge();
    dispatch(setStore(null));
    navigate("/");
  };
  return (
    <div className="h-screen ">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              {/* Togglebutton */}
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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

              <Logo />
            </div>
            <div className="flex items-center justify-center bg-green-500 rounded-full px-4 py-2  text-white cursor-pointer text-center">
              <span className="whitespace-nowrap">{store?.store_name}</span>
            </div>
          </div>
        </div>
      </nav>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => item.path && navigate(item.path)}
                className="border border-base-200 p-2 hover:cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                <span className="ms-3 whitespace-nowrap">{item.name}</span>
              </li>
            ))}
            <li
              onClick={logout}
              className="border border-base-200 p-2 hover:cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <span className="ms-3 whitespace-nowrap">Logout</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* content */}
      <div className="p-4 sm:ml-64 bg-gray-100 min-h-screen">
        <div className="p-4 mt-14">
          <div className="relative  ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreLayout;
