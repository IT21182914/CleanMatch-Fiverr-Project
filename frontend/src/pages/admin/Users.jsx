import { useState, useEffect, useCallback } from "react";
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard, LoadingTableRow } from "../../components/ui/Loading";
import { adminAPI } from "../../lib/api";
import { formatDateTime, capitalizeFirst, getInitials } from "../../lib/utils";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [searchInput, setSearchInput] = useState(""); // For immediate UI updates
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  const handleFilterChange = useCallback((name, value) => {
    console.log(`🎯 Filter change: ${name} = "${value}"`); // Debug log
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [name]: value,
        page: 1, // Reset to first page when filtering
      };
      console.log("🎯 New filters state:", newFilters); // Debug log
      return newFilters;
    });
  }, []);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange("search", searchInput);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, handleFilterChange]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching users with filters:", filters); // Debug log
      console.log(
        "🔍 Filter values - role:",
        filters.role,
        "status:",
        filters.status,
        "search:",
        filters.search
      );

      const response = await adminAPI.getUsers(filters);
      console.log("📊 API Response:", response.data); // Debug log
      console.log("📊 Users returned:", response.data.users?.length);
      console.log("📊 First few users:", response.data.users?.slice(0, 3));

      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusUpdate = async (userId, isActive) => {
    try {
      setUpdating((prev) => ({ ...prev, [userId]: true }));
      await adminAPI.updateUserStatus(userId, { isActive });

      // Update user in local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_active: isActive } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      customer: "bg-blue-100 text-blue-800",
      cleaner: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-gray-900 truncate">
            User Management
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Manage customers, cleaners, and administrators.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {/* Mobile: Stack filters vertically, Desktop: Grid layout */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <Select
                value={filters.role}
                onChange={(e) => {
                  console.log("🎯 Role select changed to:", e.target.value);
                  handleFilterChange("role", e.target.value);
                }}
                className="h-10 sm:h-11 text-sm sm:text-base"
              >
                <option value="">All Roles</option>
                <option value="customer">Customers</option>
                <option value="cleaner">Cleaners</option>
                <option value="admin">Admins</option>
              </Select>

              <Select
                value={filters.status}
                onChange={(e) => {
                  console.log("🎯 Status select changed to:", e.target.value);
                  handleFilterChange("status", e.target.value);
                }}
                className="h-10 sm:h-11 text-sm sm:text-base"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchInput("");
                  setFilters({
                    role: "",
                    status: "",
                    search: "",
                    page: 1,
                    limit: 20,
                  });
                }}
                className="h-10 sm:h-11 text-sm sm:text-base whitespace-nowrap"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table/Cards */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="flex items-center text-base sm:text-lg">
              <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Users ({pagination.total})
            </span>
            {/* Mobile filter indicator */}
            {(filters.role || filters.status || filters.search) && (
              <div className="text-xs sm:text-sm text-blue-600 sm:hidden">
                {filters.role && `Role: ${capitalizeFirst(filters.role)}`}
                {filters.role && filters.status && " • "}
                {filters.status && `Status: ${capitalizeFirst(filters.status)}`}
                {(filters.role || filters.status) && filters.search && " • "}
                {filters.search && `Search: "${filters.search}"`}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            /* Loading state - responsive */
            <>
              <div className="block sm:hidden">
                {/* Mobile loading cards */}
                <div className="space-y-3 p-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden sm:block overflow-hidden">
                {/* Desktop loading table */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <LoadingTableRow key={index} columns={5} />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : users.length === 0 ? (
            /* Empty state - responsive */
            <div className="text-center py-8 sm:py-12 px-4">
              <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                {filters.search || filters.role || filters.status
                  ? "Try adjusting your filters to see more results."
                  : "No users have registered yet."}
              </p>
            </div>
          ) : (
            /* Users display - responsive */
            <>
              {/* Mobile: Card layout */}
              <div className="block sm:hidden">
                <div className="space-y-3 p-4">
                  {users.map((user) => (
                    <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {getInitials(`${user.first_name} ${user.last_name}`)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-xs text-gray-500 truncate">
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Mobile action button */}
                        <div className="flex-shrink-0 ml-3">
                          {user.is_active ? (
                            <Button
                              variant="outline"
                              size="sm"
                              loading={updating[user.id]}
                              onClick={() => handleStatusUpdate(user.id, false)}
                              className="text-red-600 border-red-300 hover:bg-red-50 px-3 py-1.5 h-8 text-xs"
                            >
                              <XCircleIcon className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              loading={updating[user.id]}
                              onClick={() => handleStatusUpdate(user.id, true)}
                              className="text-green-600 border-green-300 hover:bg-green-50 px-3 py-1.5 h-8 text-xs"
                            >
                              <CheckCircleIcon className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Mobile: Role, Status, and Join date */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {capitalizeFirst(user.role)}
                        </span>
                        
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                        
                        {user.is_verified && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                        
                        <span className="text-gray-500 ml-auto">
                          {formatDateTime(user.created_at).split(' ')[0]} {/* Show just date on mobile */}
                        </span>
                      </div>
                      
                      {/* Mobile: Cleaner rating */}
                      {user.role === "cleaner" && user.rating && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
                          {user.rating}/5.0 ({user.total_jobs} jobs)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop/Tablet: Table layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10">
                              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs lg:text-sm font-medium text-blue-600">
                                  {getInitials(`${user.first_name} ${user.last_name}`)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3 lg:ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500">
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {capitalizeFirst(user.role)}
                          </span>
                          {user.role === "cleaner" && user.rating && (
                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-yellow-400" />
                              {user.rating}/5.0 ({user.total_jobs} jobs)
                            </div>
                          )}
                        </td>

                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                          {user.is_verified && (
                            <div className="flex items-center mt-1">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-xs text-green-600">Verified</span>
                            </div>
                          )}
                        </td>

                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(user.created_at)}
                        </td>

                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {user.is_active ? (
                              <Button
                                variant="outline"
                                size="sm"
                                loading={updating[user.id]}
                                onClick={() => handleStatusUpdate(user.id, false)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                loading={updating[user.id]}
                                onClick={() => handleStatusUpdate(user.id, true)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination - Responsive */}
      {pagination.pages > 1 && (
        <Card className="sm:shadow-none sm:border-0 sm:bg-transparent">
          <CardContent className="p-4 sm:p-0">
            {/* Mobile pagination */}
            <div className="flex items-center justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex-1 mr-3 justify-center h-10"
              >
                Previous
              </Button>
              <div className="flex items-center px-4 min-w-0">
                <span className="text-sm text-gray-700 text-center">
                  {pagination.page} of {pagination.pages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="flex-1 ml-3 justify-center h-10"
              >
                Next
              </Button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="rounded-r-none"
                  >
                    Previous
                  </Button>

                  {/* Page numbers - Responsive visibility */}
                  {[...Array(pagination.pages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 && page <= pagination.page + 1) // Reduced range for mobile
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={
                            page === pagination.page ? "primary" : "outline"
                          }
                          onClick={() => handlePageChange(page)}
                          className="rounded-none hidden md:inline-flex lg:inline-flex"
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === pagination.page - 2 ||
                      page === pagination.page + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="relative hidden md:inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="rounded-l-none"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Users;
