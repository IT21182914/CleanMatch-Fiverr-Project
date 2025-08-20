import React, { useState } from "react";
import { Link } from "react-router-dom";
import TicketList from "../../components/tickets/TicketList";
import CreateTicket from "../../components/tickets/CreateTicket";

const CustomerTickets = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleTicketCreated = () => {
    setShowCreateForm(false);
    setRefreshList((prev) => prev + 1); // Trigger list refresh
  };

  if (showCreateForm) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <nav className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center">
            <Link to="/dashboard" className="hover:text-blue-600 truncate">
              Dashboard
            </Link>
            <span className="mx-1 sm:mx-2 flex-shrink-0">/</span>
            <Link to="/tickets" className="hover:text-blue-600 truncate">
              Support Tickets
            </Link>
            <span className="mx-1 sm:mx-2 flex-shrink-0">/</span>
            <span className="truncate">Create New</span>
          </nav>
        </div>

        <CreateTicket
          onTicketCreated={handleTicketCreated}
          onClose={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6">
        <nav className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex flex-wrap items-center">
          <Link to="/dashboard" className="hover:text-blue-600 truncate">
            Dashboard
          </Link>
          <span className="mx-1 sm:mx-2 flex-shrink-0">/</span>
          <span className="truncate">Support Tickets</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Support Tickets
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Submit and track your support requests
            </p>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="whitespace-nowrap">Create New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      <TicketList key={refreshList} userRole="customer" />
    </div>
  );
};

export default CustomerTickets;
