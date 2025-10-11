import React, { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/axiosInstance";
import ConfirmationModal from "./ConfirmationModal";
import LoadingSpinner from "../spinner/LoadingSpinner";

// Dummy data for offers
const dummyOffers = [
  {
    _id: "1",
    offerName: "Summer Sale 2024",
    bannerImage: "https://images.pexels.com/photos/1028635/pexels-photo-1028635.jpeg?auto=compress&cs=tinysrgb&w=400",
    offerType: "brand",
    brand: { name: "Nike" },
    offerValue: 25,
    offerMetric: "percentage",
    startDate: "2024-06-01T00:00:00.000Z",
    endDate: "2024-08-31T23:59:59.000Z"
  },
  {
    _id: "2",
    offerName: "Electronics Mega Deal",
    bannerImage: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400",
    offerType: "category",
    category: { name: "Electronics" },
    offerValue: 500,
    offerMetric: "amount",
    startDate: "2024-07-15T00:00:00.000Z",
    endDate: "2024-09-15T23:59:59.000Z"
  },
  {
    _id: "3",
    offerName: "Adidas Sport Collection",
    bannerImage: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400",
    offerType: "brandCategory",
    brand: { name: "Adidas" },
    category: { name: "Sports" },
    offerValue: 30,
    offerMetric: "percentage",
    startDate: "2024-05-01T00:00:00.000Z",
    endDate: "2024-07-31T23:59:59.000Z"
  },
  {
    _id: "4",
    offerName: "Fashion Forward",
    bannerImage: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400",
    offerType: "category",
    category: { name: "Fashion" },
    offerValue: 40,
    offerMetric: "percentage",
    startDate: "2024-06-10T00:00:00.000Z",
    endDate: "2024-08-10T23:59:59.000Z"
  },
  {
    _id: "5",
    offerName: "Apple Premium Offer",
    bannerImage: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400",
    offerType: "brand",
    brand: { name: "Apple" },
    offerValue: 1000,
    offerMetric: "amount",
    startDate: "2024-07-01T00:00:00.000Z",
    endDate: "2024-09-30T23:59:59.000Z"
  }
];

export const ActiveOffersTable = ({ offers = dummyOffers, fetchData, loading = false }) => {
  const [selectedOffer, setSelectedOffer] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handleDeleteOffer = async () => {
    try {
      await axiosInstance.delete(`/offer/${selectedOffer}`);
      toast.success("Offer deleted successfully");
      fetchData?.();
      setDeleteConfirmation(false);
    } catch (error) {
      toast.error("Error deleting offer");
    }
  };

  const confirmDelete = (offerId) => {
    setSelectedOffer(offerId);
    setDeleteConfirmation(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto py-12 px-5">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Offer Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Banner
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Type & Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Offer Value
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : offers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <div className="text-gray-500 font-medium">
                    No Offers found
                  </div>
                </td>
              </tr>
            ) : (
              offers.map((offer, index) => (
                <tr
                  key={offer._id || index}
                  className="bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {offer.offerName}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {offer.offerType} Offer
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={offer.bannerImage}
                        alt={offer.offerName}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {offer.offerType === "brand" && offer.brand?.name}
                      {offer.offerType === "category" && offer.category?.name}
                      {offer.offerType === "brandCategory" && 
                        `${offer.brand?.name}/${offer.category?.name}`}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {offer.offerType === "brand" && "Brand"}
                      {offer.offerType === "category" && "Category"}
                      {offer.offerType === "brandCategory" && "Brand & Category"}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {offer.offerMetric === "percentage" 
                          ? `${offer.offerValue}%` 
                          : formatCurrency(offer.offerValue)}
                        {offer.offerMetric === "percentage" ? " OFF" : " OFF"}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">
                        {new Date(offer.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                      <div className="text-gray-500 text-xs">to</div>
                      <div className="font-medium">
                        {new Date(offer.endDate).toLocaleDateString("en-US", {
                          month: "short", 
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-md hover:bg-red-50"
                      onClick={() => confirmDelete(offer._id)}
                      title="Delete offer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmation && (
        <ConfirmationModal
          isOpen={deleteConfirmation}
          message="Are you sure you want to delete this offer?"
          onConfirm={handleDeleteOffer}
          onClose={() => setDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};