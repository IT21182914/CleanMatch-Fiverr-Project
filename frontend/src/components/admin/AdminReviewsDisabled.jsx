import React from "react";
import { Card } from "../ui/Card";
import { StarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const AdminReviewsDisabled = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
      </div>

      {/* Disabled Notice */}
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Admin Review Feature Disabled
            </h3>
            <p className="text-gray-600 max-w-md">
              The admin review management feature has been temporarily disabled. 
              The review system continues to work normally for customers.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
            <StarIcon className="h-4 w-4" />
            <span>Customer reviews remain fully functional</span>
          </div>
        </div>
      </Card>

      {/* Information Card */}
      <Card className="p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">
          What this means:
        </h4>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Customers can still leave reviews for completed services</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Existing reviews remain visible on cleaner profiles</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Admin review creation and management features are disabled</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminReviewsDisabled;
