import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import ContractorAgreementModal from "../ui/ContractorAgreementModal";
import { validateEmail } from "../../lib/utils";

// Components
import RoleSelector from "./registration/RoleSelector";
import CustomerForm from "./registration/CustomerForm";
import FreelancerForm from "./registration/FreelancerForm";
import ValidationSummary from "./registration/ValidationSummary";
import RegistrationBenefits from "./registration/RegistrationBenefits";
import MembershipBanner from "./registration/MembershipBanner";
import RegistrationHeader from "./registration/RegistrationHeader";
import SubmitButton from "./registration/SubmitButton";
import FormFooter from "./registration/FormFooter";
import TermsAndPrivacy from "./registration/TermsAndPrivacy";

// Hooks
import { useFormData } from "./registration/hooks/useFormData";
import { useFormValidation } from "./registration/hooks/useFormValidation";
import { useFormSubmission } from "./registration/hooks/useFormSubmission";

const RoleBasedRegistrationForm = () => {
  const [selectedRole, setSelectedRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Check if user came here with membership intent
  const membershipIntent = location.state?.membershipIntent;
  const redirectTo = location.state?.redirectTo || "/dashboard";

  // Custom hooks
  const {
    formData,
    errors,
    setErrors,
    handleChange,
    resetFormData,
    cleaningServiceOptions,
  } = useFormData();

  const { validateEmailField, validateForm } = useFormValidation();

  const { loading, handleSubmit } = useFormSubmission(
    formData,
    setErrors,
    navigate,
    membershipIntent,
    redirectTo
  );

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrors({}); // Clear errors when switching roles
    resetFormData(); // Reset form data when switching roles
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle email blur for real-time validation
  const handleEmailBlur = async (e) => {
    const email = e.target.value.trim();
    if (email && validateEmail(email)) {
      const emailError = await validateEmailField(email);
      if (emailError) {
        setErrors((prev) => ({
          ...prev,
          email: emailError,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex flex-col justify-center py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Membership Intent Banner */}
        {membershipIntent && <MembershipBanner />}

        {/* Logo and Header */}
        <RegistrationHeader membershipIntent={membershipIntent} />

        {/* Role Selection */}
        <RoleSelector
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
        />

        {/* Registration Form */}
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-6 shadow-xl rounded-2xl border border-gray-100">
          <form
            className="space-y-4 sm:space-y-6"
            onSubmit={(e) => handleSubmit(e, selectedRole, validateForm)}
          >
            <ValidationSummary errors={errors} />

            {/* Customer Form */}
            {selectedRole === "customer" && (
              <CustomerForm
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onEmailBlur={handleEmailBlur}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onTogglePassword={togglePasswordVisibility}
                onToggleConfirmPassword={toggleConfirmPasswordVisibility}
              />
            )}

            {/* Freelancer Form */}
            {selectedRole === "freelancer" && (
              <FreelancerForm
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onEmailBlur={handleEmailBlur}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onTogglePassword={togglePasswordVisibility}
                onToggleConfirmPassword={toggleConfirmPasswordVisibility}
                onShowAgreementModal={() => setShowAgreementModal(true)}
                cleaningServiceOptions={cleaningServiceOptions}
              />
            )}

            {/* Submit Button */}
            <SubmitButton
              loading={loading}
              membershipIntent={membershipIntent}
            />

            {/* Form Footer */}
            <FormFooter />
          </form>

          {/* Trust Indicators */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1" />
                <span>Secure Registration</span>
              </div>
              <div className="flex items-center">
                <SparklesIcon
                  className="h-4 w-4 mr-1"
                  style={{ color: "#6ED1EA" }}
                />
                <span>Trusted Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Privacy */}
        <TermsAndPrivacy />

        {/* Benefits Preview */}
        <RegistrationBenefits selectedRole={selectedRole} />
      </div>

      {/* Contractor Agreement Modal */}
      <ContractorAgreementModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
      />
    </div>
  );
};

export default RoleBasedRegistrationForm;
