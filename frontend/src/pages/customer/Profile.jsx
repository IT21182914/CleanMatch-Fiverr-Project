import { useState, useEffect } from "react";
import { UserIcon, KeyIcon, CreditCardIcon, SparklesIcon, CalendarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import { userAPI, membershipAPI } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { useMembership } from "../../hooks/useMembership";
import { validateZipCode, formatDateTime } from "../../lib/utils";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { membership, loading: membershipLoading } = useMembership();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [plans, setPlans] = useState({});
  const [usageStats, setUsageStats] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchMembershipData();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const profile = response.data.user;
      setProfileData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zip_code || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembershipData = async () => {
    try {
      const [plansResponse, membershipResponse] = await Promise.all([
        membershipAPI.getPlans(),
        membershipAPI.getCurrentMembership().catch(() => ({ data: { membership: null, usageStats: null } }))
      ]);

      setPlans(plansResponse.data.plans);
      setUsageStats(membershipResponse.data.usageStats);
    } catch (error) {
      console.error("Error fetching membership data:", error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation removed since it's disabled

    if (!profileData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!profileData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!profileData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!profileData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!profileData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!validateZipCode(profileData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setUpdating(true);
    setSuccessMessage("");
    setErrors({});

    try {
      // Exclude email from update as it's not allowed by backend
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zipCode: profileData.zipCode,
      };

      const response = await userAPI.updateProfile(updateData);
      updateUser(response.data.user);
      setSuccessMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setErrors({
        general: error.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setChangingPassword(true);
    setPasswordErrors({});

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordErrors({
        general: error.response?.data?.error || "Failed to change password",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // Membership helper functions
  const getTierIcon = (tier) => {
    const tierName = tier?.split('_')[0];
    switch (tierName) {
      case "moon":
        return <SparklesIcon className="h-5 w-5 text-blue-600" />;
      case "star":
        return <CheckCircleIcon className="h-5 w-5 text-yellow-600" />;
      case "sun":
        return <CreditCardIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTierGradient = (tier) => {
    const tierName = tier?.split('_')[0];
    switch (tierName) {
      case "moon":
        return "from-blue-400 to-blue-600";
      case "star":
        return "from-yellow-400 to-yellow-600";
      case "sun":
        return "from-orange-400 to-orange-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const getMembershipStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "past_due":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isEndingSoon = (endDate) => {
    if (!endDate) return false;
    const endDateTime = new Date(endDate).getTime();
    const currentTime = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return endDateTime - currentTime <= sevenDaysInMs;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-sm font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                error={errors.firstName}
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              error={errors.email}
              required
              disabled
              placeholder="Email cannot be changed"
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleProfileChange}
              error={errors.phone}
              placeholder="(555) 123-4567"
              required
            />

            <Input
              label="Address"
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              error={errors.address}
              placeholder="123 Main St"
              required
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Input
                label="City"
                name="city"
                value={profileData.city}
                onChange={handleProfileChange}
                error={errors.city}
                required
              />

              <Input
                label="State"
                name="state"
                value={profileData.state}
                onChange={handleProfileChange}
                error={errors.state}
                required
              />

              <Input
                label="ZIP Code"
                name="zipCode"
                value={profileData.zipCode}
                onChange={handleProfileChange}
                error={errors.zipCode}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={updating} disabled={updating}>
                Update Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyIcon className="h-5 w-5 mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {passwordErrors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{passwordErrors.general}</p>
              </div>
            )}

            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
              required
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
              helperText="Password must be at least 8 characters long"
              required
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.confirmPassword}
              required
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={changingPassword}
                disabled={changingPassword}
              >
                Change Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Membership Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Membership</h2>

        {membershipLoading ? (
          <LoadingCard />
        ) : membership && membership.status === "active" ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Membership
                </div>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getMembershipStatusColor(membership.status)}`}
                >
                  {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div
                className={`bg-gradient-to-r ${getTierGradient(membership.tier)} rounded-lg p-6 text-white relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 bg-white/10 rounded-full"></div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      {getTierIcon(membership.tier)}
                      <h3 className="ml-2 text-xl font-semibold">
                        {plans[membership.tier]?.name || membership.plan_name}
                      </h3>
                    </div>
                    <div className="flex items-center mt-1">
                      <CheckCircleIcon className="h-4 w-4 text-white/80 mr-1.5" />
                      <p className="text-white/90 text-sm">
                        {plans[membership.tier]?.discountPercentage
                          ? `${plans[membership.tier].discountPercentage}% discount on services $${plans[membership.tier].discountRange?.min}-$${plans[membership.tier].discountRange?.max}`
                          : `${membership.discount_percentage}% discount on all cleaning services`
                        }
                      </p>
                    </div>
                    {plans[membership.tier]?.subtitle && (
                      <div className="text-white/80 text-sm mt-1">
                        {plans[membership.tier].subtitle}
                      </div>
                    )}
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-3xl font-bold">
                      ${plans[membership.tier]?.fee || membership.monthly_fee}
                    </div>
                    <div className="text-white/80 text-sm">
                      {membership.tier?.includes("12_months") ? "per year" :
                        membership.tier?.includes("6_months") ? "per 6 months" :
                          membership.tier?.includes("3_months") ? "per 3 months" : "per month"}
                    </div>
                    {plans[membership.tier]?.originalFee && (
                      <div className="text-white/60 text-xs line-through">
                        Originally ${plans[membership.tier].originalFee}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Membership Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Membership Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Membership Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs">
                        {formatDateTime(membership.start_date, { dateOnly: true })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">
                        {membership.auto_renewal ? "Next Renewal:" : "Expires:"}
                      </span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${isEndingSoon(membership.current_period_end)
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                        }`}>
                        {formatDateTime(membership.current_period_end, { dateOnly: true })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Auto-Renewal:</span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${membership.auto_renewal
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-700"
                        }`}>
                        {membership.auto_renewal ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Plan Duration:</span>
                      <span className="font-medium bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs">
                        {plans[membership.tier]?.duration || 30} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <SparklesIcon className="h-4 w-4 mr-2 text-green-500" />
                    Your Membership Benefits
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-gray-700">Total Bookings:</span>
                      <span className="font-medium bg-white px-2 py-1 rounded text-gray-800 shadow-sm text-xs">
                        {usageStats?.total_bookings || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-gray-700">Money Saved:</span>
                      <span className="font-medium bg-white px-2 py-1 rounded text-green-600 shadow-sm text-xs">
                        ${(usageStats?.total_discounts || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-gray-700">Discount Range:</span>
                      <span className="font-medium bg-white px-2 py-1 rounded text-blue-600 shadow-sm text-xs">
                        {plans[membership.tier]?.discountRange
                          ? `$${plans[membership.tier].discountRange.min}-$${plans[membership.tier].discountRange.max}`
                          : "All services"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Discount Rate:</span>
                      <span className="font-medium bg-white px-2 py-1 rounded text-green-600 shadow-sm text-xs">
                        {plans[membership.tier]?.discountPercentage || membership.discount_percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              {plans[membership.tier]?.features && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plans[membership.tier].features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/customer/membership'}
                  className="flex-1 sm:flex-none"
                >
                  Change Plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/customer/bookings'}
                  className="flex-1 sm:flex-none"
                >
                  View Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // No active membership
          <Card>
            <CardContent className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <SparklesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Active Membership
              </h3>
              <p className="text-gray-600 mb-6">
                Join our Comfort Life membership plans and save on cleaning services
              </p>
              <Button
                onClick={() => window.location.href = '/customer/membership-subscription'}
                className="w-full sm:w-auto"
              >
                View Membership Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account Type
                </p>
                <p className="text-sm text-gray-500">Customer Account</p>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Member Since
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email Verified
                </p>
                <p className="text-sm text-gray-500">
                  {user?.isVerified ? "Verified" : "Not verified"}
                </p>
              </div>
              {user?.isVerified ? (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Verified
                </span>
              ) : (
                <Button variant="outline" size="sm">
                  Verify Email
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
