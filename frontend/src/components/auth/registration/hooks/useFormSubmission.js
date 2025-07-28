import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";

export const useFormSubmission = (
  formData,
  setErrors,
  navigate,
  membershipIntent,
  redirectTo
) => {
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();

  const handleSubmit = async (e, selectedRole, validateForm) => {
    e.preventDefault();

    const validationErrors = validateForm(selectedRole, formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      if (selectedRole === "customer") {
        // Customer registration (regular form)
        const registrationData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.userName,
          phone: formData.phone,
          role: "customer",
        };

        const result = await register(registrationData);
        if (result.success) {
          // Check if user came here with membership intent
          if (membershipIntent && redirectTo) {
            navigate(redirectTo, {
              state: {
                selectedTier: "supersaver",
                welcomeMessage:
                  "Welcome! Complete your membership subscription below.",
              },
            });
          } else {
            navigate("/dashboard");
          }
        } else {
          setErrors({ general: result.error });
        }
      } else {
        // Check if user wants to upload documents (freelancer) or just register as cleaner
        const hasDocuments =
          formData.idFront &&
          formData.idBack &&
          formData.ssnFront &&
          formData.ssnBack;

        if (hasDocuments) {
          // Full freelancer registration with documents
          const formDataToSend = new FormData();

          // Add text fields
          formDataToSend.append("email", formData.email.trim().toLowerCase());
          formDataToSend.append("password", formData.password);
          formDataToSend.append("firstName", formData.firstName.trim());
          formDataToSend.append("lastName", formData.lastName.trim());
          formDataToSend.append("phone", formData.phone.trim());
          formDataToSend.append("address", formData.address.trim());
          formDataToSend.append("city", formData.city.trim());
          formDataToSend.append("state", formData.state.trim());
          formDataToSend.append("postalCode", formData.postalCode.trim());
          formDataToSend.append(
            "cleaningServices",
            JSON.stringify(formData.cleaningServices)
          );
          formDataToSend.append(
            "cleaningFrequency",
            formData.cleaningFrequency
          );
          formDataToSend.append(
            "preferredHours",
            formData.preferredHours || ""
          );
          formDataToSend.append("message", formData.message || "");

          // Add file uploads
          formDataToSend.append("idFront", formData.idFront);
          formDataToSend.append("idBack", formData.idBack);
          formDataToSend.append("ssnFront", formData.ssnFront);
          formDataToSend.append("ssnBack", formData.ssnBack);

          // Call freelancer registration endpoint
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000/api";

          let response;
          try {
            console.log("🚀 Sending freelancer registration request...");
            response = await fetch(`${apiUrl}/auth/register-freelancer`, {
              method: "POST",
              body: formDataToSend,
            });

            console.log(
              "📡 Response received:",
              response.status,
              response.statusText
            );
          } catch (fetchError) {
            console.error("❌ Network error:", fetchError);
            setErrors({
              general:
                "Cannot connect to server. Please check your internet connection and ensure the backend server is running.",
            });
            return;
          }

          let responseData;
          try {
            responseData = await response.json();
            console.log("📄 Response data:", responseData);
          } catch (parseError) {
            console.error("❌ Failed to parse response:", parseError);
            setErrors({
              general: `Server error (${response.status}). Please try again later.`,
            });
            return;
          }

          if (!response.ok) {
            // Handle specific error cases
            let errorMessage = "Registration failed. Please try again.";

            if (response.status === 409) {
              errorMessage =
                "An account with this email already exists. Please use a different email address or try logging in.";
            } else if (response.status === 400) {
              if (responseData.error?.includes("email")) {
                errorMessage = "Please provide a valid email address.";
              } else if (responseData.error?.includes("password")) {
                errorMessage =
                  "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
              } else if (responseData.error?.includes("documents")) {
                errorMessage =
                  "All verification documents (ID front, ID back, SSN front, SSN back) are required.";
              } else {
                errorMessage =
                  responseData.error ||
                  "Invalid registration data. Please check all fields.";
              }
            } else if (response.status === 422) {
              errorMessage =
                responseData.error ||
                "Please check that all required fields are filled correctly.";
            } else if (response.status >= 500) {
              errorMessage =
                "Server error. Please try again later or contact support.";
            } else {
              errorMessage =
                responseData.error ||
                `Error ${response.status}: ${response.statusText}`;
            }

            setErrors({ general: errorMessage });
            return;
          }

          if (responseData.success) {
            console.log("✅ Freelancer registration successful");

            // Store tokens immediately
            localStorage.setItem("token", responseData.token);
            localStorage.setItem("user", JSON.stringify(responseData.user));
            if (responseData.refreshToken) {
              localStorage.setItem("refreshToken", responseData.refreshToken);
            }

            // Update auth context directly (similar to register function)
            try {
              // Trigger auth context update by calling login with stored credentials
              // This will update the context state properly
              const loginResponse = await login({
                email: formData.email,
                password: formData.password,
                rememberMe: true,
              });

              if (loginResponse.success) {
                console.log(
                  "✅ Auto-login successful, redirecting to dashboard"
                );
                navigate("/dashboard");
              } else {
                console.log(
                  "⚠️ Auto-login failed, manually updating auth state"
                );
                // Force a page refresh to trigger auth initialization
                window.location.href = "/dashboard";
              }
            } catch (authError) {
              console.error("Error with auto-login:", authError);
              // Force a page refresh to trigger auth initialization from localStorage
              window.location.href = "/dashboard";
            }
          } else {
            setErrors({
              general:
                responseData.error ||
                "Registration completed but login failed. Please try logging in manually.",
            });
          }
        } else {
          // Basic cleaner registration without documents
          const registrationData = {
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phone: formData.phone.trim(),
            role: "cleaner",
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            zipCode: formData.postalCode.trim(), // Backend expects zipCode, not postalCode
            cleaningServices: formData.cleaningServices,
            cleaningFrequency: formData.cleaningFrequency,
            preferredHours: formData.preferredHours || "",
            message: formData.message || "",
          };

          console.log("🚀 Sending basic cleaner registration...");
          console.log("Registration data:", {
            ...registrationData,
            password: "[HIDDEN]",
          });

          const result = await register(registrationData);

          if (result.success) {
            console.log("✅ Basic cleaner registration successful");
            navigate("/dashboard");
          } else {
            console.error("❌ Cleaner registration failed:", result.error);

            // Handle specific error cases for basic cleaner registration
            let errorMessage =
              result.error || "Registration failed. Please try again.";

            if (
              errorMessage.includes("email already exists") ||
              errorMessage.includes("409") ||
              errorMessage.includes("already registered")
            ) {
              errorMessage =
                "An account with this email already exists. Please use a different email address or try logging in.";
            } else if (
              errorMessage.includes("validation") ||
              errorMessage.includes("required")
            ) {
              errorMessage = "Please fill in all required fields correctly.";
            } else if (errorMessage.includes("password")) {
              errorMessage =
                "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
            } else if (errorMessage.includes("email")) {
              errorMessage = "Please provide a valid email address.";
            } else if (
              errorMessage.includes("network") ||
              errorMessage.includes("connect") ||
              errorMessage.includes("fetch")
            ) {
              errorMessage =
                "Cannot connect to server. Please check your internet connection and ensure the backend is running.";
            } else if (
              errorMessage.includes("Role must be either customer or cleaner")
            ) {
              errorMessage =
                "Invalid registration type. Please refresh the page and try again.";
            } else if (
              errorMessage.includes("User with this email already exists")
            ) {
              errorMessage =
                "This email address is already registered. Please use a different email or sign in instead.";
            }

            setErrors({ general: errorMessage });
          }
        }
      }
    } catch (error) {
      console.error("❌ Registration error:", error);

      // Handle different types of errors
      let errorMessage = "Registration failed. Please try again.";

      if (error.message?.includes("fetch")) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit,
  };
};
