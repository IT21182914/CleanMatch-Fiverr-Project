import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../hooks/useToast";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";

const TrustManagement = () => {
  const [badges, setBadges] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("badges");
  const [showBadgeForm, setShowBadgeForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const { showToast } = useToast();

  const [badgeForm, setBadgeForm] = useState({
    name: "",
    description: "",
    type: "certification",
    icon_url: "",
    display_order: 1,
    is_active: true,
  });

  const [testimonialForm, setTestimonialForm] = useState({
    customer_name: "",
    content: "",
    rating: 5,
    service_type: "",
    location: "",
    is_featured: false,
  });

  const fetchTrustData = useCallback(async () => {
    try {
      setLoading(true);
      const [badgesRes, testimonialsRes] = await Promise.all([
        api.get("/trust/admin/badges"),
        api.get("/trust/admin/testimonials"),
      ]);

      setBadges(badgesRes.data.badges || []);
      setTestimonials(testimonialsRes.data.testimonials || []);
    } catch (error) {
      console.error("Error fetching trust data:", error);
      showToast("Failed to fetch trust data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTrustData();
  }, [fetchTrustData]);

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    try {
      await api.post("/trust/admin/badges", badgeForm);
      showToast("Badge created successfully", "success");
      setBadgeForm({
        name: "",
        description: "",
        type: "certification",
        icon_url: "",
        display_order: 1,
        is_active: true,
      });
      setShowBadgeForm(false);
      fetchTrustData();
    } catch (error) {
      console.error("Error creating badge:", error);
      showToast("Failed to create badge", "error");
    }
  };

  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    try {
      await api.post("/trust/admin/testimonials", testimonialForm);
      showToast("Testimonial created successfully", "success");
      setTestimonialForm({
        customer_name: "",
        content: "",
        rating: 5,
        service_type: "",
        location: "",
        is_featured: false,
      });
      setShowTestimonialForm(false);
      fetchTrustData();
    } catch (error) {
      console.error("Error creating testimonial:", error);
      showToast("Failed to create testimonial", "error");
    }
  };

  const handleDeleteBadge = async (badgeId) => {
    if (!window.confirm("Are you sure you want to delete this badge?")) return;

    try {
      await api.delete(`/trust/admin/badges/${badgeId}`);
      showToast("Badge deleted successfully", "success");
      fetchTrustData();
    } catch (error) {
      console.error("Error deleting badge:", error);
      showToast("Failed to delete badge", "error");
    }
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;

    try {
      await api.delete(`/trust/admin/testimonials/${testimonialId}`);
      showToast("Testimonial deleted successfully", "success");
      fetchTrustData();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      showToast("Failed to delete testimonial", "error");
    }
  };

  const toggleBadgeStatus = async (badgeId, currentStatus) => {
    try {
      await api.put(`/trust/admin/badges/${badgeId}`, {
        is_active: !currentStatus,
      });
      showToast(
        `Badge ${!currentStatus ? "activated" : "deactivated"} successfully`,
        "success"
      );
      fetchTrustData();
    } catch (error) {
      console.error("Error updating badge status:", error);
      showToast("Failed to update badge status", "error");
    }
  };

  const toggleTestimonialFeatured = async (testimonialId, currentStatus) => {
    try {
      await api.put(`/trust/admin/testimonials/${testimonialId}`, {
        is_featured: !currentStatus,
      });
      showToast(
        `Testimonial ${
          !currentStatus ? "featured" : "unfeatured"
        } successfully`,
        "success"
      );
      fetchTrustData();
    } catch (error) {
      console.error("Error updating testimonial status:", error);
      showToast("Failed to update testimonial status", "error");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Trust Management</h1>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowBadgeForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Badge
          </Button>
          <Button
            onClick={() => setShowTestimonialForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("badges")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "badges"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Trust Badges ({badges.length})
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "testimonials"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Testimonials ({testimonials.length})
          </button>
        </nav>
      </div>

      {/* Badges Tab */}
      {activeTab === "badges" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => (
              <Card key={badge.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {badge.icon_url && (
                      <img
                        src={badge.icon_url}
                        alt={badge.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {badge.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            badge.type === "certification"
                              ? "bg-blue-100 text-blue-800"
                              : badge.type === "award"
                              ? "bg-yellow-100 text-yellow-800"
                              : badge.type === "media"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {badge.type}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            badge.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {badge.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        toggleBadgeStatus(badge.id, badge.is_active)
                      }
                      className={`p-1 rounded ${
                        badge.is_active
                          ? "text-red-600 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {badge.is_active ? "🔇" : "🔊"}
                    </button>
                    <button
                      onClick={() => handleDeleteBadge(badge.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === "testimonials" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {testimonial.customer_name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < testimonial.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {testimonial.service_type} • {testimonial.location}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          testimonial.is_featured
                            ? "bg-star-100 text-star-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {testimonial.is_featured ? "Featured" : "Regular"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() =>
                        toggleTestimonialFeatured(
                          testimonial.id,
                          testimonial.is_featured
                        )
                      }
                      className={`p-1 rounded ${
                        testimonial.is_featured
                          ? "text-gray-600 hover:bg-gray-50"
                          : "text-yellow-600 hover:bg-yellow-50"
                      }`}
                    >
                      {testimonial.is_featured ? "⭐" : "☆"}
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Badge Form Modal */}
      {showBadgeForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Add Trust Badge
            </h3>
            <form onSubmit={handleCreateBadge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={badgeForm.name}
                  onChange={(e) =>
                    setBadgeForm({ ...badgeForm, name: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  value={badgeForm.description}
                  onChange={(e) =>
                    setBadgeForm({ ...badgeForm, description: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={badgeForm.type}
                  onChange={(e) =>
                    setBadgeForm({ ...badgeForm, type: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="certification">Certification</option>
                  <option value="award">Award</option>
                  <option value="media">Media</option>
                  <option value="guarantee">Guarantee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Icon URL
                </label>
                <input
                  type="url"
                  value={badgeForm.icon_url}
                  onChange={(e) =>
                    setBadgeForm({ ...badgeForm, icon_url: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={badgeForm.display_order}
                  onChange={(e) =>
                    setBadgeForm({
                      ...badgeForm,
                      display_order: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Badge
                </Button>
                <button
                  type="button"
                  onClick={() => setShowBadgeForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Form Modal */}
      {showTestimonialForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Add Testimonial
            </h3>
            <form onSubmit={handleCreateTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={testimonialForm.customer_name}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      customer_name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  required
                  value={testimonialForm.content}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      content: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <select
                  value={testimonialForm.rating}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Type
                </label>
                <input
                  type="text"
                  value={testimonialForm.service_type}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      service_type: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Deep Clean, Regular Clean"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={testimonialForm.location}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      location: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Brooklyn, NY"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={testimonialForm.is_featured}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      is_featured: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Feature this testimonial
                </label>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Testimonial
                </Button>
                <button
                  type="button"
                  onClick={() => setShowTestimonialForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustManagement;
