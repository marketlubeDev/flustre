import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { FaSort } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import StoreSlidingModal from "../../components/Admin/store/StoreslidingModal";
import { getStores } from "../../sevices/storeApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setStores } from "../../redux/features/AdminUtilities";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";

function Store() {
  const dispatch = useDispatch();
  // const stores = useSelector((state) => state.adminUtilities.stores);
  const [stores, setStoress] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [refetch, setRefetch] = useState(false);
  // const [filteredStores, setFilteredStores] = useState(stores);
  const navigate = useNavigate();

  

  const fetchStores = async (searchQuery = "") => {
    try {
      setIsLoading(true);
      const response = await getStores(searchQuery);
      setStoress(response?.stores);
      dispatch(setStores(response?.stores));
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a debounced version of fetchStores
  const debouncedFetchStores = useCallback(
    debounce((searchQuery) => {
      fetchStores(searchQuery);
    }, 500),
    []
  );

  useEffect(() => {
    fetchStores();
  }, [refetch]);

  useEffect(() => {
    debouncedFetchStores(search);
    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchStores.cancel();
    };
  }, [search, debouncedFetchStores]);

  const handleEdit = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  useEffect(() => {
    // setFilteredStores(
    //   stores?.filter((store) =>
    //     store?.store_name?.toLowerCase().includes(search.toLowerCase())
    //   )
    // );
  }, [search]);

  return (
    <>
      {/* <PageHeader content="All Stores" /> */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="p-6 relative">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Store name..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-[300px] text-sm focus:outline-none focus:border-[#259960]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#259960] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1e7a4c]"
                >
                  + Add Store
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="w-full min-w-[1000px]">
                  <div className="grid grid-cols-8 bg-[#25996026] text-xs uppercase text-gray-700 py-3 px-4 rounded-t-lg gap-3">
                    <div className="flex items-center gap-1 col-span-1">
                      Store Name <FaSort className="text-gray-400 ml-1" />
                    </div>
                    <div className="flex items-center gap-1 col-span-1">
                      Email <FaSort className="text-gray-400 ml-1" />
                    </div>
                    <div className="flex items-center gap-1">
                      Store Number <FaSort className="text-gray-400 ml-1" />
                    </div>
                    <div className="flex items-center gap-1">
                      Total Products <FaSort className="text-gray-400 ml-1" />
                    </div>
                    <div className="flex items-center gap-1">
                      Revenue <FaSort className="text-gray-400 ml-1" />
                    </div>
                    <div className="flex items-center gap-1">
                      Profit <FaSort className="text-gray-400 ml-1" />
                    </div>
                    <div className="flex items-center gap-1">
                      Last Updated on <FaSort className="text-gray-400 ml-1" />
                    </div>
                    <div>Action</div>
                  </div>

                  <div className="bg-white">
                    {stores?.map((store) => (
                      <div
                        key={store?._id}
                        onClick={() =>
                          navigate(`/admin/storeinfo/${store?._id}`, {
                            state: { store, stores },
                          })
                        }
                        className="grid grid-cols-8 py-4 px-4 text-sm border-b hover:bg-[#637a6f26] cursor-pointer gap-3 items-center"
                      >
                        <div className="font-medium text-gray-900 break-words col-span-1">
                          {store?.store_name}
                        </div>
                        <div className="break-words col-span-1 overflow-hidden">
                          {store?.email}
                        </div>
                        <div className="break-all">{store?.store_number}</div>
                        <div className="text-center">{store?.totalProducts}</div>
                        <div className="text-red-500 whitespace-nowrap">
                          ₹{store?.totalRevenue} 
                        </div>
                        <div className="text-red-500 whitespace-nowrap">
                          ₹{store?.totalProfit} <span className="text-gray-500 text-xs">({store?.profitPercentage}%)</span>
                        </div>
                        <div className="whitespace-nowrap">
                          {new Date(store?.updatedAt).toLocaleDateString()}
                        </div>
                        <div>
                          <button
                            className="text-gray-500 hover:text-[#259960]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(store);
                            }}
                          >
                            <FiEdit2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <StoreSlidingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            editData={selectedStore}
            stores={stores}
            setRefetch={setRefetch}
          />
        </div>
      )}
    </>
  );
}

export default Store;
