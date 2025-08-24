import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import CustomerDashboard from "../pages/customer/Dashboard";
import CustomerProfile from "../pages/customer/Profile";
import BookingForm from "../pages/customer/BookingForm";
import Bookings from "../pages/customer/Bookings";
import BookingDetails from "../pages/customer/BookingDetails";
import Payment from "../pages/customer/Payment";
import MembershipSubscription from "../pages/customer/MembershipSubscription";
import DynamicMembershipPayment from "../pages/customer/DynamicMembershipPayment";
import SearchFreelancers from "../pages/customer/SearchFreelancers";
import FreelancerProfile from "../pages/customer/FreelancerProfile";
import CustomerTickets from "../pages/customer/CustomerTickets";
import CustomerTicketDetail from "../pages/customer/CustomerTicketDetail";
import CreateTicket from "../pages/customer/CreateTicket";
import CustomerSettings from "../pages/customer/CustomerSettings";
import CustomerOffers from "../pages/customer/CustomerOffers";
import CustomerReviews from "../pages/customer/CustomerReviews";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <CustomerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book"
        element={
          <ProtectedRoute>
            <BookingForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute>
            <BookingDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/membership"
        element={
          <ProtectedRoute>
            <MembershipSubscription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/custom-membership"
        element={
          <ProtectedRoute>
            <DynamicMembershipPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search-freelancers"
        element={
          <ProtectedRoute>
            <SearchFreelancers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelancer/:id"
        element={
          <ProtectedRoute>
            <FreelancerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <CustomerTickets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <CustomerTicketDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-ticket"
        element={
          <ProtectedRoute>
            <CreateTicket />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <CustomerSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <CustomerOffers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <CustomerReviews />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default CustomerRoutes;
