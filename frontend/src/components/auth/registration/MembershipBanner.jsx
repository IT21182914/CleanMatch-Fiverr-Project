import { SparklesIcon } from "@heroicons/react/24/outline";

const MembershipBanner = ({ membershipIntent }) => {
  if (!membershipIntent) return null;

  return (
    <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl p-4 mb-6">
      <div className="flex items-center">
        <SparklesIcon className="h-6 w-6 text-orange-600 mr-3" />
        <div>
          <h3 className="font-bold text-gray-900">
            🎉 Complete Your Registration to Unlock 50% Savings!
          </h3>
          <p className="text-sm text-gray-600">
            You're just one step away from joining our SuperSaver membership
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembershipBanner;
