import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Input, Select } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { validateEmail, validatePassword } from "../../lib/utils";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "customer",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and contain at least one lowercase letter, one uppercase letter, one number, and one special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    // Address fields are required for both customers and cleaners
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Remove confirmPassword from the data sent to backend
      const { confirmPassword: _confirmPassword, ...registrationData } =
        formData;
      const result = await register(registrationData);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setErrors({ general: result.error });
      }
    } catch {
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="First name"
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Last name"
                required
              />
            </div>

            <Input
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="(555) 123-4567"
              required
            />

            <Select
              label="Account Type"
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              required
            >
              <option value="customer">
                Customer - Book cleaning services
              </option>
              <option value="cleaner">
                Cleaner - Provide cleaning services
              </option>
            </Select>

            {/* Address fields for both customers and cleaners */}
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="123 Main St"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="New York"
                required
              />

              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
                placeholder="NY"
                required
              />
            </div>

            <Input
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              error={errors.zipCode}
              placeholder="12345"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
