import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/Admin/PageHeader";
import LoadingSpinner from "@/components/spinner/LoadingSpinner";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, UserX, UserCheck } from "lucide-react";
import { debounce } from "lodash";
import { listUsers, searchUser, updateUserStatus } from "@/sevices/userApis";

function CustomerTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Fetch users from API
  const fetchUsers = useCallback(async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchQuery.trim()) {
        response = await searchUser(searchQuery);
      } else {
        response = await listUsers(page, itemsPerPage);
      }
      
      if (response?.data) {
        setUsers(response.data.users || []);
        setTotalPages(response.data.pagination?.totalPages || 0);
        setTotalUsers(response.data.pagination?.totalUsers || 0);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      await fetchUsers(1, query);
    }, 500),
    [fetchUsers]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage, searchQuery);
    }
  };

  // Handle user block/unblock
  const handleToggleBlock = async (userId, currentStatus) => {
    if (!userId) {
      console.error("Cannot update user status: User ID is missing");
      setError("Cannot update user status: User ID is missing");
      return;
    }

    try {
      setLoading(true);
      
      // Update user's blocked status
      const response = await updateUserStatus(userId, !currentStatus);
      
      if (response?.data) {
        // Refresh the user list
        await fetchUsers(currentPage, searchQuery);
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-admin-bg">
      <PageHeader 
        title="Customer Management" 
        subtitle="Manage and monitor customer accounts"
      />

      <div className="p-6">
        <Card className="shadow-md border-0 bg-card">
          {/* Search Header */}
          <div className="p-6 border-b border-table-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">All Customers</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Total: {totalUsers} customers
                </p>
              </div>
              
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 bg-background border-input focus:border-ring"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-table-header">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-table-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <LoadingSpinner
                        color="primary"
                        text="Loading customers..."
                        size="md"
                      />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="text-destructive font-medium">
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="text-muted-foreground">
                        No customers found
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user._id || `user-${index}`}
                      className="bg-card hover:bg-table-row-hover transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                            {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-foreground">
                              {user.username || <span className="text-muted-foreground italic">No name</span>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email || <span className="text-muted-foreground">No email</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {user.phonenumber || <span className="text-muted-foreground">N/A</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short", 
                          day: "numeric"
                        }) : <span className="text-muted-foreground">N/A</span>}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={user.isBlocked ? "destructive" : "default"}
                          className={
                            user.isBlocked 
                              ? "bg-destructive/10 text-destructive border-destructive/20" 
                              : "bg-status-active/10 text-status-active border-status-active/20"
                          }
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            user.isBlocked ? "bg-destructive" : "bg-status-active"
                          }`} />
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                            disabled={loading || !user._id}
                            className={`border-input ${
                              user.isBlocked 
                                ? "text-green-600 hover:text-green-700 hover:bg-green-50" 
                                : "text-red-600 hover:text-red-700 hover:bg-red-50"
                            }`}
                          >
                            {user.isBlocked ? (
                              <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <UserX className="w-4 h-4 mr-1" />
                                Block
                              </>
                            )}
                          </Button>
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
            <div className="px-6 py-4 border-t border-table-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalUsers)} of {totalUsers} customers
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-input"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-primary text-primary-foreground" : "border-input"}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-input"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default CustomerTable;