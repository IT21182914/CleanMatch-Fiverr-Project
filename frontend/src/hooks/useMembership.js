import { useState, useEffect, useCallback } from "react";
import { membershipAPI } from "../lib/api";
import { useAuth } from "./useAuth";

export const useMembership = () => {
  const { user, isAuthenticated } = useAuth();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to determine if user is a member
  const isMember = membership && membership.status === "active";
  const isNonMemberCustomer =
    isAuthenticated && user?.role === "customer" && !isMember;

  const fetchMembership = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setMembership(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await membershipAPI.getCurrentMembership();
      setMembership(response.data.membership);
    } catch (err) {
      // If user doesn't have a membership, that's not an error
      if (err.response?.status === 404) {
        setMembership(null);
      } else {
        setError(err.message || "Failed to fetch membership status");
        console.error("Error fetching membership:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  return {
    membership,
    isMember,
    isNonMemberCustomer,
    loading,
    error,
    refetch: fetchMembership,
  };
};
