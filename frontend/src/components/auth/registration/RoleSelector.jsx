import { UserIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

const RoleSelector = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6">
      <div className="p-6">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => onRoleChange("customer")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
              selectedRole === "customer"
                ? "bg-cyan-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <UserIcon className="h-5 w-5 inline mr-2" />
            Customer (User)
          </button>
          <button
            type="button"
            onClick={() => onRoleChange("freelancer")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
              selectedRole === "freelancer"
                ? "bg-cyan-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <WrenchScrewdriverIcon className="h-5 w-5 inline mr-2" />
            Freelancer (Cleaner/Agency)
          </button>
        </div>

        {/* Role Selection Help Text */}
        <div className="mt-3 text-sm text-gray-600">
          {selectedRole === "customer" ? (
            <p className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              You'll be able to book cleaning services and manage your
              appointments
            </p>
          ) : (
            <div className="space-y-1">
              <p className="flex items-center">
                <WrenchScrewdriverIcon className="h-4 w-4 mr-1" />
                You'll be able to offer cleaning services to customers
              </p>
              <p className="text-xs text-gray-500">
                💡 Upload documents for verification to become a trusted
                freelancer, or register without documents to start as a basic
                cleaner
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
