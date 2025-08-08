import { useState, useEffect } from "react";
import { UsersIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

const AdminMemberships = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Membership Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage user memberships and view comprehensive analytics
          </p>
        </div>
      </div>

      {/* Basic Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Users & Memberships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Basic membership management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMemberships;
