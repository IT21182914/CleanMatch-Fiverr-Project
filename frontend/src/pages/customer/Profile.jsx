import { useState, useEffect } from "react";
import { UserIcon, KeyIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { LoadingCard } from "../../components/ui/Loading";
import MembershipCard from "../../components/membership/MembershipCard";
import { userAPI } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { validateZipCode } from "../../lib/utils";

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
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
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

      {/* ForeverClean Membership */}
      <MembershipCard />

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
