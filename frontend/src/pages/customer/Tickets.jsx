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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <Link to="/tickets" className="hover:text-blue-600">
              Support Tickets
            </Link>
            <span className="mx-2">/</span>
            <span>Create New</span>
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span>Support Tickets</span>
        </nav>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Support Tickets
            </h1>
            <p className="text-gray-600 mt-1">
              Submit and track your support requests
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
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
            Create New Ticket
          </button>
        </div>
      </div>

      <TicketList key={refreshList} userRole="customer" />
    </div>
  );
};

export default CustomerTickets;
