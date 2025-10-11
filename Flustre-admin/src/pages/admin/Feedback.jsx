import { useEffect } from "react";
import { getFeedbacks, deleteFeedback } from "../../sevices/feedbackApis";
import { toast } from "react-toastify";
import { useState } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import Pagination from "../../components/Admin/Product/components/Pagination/Pagination";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";

export const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    feedbackId: null,
    isLoading: false,
  });

  const fetchFeedbacks = async (page) => {
    setLoading(true);
    try {
      const response = await getFeedbacks(page);
      setFeedbacks(response?.feedbacks);
      setTotalPages(response?.totalPages);
      setCurrentPage(response?.currentPage);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchFeedbacks(page);
  };

  const handleDeleteClick = (feedbackId) => {
    setDeleteModal({
      isOpen: true,
      feedbackId,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    try {
      await deleteFeedback(deleteModal.feedbackId);
      toast.success("Feedback deleted successfully");
      fetchFeedbacks(currentPage); // Refresh the list
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting feedback");
    } finally {
      setDeleteModal({
        isOpen: false,
        feedbackId: null,
        isLoading: false,
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      feedbackId: null,
      isLoading: false,
    });
  };

  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, []);

  return (
    <div className="p-6">
      {/* <PageHeader content="Customer Feedback" /> */}

      <div className="bg-white rounded-lg shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <div>
                    <LoadingSpinner
                      size="lg"
                      color="primary"
                      fullScreen={true}
                      text="Loading feedbacks..."
                    />
                  </div>
                </tr>
              ) : feedbacks?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500 "
                  >
                    No feedback found
                  </td>
                </tr>
              ) : (
                feedbacks?.map((feedback) => (
                  <tr key={feedback._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {feedback.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {feedback.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {feedback.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {feedback.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div
                        className="flex justify-center items-center"
                        onClick={() => handleDeleteClick(feedback._id)}
                      >
                        <button className="text-red-500 hover:text-red-700 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
        warningMessage="All associated data will be permanently removed."
        confirmButtonText="Delete"
        confirmButtonColor="red"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};
