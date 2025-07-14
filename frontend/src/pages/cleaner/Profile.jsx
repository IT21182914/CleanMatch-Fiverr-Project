import { useState, useEffect } from "react";
import {
  UserIcon,
  KeyIcon,
  BriefcaseIcon,
  StarIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Input, Textarea, Select } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import { userAPI, paymentsAPI } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail, validateZipCode } from "../../lib/utils";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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

  const [cleanerData, setCleanerData] = useState({
    bio: "",
    experienceYears: 0,
    hourlyRate: 25,
    serviceRadius: 10,
    certifications: [],
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [stripeStatus, setStripeStatus] = useState({
    status: "not_created",
    canReceivePayments: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchStripeStatus();
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

      if (profile.cleanerProfile) {
        setCleanerData({
          bio: profile.cleanerProfile.bio || "",
          experienceYears: profile.cleanerProfile.experience_years || 0,
          hourlyRate: profile.cleanerProfile.hourly_rate || 25,
          serviceRadius: profile.cleanerProfile.service_radius || 10,
          certifications: profile.cleanerProfile.certifications || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStripeStatus = async () => {
    try {
      const response = await paymentsAPI.getConnectAccountStatus();
      setStripeStatus(response.data);
    } catch (error) {
      console.error("Error fetching Stripe status:", error);
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

  const handleCleanerChange = (e) => {
    const { name, value } = e.target;
    setCleanerData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!profileData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = "Please enter a valid email";
    }

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setUpdating(true);
    setSuccessMessage("");

    try {
      const response = await userAPI.updateProfile(profileData);
      updateUser(response.data.user);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCleanerSubmit = async (e) => {
    e.preventDefault();

    setUpdating(true);
    setSuccessMessage("");

    try {
      await userAPI.updateCleanerProfile(cleanerData);
      setSuccessMessage("Cleaner profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error || "Failed to update cleaner profile",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

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

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setChangingPassword(true);

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
      setPasswordErrors({
        general: error.response?.data?.error || "Failed to change password",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleStripeSetup = async () => {
    try {
      const response = await paymentsAPI.createCleanerConnectAccount();
      window.location.href = response.data.account_link;
    } catch (error) {
      console.error("Error setting up Stripe:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your personal information and cleaner profile.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Personal Information */}
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
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleProfileChange}
              error={errors.phone}
              required
            />

            <Input
              label="Address"
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              error={errors.address}
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

      {/* Cleaner Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCleanerSubmit} className="space-y-6">
            <Textarea
              label="Bio"
              name="bio"
              value={cleanerData.bio}
              onChange={handleCleanerChange}
              placeholder="Tell customers about yourself, your experience, and what makes you a great cleaner..."
              rows={4}
              helperText="This will be shown to potential customers"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Input
                label="Years of Experience"
                name="experienceYears"
                type="number"
                min="0"
                max="50"
                value={cleanerData.experienceYears}
                onChange={handleCleanerChange}
              />

              <Input
                label="Hourly Rate ($)"
                name="hourlyRate"
                type="number"
                min="15"
                max="100"
                step="0.01"
                value={cleanerData.hourlyRate}
                onChange={handleCleanerChange}
                helperText="Your base hourly rate"
              />

              <Input
                label="Service Radius (miles)"
                name="serviceRadius"
                type="number"
                min="1"
                max="50"
                value={cleanerData.serviceRadius}
                onChange={handleCleanerChange}
                helperText="How far you're willing to travel"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={updating} disabled={updating}>
                Update Professional Info
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Payment Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Payment Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Payment Account Status
                </p>
                <p className="text-sm text-gray-500">
                  {stripeStatus.status === "complete"
                    ? "Your payment account is set up and ready to receive payments"
                    : "Set up your payment account to receive earnings from completed jobs"}
                </p>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  stripeStatus.canReceivePayments
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {stripeStatus.canReceivePayments ? "Active" : "Setup Required"}
              </span>
            </div>

            {!stripeStatus.canReceivePayments && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Payment Setup Required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Complete your payment setup to start receiving earnings
                        from completed jobs.
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button onClick={handleStripeSetup} size="sm">
                        Complete Payment Setup
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <StarIcon className="h-5 w-5 mr-2" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account Type
                </p>
                <p className="text-sm text-gray-500">Professional Cleaner</p>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Background Check
                </p>
                <p className="text-sm text-gray-500">
                  Required for customer trust and safety
                </p>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Member Since
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
