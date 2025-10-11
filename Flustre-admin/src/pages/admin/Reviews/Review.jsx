import { useState, useEffect } from "react";
import { Search, Trash2, Star, ChevronDown, ChevronUp, Package, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllReviews, deleteMultipleReviews } from "../../../sevices/reviewApis";
import { toast } from "react-toastify";


const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, count }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Delete Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete {count} selected review{count > 1 ? "s" : ""}? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ReviewManagement = () => {
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReviews, setExpandedReviews] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [error, setError] = useState(null);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllReviews();
      setReviews(response.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to fetch reviews");
      toast.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReview = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredReviews = reviews.filter((review) =>
    review.productId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.userId.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastReview = currentPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Handle checkbox selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(currentReviews.map((review) => review._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (reviewId) => {
    setSelected((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      await deleteMultipleReviews(selected);
      
      // Remove deleted reviews from state
      setReviews(prev => prev.filter(review => !selected.includes(review._id)));
      setSelected([]);
      setShowDeleteModal(false);
      
      toast.success(`Successfully deleted ${selected.length} review(s)`);
    } catch (error) {
      console.error("Error deleting reviews:", error);
      toast.error("Failed to delete reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelected([]);
  };

  const renderStars = (rating) => {
    // Ensure rating is a number
    const numRating = Number(rating);
    console.log("Rating value:", rating, "Number rating:", numRating);
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < numRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
        fill={i < numRating ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {filteredReviews.length} Reviews
            </Badge>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by product or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              {selected.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selected.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Grid */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Loading reviews...</h3>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto text-destructive mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Error loading reviews</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchReviews} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : currentReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search criteria" : "No reviews available"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Select All */}
            <div className="flex items-center gap-3 px-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border"
                checked={selected.length === currentReviews.length}
                onChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                Select all on this page
              </span>
            </div>

            {/* Review Cards */}
            <div className="grid gap-4">
              {currentReviews.map((review, index) => (
                <Card 
                  key={review._id} 
                  className={`transition-all duration-200 hover:shadow-lg ${
                    selected.includes(review._id) ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border mt-1"
                        checked={selected.includes(review._id)}
                        onChange={() => handleSelectOne(review._id)}
                      />
                      
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {review.userId.username}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {review.userId.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-muted-foreground ml-1">({review.rating}/5)</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* Product */}
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {review.productId.name}
                          </span>
                        </div>

                        {/* Review Text */}
                        <div className="relative">
                          <p className={`text-foreground leading-relaxed ${
                            expandedReviews[index] ? '' : ''
                          }`}
                          style={{
                            display: expandedReviews[index] ? 'block' : '-webkit-box',
                            WebkitLineClamp: expandedReviews[index] ? 'unset' : 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: expandedReviews[index] ? 'visible' : 'hidden'
                          }}>
                            {review.review}
                          </p>
                          
                          {review.review.length > 150 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleReview(index)}
                              className="mt-2 h-auto p-0 text-primary hover:text-primary/80"
                            >
                              {expandedReviews[index] ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                  Show more
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {indexOfFirstReview + 1} to {Math.min(indexOfLastReview, filteredReviews.length)} of {filteredReviews.length} reviews
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, idx, arr) => (
                      <div key={page} className="flex items-center">
                        {idx > 0 && arr[idx - 1] < page - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        count={selected.length}
      />
    </div>
  );
};

export default ReviewManagement;