const RegistrationHeader = ({ membershipIntent }) => {
  return (
    <div className="text-center mb-6">
      <div className="mx-auto mb-4 flex justify-center">
        <img
          src="/Simorgh-Service-Logo.webp"
          alt="Simorgh Service Logo"
          className="h-16 w-auto sm:h-20 object-contain hover:scale-105 transition-all duration-300"
        />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        {membershipIntent
          ? "Join & Start Saving 50%"
          : "Join SIMORGH SERVICE Today"}
      </h2>
      <p className="text-base sm:text-lg text-gray-600">
        {membershipIntent
          ? "Create your account to access member pricing"
          : "Choose your role and create your account"}
      </p>
    </div>
  );
};

export default RegistrationHeader;
