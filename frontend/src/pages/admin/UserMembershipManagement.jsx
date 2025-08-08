import { useState, useEffect, useCallback } from "react";
import {
  CreditCardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatsCard,
} from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard, LoadingTableRow } from "../../components/ui/Loading";
import { adminAPI } from "../../lib/api";
import {
  formatCurrency,
  formatDateTime,
  capitalizeFirst,
} from "../../lib/utils";

const AdminUserMembershipManagement = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [grantForm, setGrantForm] = useState({
    durationMonths: 1,
    reason: "",
    trialDays: 0,
  });
  const [cancelForm, setCancelForm] = useState({
    reason: "",
    immediate: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    role: "customer",
    status: "",
    membershipStatus: "",
    search: "",
    page: 1,
    limit: 20,
  });

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const response = await adminAPI.getMembershipAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Error fetching membership analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Fetch users with membership data
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsersWithMembership({
        ...filters,
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching users with membership data:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, [fetchAnalytics, fetchUsers]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleGrantMembership = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await adminAPI.grantUserMembership(selectedUser.user_id, grantForm);

      // Refresh data
      await Promise.all([fetchUsers(), fetchAnalytics()]);

      // Reset form and close modal
      setGrantForm({
        durationMonths: 1,
        reason: "",
        trialDays: 0,
      });
      setShowGrantModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error granting membership:", error);
      alert("Failed to grant membership. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelMembership = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await adminAPI.cancelUserMembership(selectedUser.user_id, cancelForm);

      // Refresh data
      await Promise.all([fetchUsers(), fetchAnalytics()]);

      // Reset form and close modal
      setCancelForm({
        reason: "",
        immediate: false,
      });
      setShowCancelModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error cancelling membership:", error);
      alert("Failed to cancel membership. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const getMembershipStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trialing":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "past_due":
        return "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return "bg-orange-100 text-orange-800";
      case "none":
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getMembershipStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "trialing":
        return "Trial";
      case "expired":
        return "Expired";
      case "cancelled":
        return "Cancelled";
      case "past_due":
        return "Past Due";
      case "unpaid":
        return "Unpaid";
      case "none":
      default:
        return "Non-Member";
    }
  };

  const getUserRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "customer":
        return "bg-blue-100 text-blue-800";
      case "cleaner":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const canGrantMembership = (user) => {
    return user.role === "customer" && user.effective_status === "none";
  };

  const canCancelMembership = (user) => {
    return (
      user.role === "customer" &&
      ["active", "trialing"].includes(user.effective_status)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <SparklesIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    User & Membership Management
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">
                    Comprehensive view of all users and their membership status
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Analytics Cards */}
        {analyticsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : (
          analytics && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Customers"
                value={analytics.customerBreakdown.total_customers || 0}
                change="All users"
                trend="neutral"
                icon={UserGroupIcon}
              />

              <StatsCard
                title="Active Members"
                value={analytics.overallStats.active_memberships || 0}
                change="SuperSaver plans"
                trend="up"
                icon={TrophyIcon}
              />

              <StatsCard
                title="Monthly Revenue"
                value={formatCurrency(
                  analytics.overallStats.monthly_recurring_revenue || 0
                )}
                change="+12.3%"
                trend="up"
                icon={CreditCardIcon}
              />

              <StatsCard
                title="Trial Members"
                value={analytics.overallStats.trial_memberships || 0}
                change="Active trials"
                trend="neutral"
                icon={ChartBarIcon}
              />
            </div>
          )
        )}

        {/* Filters */}
        <Card variant="elevated">
          <CardHeader variant="accent">
            <CardTitle className="flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
              Search & Filter Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 form-input"
                />
              </div>

              <Select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                className="form-input"
              >
                <option value="">All Roles</option>
                <option value="customer">Customers</option>
                <option value="cleaner">Cleaners</option>
                <option value="admin">Admins</option>
              </Select>

              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="form-input"
              >
                <option value="">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </Select>

              <Select
                value={filters.membershipStatus}
                onChange={(e) =>
                  handleFilterChange("membershipStatus", e.target.value)
                }
                className="form-input"
              >
                <option value="">All Membership Status</option>
                <option value="active">Active Members</option>
                <option value="trialing">Trial Members</option>
                <option value="expired">Expired Members</option>
                <option value="cancelled">Cancelled Members</option>
                <option value="past_due">Past Due</option>
                <option value="none">Non-Members</option>
              </Select>

              <Select
                value={filters.limit}
                onChange={(e) =>
                  handleFilterChange("limit", parseInt(e.target.value))
                }
                className="form-input"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </Select>

              <Button
                onClick={() =>
                  setFilters({
                    role: "customer",
                    status: "",
                    membershipStatus: "",
                    search: "",
                    page: 1,
                    limit: 20,
                  })
                }
                variant="outline"
                className="text-sm"
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>User & Membership Details</span>
              <span className="text-sm font-normal text-gray-500">
                {pagination.total} total users
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent variant="flush">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Membership Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Plan Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Usage & Savings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <LoadingTableRow key={index} columns={6} />
                    ))
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="text-gray-500">
                          <UserGroupIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No users found
                          </h3>
                          <p className="text-gray-500">
                            No users match your current filters. Try adjusting
                            your search criteria.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.user_id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-sm">
                                <span className="text-sm font-semibold text-white">
                                  {user.first_name?.[0] || "U"}
                                  {user.last_name?.[0] || ""}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getUserRoleColor(
                              user.role
                            )}`}
                          >
                            {capitalizeFirst(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mb-1 ${getMembershipStatusColor(
                                user.effective_status
                              )}`}
                            >
                              {getMembershipStatusText(user.effective_status)}
                            </span>
                            {user.current_period_end && (
                              <span className="text-xs text-gray-500">
                                Ends:{" "}
                                {formatDateTime(user.current_period_end, {
                                  dateOnly: true,
                                })}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.membership_id ? (
                            <div className="text-sm">
                              <div className="font-semibold text-gray-900">
                                SuperSaver Monthly
                              </div>
                              <div className="text-gray-500">
                                {formatCurrency(user.monthly_fee || 59)} /month
                              </div>
                              <div className="text-green-600 text-xs">
                                {user.discount_percentage || 50}% discount
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No membership
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.membership_id ? (
                            <div className="text-sm">
                              <div className="font-semibold text-gray-900">
                                {user.usage_count || 0} bookings
                              </div>
                              <div className="text-green-600">
                                {formatCurrency(user.total_savings || 0)} saved
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // View user details - could open modal
                                console.log("View user:", user);
                              }}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            {canGrantMembership(user) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowGrantModal(true);
                                }}
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {canCancelMembership(user) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowCancelModal(true);
                                }}
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-semibold">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-semibold">{pagination.total}</span>{" "}
                  results
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === pagination.page;

                      return (
                        <Button
                          key={pageNum}
                          variant={isActive ? "primary" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="min-w-[2.5rem]"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grant Membership Modal */}
      {showGrantModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <SparklesIcon className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Grant Membership
                </h3>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>User:</strong> {selectedUser.first_name}{" "}
                  {selectedUser.last_name}
                  <br />
                  <strong>Email:</strong> {selectedUser.email}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Months)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={grantForm.durationMonths}
                    onChange={(e) =>
                      setGrantForm((prev) => ({
                        ...prev,
                        durationMonths: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trial Days (Optional)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    value={grantForm.trialDays}
                    onChange={(e) =>
                      setGrantForm((prev) => ({
                        ...prev,
                        trialDays: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="form-input"
                    placeholder="0 for no trial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason (Optional)
                  </label>
                  <Input
                    type="text"
                    value={grantForm.reason}
                    onChange={(e) =>
                      setGrantForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="form-input"
                    placeholder="e.g., Customer service gesture"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Button
                  onClick={handleGrantMembership}
                  loading={actionLoading}
                  className="flex-1"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Grant Membership
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGrantModal(false);
                    setSelectedUser(null);
                    setGrantForm({
                      durationMonths: 1,
                      reason: "",
                      trialDays: 0,
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Membership Modal */}
      {showCancelModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancel Membership
                </h3>
              </div>

              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>User:</strong> {selectedUser.first_name}{" "}
                  {selectedUser.last_name}
                  <br />
                  <strong>Current Status:</strong>{" "}
                  {getMembershipStatusText(selectedUser.effective_status)}
                  {selectedUser.current_period_end && (
                    <>
                      <br />
                      <strong>Current Period Ends:</strong>{" "}
                      {formatDateTime(selectedUser.current_period_end, {
                        dateOnly: true,
                      })}
                    </>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="immediate"
                    checked={cancelForm.immediate}
                    onChange={(e) =>
                      setCancelForm((prev) => ({
                        ...prev,
                        immediate: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="immediate"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Cancel immediately (otherwise cancels at period end)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason (Optional)
                  </label>
                  <Input
                    type="text"
                    value={cancelForm.reason}
                    onChange={(e) =>
                      setCancelForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="form-input"
                    placeholder="e.g., User requested cancellation"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Button
                  onClick={handleCancelMembership}
                  loading={actionLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel Membership
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedUser(null);
                    setCancelForm({
                      reason: "",
                      immediate: false,
                    });
                  }}
                  className="flex-1"
                >
                  Keep Active
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserMembershipManagement;
