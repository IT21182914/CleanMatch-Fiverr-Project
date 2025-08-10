import React from "react";

const AdminTicketFilters = ({ filters, onFilterChange, stats, adminUsers }) => {
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
    onFilterChange({ [key]: value });
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
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "all" ||
    filters.assigned !== "all";

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
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

      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment
            </label>
            <select
              value={filters.assigned}
              onChange={(e) => handleFilterChange("assigned", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
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
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange("status", "open")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.status === "open"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🚨 Open Tickets ({stats?.general?.open_tickets || 0})
            </button>

            <button
              onClick={() => handleFilterChange("priority", "urgent")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.priority === "urgent"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⚡ Urgent ({stats?.general?.urgent_tickets || 0})
            </button>

            <button
              onClick={() => handleFilterChange("assigned", "unassigned")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.assigned === "unassigned"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              👤 Unassigned ({stats?.general?.unassigned_tickets || 0})
            </button>

            <button
              onClick={() => handleFilterChange("status", "in_progress")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.status === "in_progress"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔄 In Progress ({stats?.general?.in_progress_tickets || 0})
            </button>

            {/* SLA Alert Buttons */}
            {stats?.sla?.overdue_first_response > 0 && (
              <button
                onClick={() => {
                  // This would need a custom filter for overdue first response
                  handleFilterChange("status", "open");
                  // You might need to add additional logic here for SLA filtering
                }}
                className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200 animate-pulse"
              >
                ⏰ Overdue Response ({stats.sla.overdue_first_response})
              </button>
            )}

            {stats?.sla?.overdue_resolution > 0 && (
              <button
                onClick={() => {
                  // This would need a custom filter for overdue resolution
                  handleFilterChange("status", "in_progress");
                  // You might need to add additional logic here for SLA filtering
                }}
                className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200 animate-pulse"
              >
                📅 Overdue Resolution ({stats.sla.overdue_resolution})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketFilters;
