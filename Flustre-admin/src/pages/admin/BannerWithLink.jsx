import React, { useState, useRef, useEffect } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { FaTrash, FaEdit, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  addOfferBanner,
  editOfferBanner,
  deleteOfferBanner,
  getOfferBanners,
} from "../../sevices/OfferBannerApis";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";

function BannerWithLink() {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState({
    desktop: null,
    mobile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    link: "",
    image: null,
    mobileImage: null,
    section: 1,
  });
  const fileInputRef = useRef({
    desktop: null,
    mobile: null
  });
  const [offerBanners, setOfferBanners] = useState([]);
  const [errors, setErrors] = useState({
    image: "",
    mobileImage: "",
    link: "",
    section: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOfferBanners();
  }, []);

  const fetchOfferBanners = async () => {
    setIsLoading(true);
    try {
      const data = await getOfferBanners();
      setOfferBanners(data?.data);
    } catch (error) {
      toast.error("Failed to fetch offer banners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (type) => {
    fileInputRef.current[type].click();
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type === 'desktop' ? 'image' : 'mobileImage']: file,
      }));
      setImagePreview((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file)
      }));
      setErrors((prev) => ({
        ...prev,
        [type === 'desktop' ? 'image' : 'mobileImage']: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if(formData.section === "" || formData.link === ""){
      toast.error("All fields are required");
      setIsSubmitting(false);
      return;
    }
    try {
      const formDataObj = new FormData();
      formDataObj.append("link", formData.link);
      formDataObj.append("section", parseInt(formData.section));
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }
      if (formData.mobileImage) {
        formDataObj.append("mobileImage", formData.mobileImage);
      }

      if (editingBanner) {
        await editOfferBanner(editingBanner._id, formDataObj);
        toast.success("Offer banner updated successfully");
      } else {
        await addOfferBanner(formDataObj);
        toast.success("Offer banner added successfully");
      }

      fetchOfferBanners();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      link: banner?.link,
      image: null,
      mobileImage: null,
      section: banner?.section,
    });
    setImagePreview({
      desktop: banner?.image,
      mobile: banner?.mobileImage
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      link: "",
      image: null,
      mobileImage: null,
      section: 1,
    });
    setImagePreview({
      desktop: null,
      mobile: null
    });
    setEditingBanner(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    resetForm();
  };

  const handleDeleteBanner = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBannerToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;

    setIsDeleting(true);
    try {
      await deleteOfferBanner(bannerToDelete._id);
      toast.success("Offer banner deleted successfully");
      fetchOfferBanners();
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete offer banner"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* <PageHeader content="Banner With Link" /> */}
      <div>
        <button
          className="block text-white bg-green-500 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ms-auto mb-2"
          onClick={() => setShowModal(true)}
        >
          Add New Banner With Link
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {isLoading ? (
          <div className="text-center p-4">
            <LoadingSpinner />
          </div>
        ) : (
          offerBanners.map((sectionGroup) => (
            <div key={sectionGroup.section} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 px-4">Section {sectionGroup.section}</h3>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-16 py-3">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Link
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sectionGroup.banners.map((banner) => (
                    <tr
                      key={banner?._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <img
                          src={banner?.image}
                          className="w-16 md:w-32 max-w-full max-h-full object-contain md:h-20"
                          alt="Banner"
                        />
                      </td>
                      <td className="px-6 py-4">{banner?.link}</td>
                      <td className="px-6 py-10 flex gap-2">
                        <FaTrash
                          className="text-red-500 text-lg cursor-pointer"
                          onClick={() => handleDeleteBanner(banner)}
                        />
                        <FaEdit
                          className="text-blue-500 text-lg cursor-pointer"
                          onClick={() => handleEditBanner(banner)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
        {!isLoading && offerBanners.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              No banner with link available. Click "Add New Banner With Link"
              to create one.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingBanner ? "Edit Banner With Link" : "Add New Banner With Link"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
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
                </button>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <form onSubmit={handleSubmit} className="text-left">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Banner Image For Desktop (3:1)
                    </label>
                    <div
                      onClick={() => handleImageClick('desktop')}
                      className={`relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 ${
                        errors.image ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {imagePreview.desktop ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview.desktop}
                            alt="Desktop Preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100">
                            <FaCamera className="text-white text-3xl" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                          <p className="text-gray-500">Click to upload desktop image</p>
                          <p className="text-gray-500" style={{ fontSize: "12px" }}>
                            ( 3:1 aspect ratio recommended )
                          </p>
                        </div>
                      )}
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                    )}
                    <input
                      type="file"
                      ref={el => fileInputRef.current.desktop = el}
                      onChange={(e) => handleImageChange(e, 'desktop')}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Banner Image For Mobile (2:1)
                    </label>
                    <div
                      onClick={() => handleImageClick('mobile')}
                      className={`relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 ${
                        errors.mobileImage ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {imagePreview.mobile ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview.mobile}
                            alt="Mobile Preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100">
                            <FaCamera className="text-white text-3xl" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                          <p className="text-gray-500">Click to upload mobile image</p>
                          <p className="text-gray-500" style={{ fontSize: "12px" }}>
                            ( 2:1 aspect ratio recommended )
                          </p>
                        </div>
                      )}
                    </div>
                    {errors.mobileImage && (
                      <p className="mt-1 text-sm text-red-500">{errors.mobileImage}</p>
                    )}
                    <input
                      type="file"
                      ref={el => fileInputRef.current.mobile = el}
                      onChange={(e) => handleImageChange(e, 'mobile')}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                      Link
                    </label>
                    <input
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        errors.link ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.link && (
                      <p className="mt-1 text-sm text-red-500">{errors.link}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        errors.section ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Section</option>
                      <option value={1}>Section 1</option>
                      <option value={2}>Section 2</option>
                      <option value={3}>Section 3</option>
                      <option value={4}>Section 4</option>
                      <option value={5}>Section 5</option>
                    </select>
                  </div>
                   
                  

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {editingBanner ? "Updating..." : "Adding..."}
                        </>
                      ) : editingBanner ? (
                        "Update"
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete the offer banner ?`}
        isLoading={isDeleting}
        confirmButtonText="Delete"
        confirmButtonColor="red"
      />
    </>
  );
}

export default BannerWithLink;
