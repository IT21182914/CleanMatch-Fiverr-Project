import React, { useState, useEffect } from "react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Loading } from "../../ui/Loading";
import { useToast } from "../../../hooks/useToast";
import { api } from "../../../lib/api";

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("offers");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showToast } = useToast();

  const fetchOffers = async () => {
    try {
      const response = await api.get("/offers/admin/all");
      if (response.data.success) {
        setOffers(response.data.offers);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      showToast("Error loading offers", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/offers/admin/analytics");
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleOfferStatus = async (offerId, currentStatus) => {
    try {
      const response = await api.put(`/offers/admin/${offerId}`, {
        isActive: !currentStatus,
      });

      if (response.data.success) {
        setOffers(
          offers.map((offer) =>
            offer.id === offerId
              ? { ...offer, is_active: !currentStatus }
              : offer
          )
        );
        showToast(
          `Offer ${!currentStatus ? "activated" : "deactivated"} successfully`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error toggling offer status:", error);
      showToast("Error updating offer status", "error");
    }
  };

  const deleteOffer = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) {
      return;
    }

    try {
      await api.delete(`/offers/admin/${offerId}`);
      setOffers(offers.filter((offer) => offer.id !== offerId));
      showToast("Offer deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting offer:", error);
      showToast("Error deleting offer", "error");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Special Offers Management
        </h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create New Offer
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("offers")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "offers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Offers ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "analytics"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Offers Tab */}
      {activeTab === "offers" && (
        <div className="space-y-4">
          {offers.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No offers
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new offer.
                </p>
              </div>
            </Card>
          ) : (
            offers.map((offer) => (
              <Card key={offer.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {offer.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          offer.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {offer.is_active ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          offer.offer_type === "first_clean"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {offer.offer_type.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{offer.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Discount:</span>
                        <p className="font-medium">
                          {offer.discount_type === "fixed_price" &&
                            `$${offer.discount_value}`}
                          {offer.discount_type === "fixed_amount" &&
                            `$${offer.discount_value} off`}
                          {offer.discount_type === "percentage" &&
                            `${offer.discount_value}% off`}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Times Used:</span>
                        <p className="font-medium">{offer.times_used || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Uses:</span>
                        <p className="font-medium">
                          {offer.max_total_uses
                            ? offer.max_total_uses
                            : "Unlimited"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="font-medium">
                          {new Date(offer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {offer.valid_until && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Valid Until:</span>
                        <span className="ml-1 font-medium">
                          {new Date(offer.valid_until).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {offer.created_by_name && (
                      <div className="mt-2 text-sm text-gray-500">
                        Created by: {offer.created_by_name}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button
                      onClick={() =>
                        showToast("Edit functionality coming soon", "info")
                      }
                      size="sm"
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() =>
                        toggleOfferStatus(offer.id, offer.is_active)
                      }
                      size="sm"
                      className={
                        offer.is_active
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }
                    >
                      {offer.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => deleteOffer(offer.id)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.totalStats.total_offers}
                </div>
                <div className="text-sm text-gray-600">Total Offers</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.totalStats.active_offers}
                </div>
                <div className="text-sm text-gray-600">Active Offers</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.totalStats.total_redemptions}
                </div>
                <div className="text-sm text-gray-600">Total Redemptions</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.totalStats.first_clean_redemptions}
                </div>
                <div className="text-sm text-gray-600">First Clean Uses</div>
              </div>
            </Card>
          </div>

          {/* Top Offers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Top Performing Offers
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Offer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Uses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Discounts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.topOffers.map((offer, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {offer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.offer_type.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.current_total_uses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(offer.total_discount_given || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Create/Edit Modal would go here */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Create New Offer</h2>
              <p className="text-gray-600 mb-4">
                Offer creation functionality would be implemented here with a
                form.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Offer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OffersManagement;
