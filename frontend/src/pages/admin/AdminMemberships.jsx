import { useState, useEffect, useCallback } from "react";
import {
  UsersIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatsCard,
} from "../../components/ui/Card";
import { Input, Select, Textarea } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { LoadingCard, LoadingTableRow } from "../../components/ui/Loading";
import { adminAPI } from "../../lib/api";
import {
  formatCurrency,
  formatDate,
  capitalizeFirst,
  getStatusColor,
} from "../../lib/utils";
import { useToast } from "../../hooks/useToast";

const AdminMemberships = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  
  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [grantForm, setGrantForm] = useState({
    tier: 'supersaver',
    duration: '30', // days
    notes: '',
  });
  const [cancelReason, setCancelReason] = useState('');

  const [filters, setFilters] = useState({
    role: "",
    membershipStatus: "",
    search: "",
    page: 1,
    limit: 20,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  const { addToast } = useToast();

  // Fetch membership analytics
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
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  // Cancel membership
  const handleCancelMembership = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(prev => ({ ...prev, [selectedUser.id]: true }));
      
      await adminAPI.cancelUserMembership(selectedUser.id);
      
      addToast(`Membership cancelled for ${selectedUser.first_name} ${selectedUser.last_name}`, 'success');
      
      // Refresh data
      await fetchUsers();
      await fetchAnalytics();
      
      setShowCancelModal(false);
      setSelectedUser(null);
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling membership:', error);
      addToast('Failed to cancel membership. Please try again.', 'error');
    } finally {
      setUpdating(prev => ({ ...prev, [selectedUser.id]: false }));
    }
  };

  // Grant membership
  const handleGrantMembership = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(prev => ({ ...prev, [selectedUser.id]: true }));
      
      await adminAPI.grantUserMembership(selectedUser.id, {
        tier: grantForm.tier,
        durationDays: parseInt(grantForm.duration),
        notes: grantForm.notes,
      });
      
      addToast(`Membership granted to ${selectedUser.first_name} ${selectedUser.last_name}`, 'success');
      
      // Refresh data
      await fetchUsers();
      await fetchAnalytics();
      
      setShowGrantModal(false);
      setSelectedUser(null);
      setGrantForm({
        tier: 'supersaver',
        duration: '30',
        notes: '',
      });
    } catch (error) {
      console.error('Error granting membership:', error);
      addToast('Failed to grant membership. Please try again.', 'error');
    } finally {
      setUpdating(prev => ({ ...prev, [selectedUser.id]: false }));
    }
  };

  const openCancelModal = (user) => {
    setSelectedUser(user);
    setShowCancelModal(true);
  };

  const openGrantModal = (user) => {
    setSelectedUser(user);
    setShowGrantModal(true);
  };

  const getMembershipStatusBadge = (user) => {
    if (!user.membership_id) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Membership
        </span>
      );
    }

    const status = user.effective_status;
    const colors = getStatusColor(status);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}>
        {capitalizeFirst(status)}
      </span>
    );
  };

  if (analyticsLoading && loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Membership Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <LoadingCard key={i} />
          ))}
        </div>
        <LoadingCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Management</h1>
          <p className="mt-2 text-gray-600">
            Manage user memberships and view comprehensive analytics
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Members"
            value={analytics.totalMembers}
            icon={UserGroupIcon}
            trend={analytics.memberGrowth > 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(analytics.memberGrowth)}%`}
            trendLabel="from last month"
          />
          <StatsCard
            title="Active Members"
            value={analytics.activeMembers}
            icon={CheckCircleIcon}
            trend={analytics.activeGrowth > 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(analytics.activeGrowth)}%`}
            trendLabel="from last month"
          />
          <StatsCard
            title="Monthly Revenue"
            value={formatCurrency(analytics.monthlyRevenue)}
            icon={CreditCardIcon}
            trend={analytics.revenueGrowth > 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(analytics.revenueGrowth)}%`}
            trendLabel="from last month"
          />
          <StatsCard
            title="Churn Rate"
            value={`${analytics.churnRate}%`}
            icon={ArrowTrendingDownIcon}
            trend={analytics.churnTrend < 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(analytics.churnTrend)}%`}
            trendLabel="from last month"
          />
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <Select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="customer">Customers</option>
                <option value="cleaner">Cleaners</option>
                <option value="admin">Admins</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Status
              </label>
              <Select
                value={filters.membershipStatus}
                onChange={(e) => handleFilterChange('membershipStatus', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
                <option value="past_due">Past Due</option>
                <option value="unpaid">Unpaid</option>
                <option value="none">No Membership</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="last_name-asc">Name (A-Z)</option>
                <option value="last_name-desc">Name (Z-A)</option>
                <option value="membership_end_date-asc">Membership End Date</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Users & Memberships ({pagination.total})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membership Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membership End
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  // Loading rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <LoadingTableRow key={index} columns={6} />
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-800">
                                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'cleaner'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {capitalizeFirst(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getMembershipStatusBadge(user)}
                        {user.membership_tier && (
                          <div className="text-xs text-gray-500 mt-1">
                            {capitalizeFirst(user.membership_tier)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.membership_end_date 
                          ? formatDate(user.membership_end_date)
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user.membership_id && user.effective_status !== 'cancelled' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCancelModal(user)}
                            disabled={updating[user.id]}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openGrantModal(user)}
                            disabled={updating[user.id]}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            Grant
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                      className="rounded-r-none"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNum = pagination.page - 2 + i;
                      if (pageNum < 1 || pageNum > pagination.pages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.page ? "primary" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                          className="rounded-none"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                      disabled={pagination.page === pagination.pages}
                      className="rounded-l-none"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Membership Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Membership"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Are you sure you want to cancel the membership?
              </p>
              <p className="text-sm text-red-600 mt-1">
                {selectedUser && `${selectedUser.first_name} ${selectedUser.last_name} will lose access to membership benefits immediately.`}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation (optional)
            </label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              disabled={updating[selectedUser?.id]}
            >
              Keep Membership
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelMembership}
              loading={updating[selectedUser?.id]}
            >
              Cancel Membership
            </Button>
          </div>
        </div>
      </Modal>

      {/* Grant Membership Modal */}
      <Modal
        isOpen={showGrantModal}
        onClose={() => setShowGrantModal(false)}
        title="Grant Membership"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Grant SuperSaver membership access
              </p>
              <p className="text-sm text-green-600 mt-1">
                {selectedUser && `${selectedUser.first_name} ${selectedUser.last_name} will get immediate access to membership benefits.`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Tier
              </label>
              <Select
                value={grantForm.tier}
                onChange={(e) => setGrantForm(prev => ({ ...prev, tier: e.target.value }))}
              >
                <option value="supersaver">SuperSaver</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days)
              </label>
              <Select
                value={grantForm.duration}
                onChange={(e) => setGrantForm(prev => ({ ...prev, duration: e.target.value }))}
              >
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">365 Days</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <Textarea
              value={grantForm.notes}
              onChange={(e) => setGrantForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter notes about this membership grant..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowGrantModal(false)}
              disabled={updating[selectedUser?.id]}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleGrantMembership}
              loading={updating[selectedUser?.id]}
            >
              Grant Membership
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminMemberships;
