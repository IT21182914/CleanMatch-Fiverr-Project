import React, { useState } from "react";
import { AlertCircle, Clock, ChevronDown, Filter, Zap, UserX, Calendar } from "lucide-react";

const AdminTicketFilters = ({ filters, onFilterChange, stats, adminUsers }) => {
  console.log("AdminTicketFilters rendered with filters:", filters);

  // Mobile filter toggle state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status", count: stats?.general?.total_tickets },
    { value: "open", label: "Open", count: stats?.general?.open_tickets },
    {
      value: "in_progress",
      label: "In Progress",
      count: stats?.general?.in_progress_tickets,
    },
    {
      value: "waiting_customer",
      label: "Waiting Customer",
      count: stats?.general?.waiting_customer_tickets,
    },
    {
      value: "resolved",
      label: "Resolved",
      count: stats?.general?.resolved_tickets,
    },
    { value: "closed", label: "Closed", count: stats?.general?.closed_tickets },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "urgent", label: "Urgent", count: stats?.general?.urgent_tickets },
    { value: "high", label: "High" },
    { value: "normal", label: "Normal" },
    { value: "low", label: "Low" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "service_quality", label: "Service Quality" },
    { value: "lateness", label: "Lateness" },
    { value: "damage", label: "Damage" },
    { value: "payment", label: "Payment Issues" },
    { value: "other", label: "Other" },
  ];

  const assignmentOptions = [
    { value: "all", label: "All Tickets" },
    { value: "assigned", label: "Assigned" },
    {
      value: "unassigned",
      label: "Unassigned",
      count: stats?.general?.unassigned_tickets,
    },
    ...adminUsers.map((admin) => ({
      value: admin.id.toString(),
      label: admin.name,
    })),
  ];

  const sortOptions = [
    { value: "created_at", label: "Created Date" },
    { value: "opened_at", label: "Opened Date" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
    { value: "summary", label: "Summary" },
  ];

  const handleFilterChange = (key, value) => {
    console.log(`Filter change: ${key} = ${value}`);
    onFilterChange({ [key]: value });
    // Auto-close mobile filters after selection on mobile
    if (window.innerWidth < 768) {
      setShowMobileFilters(false);
    }
  };

  const clearFilters = () => {
    onFilterChange({
      status: "all",
      priority: "all",
      category: "all",
      assigned: "all",
      sortBy: "created_at",
      sortOrder: "DESC",
    });
    setShowMobileFilters(false);
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "all" ||
    filters.assigned !== "all";

  return (
    <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
      {/* Mobile Filter Toggle */}
      <div className="block md:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full px-4 py-3 text-left flex items-center justify-between border-b border-gray-200 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Filters</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Active
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              showMobileFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${showMobileFilters || "hidden md:block"}`}>
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile Clear Filters Button */}
          {hasActiveFilters && (
            <div className="block md:hidden mb-4">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 rounded-lg"
              >
                Clear All Filters
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => {
                  console.log("Status dropdown changed to:", e.target.value);
                  handleFilterChange("status", e.target.value);
                }}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}{" "}
                    {option.count !== undefined && `(${option.count})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}{" "}
                    {option.count !== undefined && `(${option.count})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Assignment
              </label>
              <select
                value={filters.assigned}
                onChange={(e) => handleFilterChange("assigned", e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
              >
                {assignmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}{" "}
                    {option.count !== undefined && `(${option.count})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Sort By
              </label>
              <div className="flex gap-1 sm:gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    handleFilterChange(
                      "sortOrder",
                      filters.sortOrder === "ASC" ? "DESC" : "ASC"
                    )
                  }
                  className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium min-w-[44px] flex items-center justify-center"
                  title={`Currently sorted ${
                    filters.sortOrder === "ASC" ? "ascending" : "descending"
                  }`}
                >
                  {filters.sortOrder === "ASC" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <button
                onClick={() => handleFilterChange("status", "open")}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 min-h-[32px] sm:min-h-[36px] ${
                  filters.status === "open"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">Open Tickets</span>
                <span className="sm:hidden">Open</span>
                <span>({stats?.general?.open_tickets || 0})</span>
              </button>

              <button
                onClick={() => handleFilterChange("priority", "urgent")}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-[32px] sm:min-h-[36px] flex items-center gap-1 ${
                  filters.priority === "urgent"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">Urgent</span>
                <span className="sm:hidden">Urgent</span>
                <span>({stats?.general?.urgent_tickets || 0})</span>
              </button>

              <button
                onClick={() => handleFilterChange("assigned", "unassigned")}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-[32px] sm:min-h-[36px] flex items-center gap-1 ${
                  filters.assigned === "unassigned"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <UserX className="w-3 h-3" />
                <span className="hidden sm:inline">Unassigned</span>
                <span className="sm:hidden">Unassigned</span>
                <span>({stats?.general?.unassigned_tickets || 0})</span>
              </button>

              <button
                onClick={() => handleFilterChange("status", "in_progress")}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 min-h-[32px] sm:min-h-[36px] ${
                  filters.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="w-3 h-3" />
                <span className="hidden sm:inline">In Progress</span>
                <span className="sm:hidden">Progress</span>
                <span>({stats?.general?.in_progress_tickets || 0})</span>
              </button>

              {/* SLA Alert Buttons */}
              {stats?.sla?.overdue_first_response > 0 && (
                <button
                  onClick={() => {
                    // This would need a custom filter for overdue first response
                    handleFilterChange("status", "open");
                    // You might need to add additional logic here for SLA filtering
                  }}
                  className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800 border border-red-200 animate-pulse min-h-[32px] sm:min-h-[36px] flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">Overdue Response</span>
                  <span className="sm:hidden">Overdue</span>
                  <span>({stats.sla.overdue_first_response})</span>
                </button>
              )}

              {stats?.sla?.overdue_resolution > 0 && (
                <button
                  onClick={() => {
                    // This would need a custom filter for overdue resolution
                    handleFilterChange("status", "in_progress");
                    // You might need to add additional logic here for SLA filtering
                  }}
                  className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200 animate-pulse min-h-[32px] sm:min-h-[36px] flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  <span className="hidden sm:inline">Overdue Resolution</span>
                  <span className="sm:hidden">Resolution</span>
                  <span>({stats.sla.overdue_resolution})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketFilters;
