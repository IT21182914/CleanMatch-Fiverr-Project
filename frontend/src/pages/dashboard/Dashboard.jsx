import { useAuth } from "../../hooks/useAuth";
import CustomerDashboard from "./CustomerDashboard";
import CleanerDashboard from "./CleanerDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === "customer") {
    return <CustomerDashboard />;
  }

  if (user?.role === "cleaner") {
    return <CleanerDashboard />;
  }

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome to CleanMatch
      </h1>
      <p className="mt-2 text-gray-600">
        Please contact support if you're seeing this message.
      </p>
    </div>
  );
};

export default Dashboard;
