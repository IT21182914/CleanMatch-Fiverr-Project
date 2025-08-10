import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import AdminTicketManagement from "./AdminTicketManagement";
import AdminTicketDetails from "./AdminTicketDetails";

const AdminTicketRoutes = () => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/admin"
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                ← Admin Dashboard
              </Link>
              <nav className="flex space-x-8">
                <Link
                  to="/admin/tickets"
                  className={`text-sm font-medium ${
                    isActiveRoute("/admin/tickets")
                      ? "text-blue-600 border-b-2 border-blue-600 pb-4"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  🎫 Ticket Management
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/tickets" element={<AdminTicketManagement />} />
          <Route path="/tickets/:id" element={<AdminTicketDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminTicketRoutes;
