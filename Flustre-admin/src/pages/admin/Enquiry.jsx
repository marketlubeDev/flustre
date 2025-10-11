import PageHeader from "../../components/Admin/PageHeader";
import DateRangePicker from "../../components/shared/Datepicker";
import Ordercards from "../../components/Admin/Order/Ordercards";
import { getcategoriesbrands } from "../../sevices/adminApis";
import {
  getOrders,
  getOrderStats,
  updateOrder,
  updateOrderStatus,
  deleteEnquiry,
} from "../../sevices/OrderApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { useEffect, useState, useRef } from "react";
import { TfiReload } from "react-icons/tfi";
import { toast } from "react-toastify";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

import { FaRegEdit, FaTrash } from "react-icons/fa";
import { Modal } from "../../components/shared/Modal";
import Pagination from "../../components/Admin/Product/components/Pagination/Pagination";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";

function Enquiry({ role }) {
  const store = useSelector((state) => state.store.store);
  const stores = useSelector((state) => state.adminUtilities.stores);
  const [formUtilites, setFormUtilites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (role === "store") {
      setSelectedStore(store._id);
    }
  }, [role, store]);

  // Move fetchData outside of useEffect so it can be reused
  const fetchData = async (page = currentPage) => {
    try {
      setIsLoading(true);
      const [startDate, endDate] = dateRange;

      let queryParams = [];

      // Add page to query params
      queryParams.push(`page=${page}`);
      queryParams.push(`type=enquiry`);

      if (startDate && endDate) {
        const formattedStartDate = new Date(
          startDate.setHours(0, 0, 0, 0)
        ).toISOString();
        const formattedEndDate = new Date(
          endDate.setHours(23, 59, 59, 999)
        ).toISOString();

        queryParams.push(`startDate=${formattedStartDate}`);
        queryParams.push(`endDate=${formattedEndDate}`);
      }

      if (selectedCategory) {
        queryParams.push(`category=${selectedCategory}`);
      }

      if (selectedStatus) {
        queryParams.push(`status=${selectedStatus.toLowerCase()}`);
      }

      if (selectedStore) {
        queryParams.push(`store=${selectedStore}`);
      }

      const queryString = `?${queryParams.join("&")}`;

      const [ordersRes, statsRes] = await Promise.all([
        getOrders(queryString),
        getOrderStats(),
      ]);

      setOrders(ordersRes?.data?.orders);
      setOrderStats(statsRes.stats);
      setTotalPages(ordersRes?.data?.pagination?.totalPages || 1);
      setCurrentPage(ordersRes?.data?.pagination?.page || 1);
      setErrorMessage("");
    } catch (err) {
      setOrders([]);
      setErrorMessage(err.response?.data?.message || "No orders found");
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to use the new fetchData function
  useEffect(() => {
    fetchData(1); // Reset to first page when filters change
  }, [dateRange, selectedCategory, selectedStatus, selectedStore]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getcategoriesbrands();
        setFormUtilites(res.data);
      } catch (err) {
        toast.error("Failed to fetch categories and brands");
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      fetchData(page);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, selectedCategory, selectedStatus, selectedStore]);

  const ConfirmationPopup = ({ isOpen, onClose, onConfirm, status }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to change the status to "{status}"?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StatusDropdown = ({ currentStatus, options, onStatusChange, type }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const buttonRef = useRef(null);

    // Check if status changes should be disabled
    // const isStatusChangeDisabled = currentStatus === "delivered";
    const isStatusChangeDisabled = false;

    const handleStatusClick = (status) => {
      if (isStatusChangeDisabled) return;
      setSelectedStatus(status);
      setShowConfirmation(true);
    };

    const handleConfirm = () => {
      onStatusChange(selectedStatus);
      setShowConfirmation(false);
      setSelectedStatus(null);
    };

    const getStatusColor = (status) => {
      const colors = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
        processed: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        onrefound: "bg-amber-100 text-amber-800",
        refunded: "bg-gray-100 text-gray-800",
        cancelled: "bg-red-100 text-red-800",
      };
      return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const formatStatusDisplay = (status) => {
      const displayFormats = {
        pending: "Pending",
        processed: "Processed",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
        refunded: "Refunded",
        onrefound: "On Refund",
        paid: "Paid",
        failed: "Failed",
        onrefund: "On Refund",
      };
      return displayFormats[status] || status;
    };

    return (
      <td className="px-6 py-4">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                ref={buttonRef}
                className={`
                  ${open ? "outline-none ring-2 ring-indigo-500" : ""}
                  inline-flex items-center gap-2
                  ${
                    isStatusChangeDisabled
                      ? "cursor-not-allowed opacity-75"
                      : ""
                  }
                `}
                disabled={isStatusChangeDisabled}
                title={
                  isStatusChangeDisabled
                    ? "Status cannot be changed after delivery"
                    : ""
                }
              >
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    currentStatus
                  )}`}
                >
                  {formatStatusDisplay(currentStatus)}
                </span>
                {!isStatusChangeDisabled && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      open ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </Popover.Button>

              {window &&
                createPortal(
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel
                      className="fixed z-[100] w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                      style={{
                        ...(() => {
                          const buttonRect =
                            buttonRef.current?.getBoundingClientRect();
                          if (!buttonRect) return {};

                          const spaceBelow =
                            window.innerHeight - buttonRect.bottom;
                          const spaceAbove = buttonRect.top;
                          const dropdownHeight = 300; // Approximate height of dropdown

                          // If there's not enough space below and more space above, position above
                          if (
                            spaceBelow < dropdownHeight &&
                            spaceAbove > spaceBelow
                          ) {
                            return {
                              bottom: `${
                                window.innerHeight - buttonRect.top
                              }px`,
                              left: `${buttonRect.left}px`,
                              transform: "translateY(-8px)",
                            };
                          }

                          // Default position (below)
                          return {
                            top: `${buttonRect.bottom}px`,
                            left: `${buttonRect.left}px`,
                            transform: "translateY(8px)",
                          };
                        })(),
                      }}
                    >
                      <div className="py-1">
                        {options?.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusClick(status)}
                            className={`
                            block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100
                            ${currentStatus === status ? "bg-gray-50" : ""}
                          `}
                          >
                            {formatStatusDisplay(status)}
                          </button>
                        ))}
                      </div>
                    </Popover.Panel>
                  </Transition>,
                  document.body
                )}
            </>
          )}
        </Popover>

        <ConfirmationPopup
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirm}
          status={`${
            type === "payment" ? "Payment" : "Order"
          } status to ${formatStatusDisplay(selectedStatus)}`}
        />
      </td>
    );
  };

  const TableRow = ({ order, type, onDelete }) => {
    const [paymentStatus, setPaymentStatus] = useState(
      order.paymentStatus || "pending"
    );
    const [orderStatus, setOrderStatus] = useState(order.status || "pending");
    const [isEditMobileModalOpen, setIsEditMobileModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updateData, setUpdateData] = useState({
      mobile: order.mobile || null,
      address: order.address || "",
    });

    let paymentOptions = ["pending", "paid", "failed", "refunded", "onrefund"];

    if (type === "enquiry") {
      paymentOptions = ["pending", "paid", "failed"];
    }

    let orderOptions = [
      "pending",
      "confirmed",
      "processed",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
      "onrefund",
    ];

    if (type === "enquiry") {
      orderOptions = ["pending", "confirmed"];
    }

    const handlePaymentStatusChange = async (newStatus) => {
      try {
        const result = await updateOrderStatus(order._id, newStatus, "payment");
        if (result?.data?.success) {
          setPaymentStatus(newStatus);
          toast.success(result?.data?.message);
          // Refresh data after successful status update
          await fetchData();
        } else {
          toast.error(result?.data?.message);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update payment status"
        );
      }
    };

    const handleOrderStatusChange = async (newStatus) => {
      try {
        const result = await updateOrderStatus(order._id, newStatus, "order");
        if (result?.data?.success) {
          setOrderStatus(newStatus);
          toast.success(result?.data?.message);
          // Refresh data after successful status update
          await fetchData();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update order status"
        );
      }
    };

    const getAvailableOrderOptions = () => {
      // if (orderStatus === "delivered") {
      //   return ["delivered"]; // Only show current status if delivered
      // }
      return orderOptions;
    };

    const handleEditMobile = () => {
      setIsEditMobileModalOpen(true);
    };

    const handleInputChange = (e) => {
      setUpdateData({ ...updateData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
      try {
        const result = await updateOrder(order._id, updateData);
        if (result.success) {
          toast.success(result.message);
          setIsEditMobileModalOpen(false);
          await fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDeleteClick = () => {
      setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
      try {
        await onDelete(order._id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    };

    return (
      <>
        <tr className="bg-white border-b hover:bg-gray-50">
          <td className="px-3 py-3 lg:px-4">
            <div className="break-words w-[100px]">
              <span className="text-sm font-medium">{order?.orderId}</span>
            </div>
          </td>
          <td className="px-3 py-3 lg:px-4 whitespace-nowrap">
            <div className="flex items-center">
              <img
                src={order?.productDetails?.images?.[0] || "N/A"}
                alt={order?.productDetails?.name || "N/A"}
                className="w-10 h-10 rounded-full"
              />
              <span
                title={
                  order?.productDetails?.hasVariant
                    ? order?.productDetails?.name +
                      " - " +
                      order?.productDetails?.variantName
                    : order?.productDetails?.name
                }
                className="text-sm font-medium cursor-pointer"
              >
                {order?.productDetails?.hasVariant
                  ? (
                      order?.productDetails?.name +
                      " - " +
                      order?.productDetails?.variantName
                    ).slice(0, 20)
                  : order?.productDetails?.name?.slice(0, 20)}
                {order?.productDetails?.hasVariant && "..."}
              </span>
            </div>
          </td>
          <td className="px-3 py-3 lg:px-4 whitespace-nowrap">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </td>
          <td className="px-3 py-3 lg:px-4" title="mobile">
            {order?.mobile || "N/A"}
          </td>
          <td className="px-3 py-3 lg:px-4">
            <div className="break-words w-[120px]">
              {order.address ? order?.address : "N/A"}
            </div>
          </td>
          <td className="px-3 py-3 lg:px-4">
            <div className="break-words w-[100px]">
              <span className="text-sm font-medium">
                {order?.store?.name || "N/A"}
              </span>
            </div>
          </td>
          <td className="px-3 py-3 lg:px-4 text-center">
            {order?.quantity || "N/A"}
          </td>
          <td className="px-3 py-3 lg:px-4">
            <div className="font-medium text-gray-900">
              ₹{order.totalAmount || 0}
            </div>
          </td>
          <StatusDropdown
            currentStatus={paymentStatus}
            options={paymentOptions}
            onStatusChange={handlePaymentStatusChange}
            type="payment"
          />
          <StatusDropdown
            currentStatus={orderStatus}
            options={getAvailableOrderOptions()}
            onStatusChange={handleOrderStatusChange}
            type="order"
          />
          <td className="px-6 py-4">
            <div className="text-blue-500 cursor-pointer flex gap-2">
              <span
                className="text-blue-500 cursor-pointer"
                onClick={handleEditMobile}
              >
                {" "}
                <FaRegEdit />
              </span>
              <span
                className="text-red-500 cursor-pointer"
                onClick={handleDeleteClick}
              >
                {" "}
                <FaTrash />
              </span>
            </div>
          </td>
        </tr>
        <>
          <Modal
            isOpen={isEditMobileModalOpen}
            onClose={() => setIsEditMobileModalOpen(false)}
          >
            <div className="p-4">
              <h2 className="text-lg font-medium mb-4 border-b text-black/90 border-gray-300 pb-3">
                Update Contact Details
              </h2>
              <div className="mt-4">
                <label className="block font-medium text-black/80">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter mobile number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={updateData.mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <label className="block font-medium text-black/80">
                  Address
                </label>
                <textarea
                  name="address"
                  className="w-full p-2 min-h-36 border border-gray-300 rounded-md"
                  value={updateData.address}
                  placeholder="e.g., Northlux Official Outlet"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditMobileModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Update
                </button>
              </div>
            </div>
          </Modal>
        </>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Enquiry"
          message="Are you sure you want to delete this enquiry?"
          warningMessage="This action cannot be undone."
          confirmButtonText="Delete"
          confirmButtonColor="red"
        />
      </>
    );
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    try {
      setDeleteLoading(true);
      await deleteEnquiry(enquiryId);
      toast.success("Enquiry deleted successfully");
      fetchData(currentPage); // Refresh the list
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete enquiry");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* <PageHeader content={"Orders"} /> */}
      <>
        <div className="flex gap-[3rem]">
          <div className="w-1/3 space-y-2">
            <p className="font-medium text-sm">Sales Period</p>
            <div className="w-full">
              <DateRangePicker
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={role === "store"}
              >
                <option value="">Filter by Store</option>
                {stores?.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.store_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 mb-2 mr-4">
          {(selectedCategory || (dateRange[0] && dateRange[1])) && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedStatus("");
                setDateRange([null, null]);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {/* <TfiReload className="w-4 h-4" /> */}
              <span>Reset Filters</span>
              <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                {[
                  selectedCategory && "Category",
                  selectedStatus && "Status",
                  dateRange[0] && dateRange[1] && "Date",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </button>
          )}
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-3 py-3 lg:px-4">
                  <div className="w-[100px]">Order ID</div>
                </th>
                <th>
                  <div className="flex items-center">Product</div>
                </th>
                <th scope="col" className="px-3 py-3 lg:px-4">
                  <div className="flex items-center">Date Placed</div>
                </th>
                <th scope="col" className="px-3 py-3 lg:px-4" title="mobile">
                  <div className="flex items-center">Phone Number</div>
                </th>
                <th scope="col" className="px-3 py-3 lg:px-4" title="address">
                  <div className="flex items-center w-[120px]">Address</div>
                </th>
                <th scope="col" className="px-3 py-3 lg:px-4">
                  <div className="flex items-center w-[100px]">Store</div>
                </th>
                <th scope="col" className="px-3 py-3 lg:px-4">
                  <div className="flex items-center">Quantity</div>
                </th>
                <th scope="col" className="px-3 py-3 lg:px-4">
                  <div className="flex items-center">Total Amount</div>
                </th>
                <th scope="col" className="px-3 py-3 lg:px-4">
                  <div className="flex items-center">Payment Status</div>
                </th>
                <th scope="col" className="px-3 py-3 lg:px-4">
                  <div className="flex items-center">Order Status</div>
                </th>
                <th scope="col" className=""></th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-12 text-center text-gray-500 bg-gray-50"
                  >
                    <LoadingSpinner
                      color="primary"
                      text="Loading Enquiries..."
                    />
                  </td>
                </tr>
              </tbody>
            ) : orders && orders.length > 0 ? (
              <tbody>
                {orders.map((order) => (
                  <TableRow
                    key={order._id}
                    order={order}
                    type={"enquiry"}
                    onDelete={handleDeleteEnquiry}
                  />
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-500 bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-lg font-medium">No orders found</p>
                      {dateRange[0] && dateRange[1] && (
                        <p className="mt-1 text-sm text-gray-400">
                          Try selecting a different date range
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>

          {orders && orders.length > 0 && (
            <div className="py-4 px-3 flex justify-end border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </>
    </div>
  );
}

export default Enquiry;
