import { useState, useEffect } from "react";
import {
  UserIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LoadingCard, LoadingTableRow } from "../../components/ui/Loading";
import { adminAPI } from "../../lib/api";
import { formatDateTime, capitalizeFirst } from "../../lib/utils";

const PendingFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionNotes, setActionNotes] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  useEffect(() => {
    fetchFreelancers();
  }, [pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingFreelancers({
        page: pagination.page,
        limit: pagination.limit,
      });
      setFreelancers(response.data.freelancers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching pending freelancers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (freelancerId) => {
    try {
      const response = await adminAPI.getFreelancerDetails(freelancerId);
      setSelectedFreelancer(response.data.freelancer);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching freelancer details:", error);
    }
  };

  const handleActionClick = (freelancer, action) => {
    setSelectedFreelancer(freelancer);
    setActionType(action);
    setActionNotes("");
    setShowActionModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedFreelancer || !actionType) return;

    try {
      setUpdating((prev) => ({ ...prev, [selectedFreelancer.id]: true }));

      if (actionType === "approve") {
        await adminAPI.approveFreelancer(selectedFreelancer.id, actionNotes);
      } else {
        await adminAPI.rejectFreelancer(selectedFreelancer.id, actionNotes);
      }

      // Remove freelancer from list if approved/rejected
      setFreelancers((prev) =>
        prev.filter((f) => f.id !== selectedFreelancer.id)
      );

      setShowActionModal(false);
      setSelectedFreelancer(null);
      setActionType("");
      setActionNotes("");
    } catch (error) {
      console.error(`Error ${actionType}ing freelancer:`, error);
    } finally {
      setUpdating((prev) => ({ ...prev, [selectedFreelancer.id]: false }));
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const DocumentViewer = ({ url, title }) => {
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (!url) {
      return (
        <div className="border rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">{title}</h4>
          <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
            <DocumentIcon className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">No document</span>
          </div>
        </div>
      );
    }

    // Create full URL for document
    const fullDocumentUrl = url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${url}`;

    const handleImageError = () => {
      setImageError(true);
      setLoading(false);
    };

    const handleImageLoad = () => {
      setLoading(false);
      setImageError(false);
    };

    return (
      <div className="border rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">{title}</h4>
        <div className="relative w-full h-32">
          {loading && (
            <div className="absolute inset-0 bg-gray-100 rounded border flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">Loading...</span>
            </div>
          )}

          {!imageError ? (
            <img
              src={fullDocumentUrl}
              alt={title}
              className="w-full h-32 object-cover rounded border"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: loading ? "none" : "block" }}
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
              <DocumentIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Document</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <a
            href={fullDocumentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View Full Size
          </a>
          {imageError && (
            <span className="text-xs text-red-500">Image not available</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Pending Freelancer Applications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve freelancer applications with uploaded documents.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            <ClockIcon className="h-4 w-4 mr-1" />
            {pagination.total} Pending
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Applications
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pagination.total}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    With Documents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {freelancers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ready for Review
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      freelancers.filter(
                        (f) => f.agreement_accepted && f.terms_1099_accepted
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Freelancers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Pending Freelancers ({pagination.total})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Freelancer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, index) => (
                    <LoadingTableRow key={index} columns={6} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : freelancers.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending applications
              </h3>
              <p className="text-gray-500">
                All freelancer applications have been processed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Freelancer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {freelancers.map((freelancer) => (
                    <tr key={freelancer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {freelancer.first_name?.charAt(0)}
                                {freelancer.last_name?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {freelancer.first_name} {freelancer.last_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <EnvelopeIcon className="h-3 w-3 mr-1" />
                              {freelancer.email}
                            </div>
                            {freelancer.phone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <PhoneIcon className="h-3 w-3 mr-1" />
                                {freelancer.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {freelancer.city}, {freelancer.state}
                        </div>
                        <div className="text-sm text-gray-500">
                          {freelancer.zip_code}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {capitalizeFirst(freelancer.cleaning_frequency)}
                          </div>
                          {freelancer.cleaning_services && (
                            <div className="text-xs text-gray-500 mt-1">
                              {freelancer.cleaning_services
                                .slice(0, 2)
                                .join(", ")}
                              {freelancer.cleaning_services.length > 2 &&
                                " +more"}
                            </div>
                          )}
                          {freelancer.preferred_hours && (
                            <div className="text-xs text-gray-500">
                              {freelancer.preferred_hours}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {freelancer.id_front_url && (
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full"
                              title="ID Front"
                            ></div>
                          )}
                          {freelancer.id_back_url && (
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full"
                              title="ID Back"
                            ></div>
                          )}
                          {freelancer.ssn_front_url && (
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full"
                              title="SSN Front"
                            ></div>
                          )}
                          {freelancer.ssn_back_url && (
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full"
                              title="SSN Back"
                            ></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          4/4 Documents
                        </div>
                        {freelancer.agreement_accepted &&
                          freelancer.terms_1099_accepted && (
                            <div className="text-xs text-green-600 mt-1">
                              ✓ Agreements Signed
                            </div>
                          )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(freelancer.created_at)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-48">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(freelancer.id)}
                            className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          <Button
                            variant="success"
                            size="sm"
                            loading={updating[freelancer.id]}
                            onClick={() =>
                              handleActionClick(freelancer, "approve")
                            }
                            className="flex items-center"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            loading={updating[freelancer.id]}
                            onClick={() =>
                              handleActionClick(freelancer, "reject")
                            }
                            className="text-red-600 border-red-300 hover:bg-red-50 flex items-center"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-r-none"
                >
                  Previous
                </Button>

                {[...Array(pagination.pages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= pagination.page - 2 && page <= pagination.page + 2)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={
                          page === pagination.page ? "primary" : "outline"
                        }
                        onClick={() => handlePageChange(page)}
                        className="rounded-none"
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === pagination.page - 3 ||
                    page === pagination.page + 3
                  ) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="rounded-l-none"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Freelancer Details Modal */}
      {showDetailsModal && selectedFreelancer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Freelancer Application Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Name
                      </span>
                      <p className="text-sm text-gray-900">
                        {selectedFreelancer.first_name}{" "}
                        {selectedFreelancer.last_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Email
                      </span>
                      <p className="text-sm text-gray-900">
                        {selectedFreelancer.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Phone
                      </span>
                      <p className="text-sm text-gray-900">
                        {selectedFreelancer.phone}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Address
                      </span>
                      <p className="text-sm text-gray-900">
                        {selectedFreelancer.address}
                        <br />
                        {selectedFreelancer.city}, {selectedFreelancer.state}{" "}
                        {selectedFreelancer.zip_code}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Applied
                      </span>
                      <p className="text-sm text-gray-900">
                        {formatDateTime(selectedFreelancer.created_at)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Work Schedule
                      </span>
                      <p className="text-sm text-gray-900">
                        {capitalizeFirst(selectedFreelancer.cleaning_frequency)}
                      </p>
                    </div>
                    {selectedFreelancer.preferred_hours && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Preferred Hours
                        </span>
                        <p className="text-sm text-gray-900">
                          {selectedFreelancer.preferred_hours}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Cleaning Services
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedFreelancer.cleaning_services?.map(
                          (service, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {service}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    {selectedFreelancer.message && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Message
                        </span>
                        <p className="text-sm text-gray-900">
                          {selectedFreelancer.message}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Agreement Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Agreement Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Contractor Agreement
                      </span>
                      <span
                        className={`text-sm ${
                          selectedFreelancer.agreement_accepted
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedFreelancer.agreement_accepted
                          ? "✓ Accepted"
                          : "✗ Not Accepted"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">1099 Terms</span>
                      <span
                        className={`text-sm ${
                          selectedFreelancer.terms_1099_accepted
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedFreelancer.terms_1099_accepted
                          ? "✓ Accepted"
                          : "✗ Not Accepted"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Brings Own Supplies
                      </span>
                      <span
                        className={`text-sm ${
                          selectedFreelancer.brings_supplies
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedFreelancer.brings_supplies ? "✓ Yes" : "✗ No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Has Experience
                      </span>
                      <span
                        className={`text-sm ${
                          selectedFreelancer.has_experience
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedFreelancer.has_experience ? "✓ Yes" : "✗ No"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Uploaded Documents */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Uploaded Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <DocumentViewer
                        url={selectedFreelancer.id_front_url}
                        title="ID Front"
                      />
                      <DocumentViewer
                        url={selectedFreelancer.id_back_url}
                        title="ID Back"
                      />
                      <DocumentViewer
                        url={selectedFreelancer.ssn_front_url}
                        title="SSN Front"
                      />
                      <DocumentViewer
                        url={selectedFreelancer.ssn_back_url}
                        title="SSN Back"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleActionClick(selectedFreelancer, "reject");
                  }}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleActionClick(selectedFreelancer, "approve");
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedFreelancer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {actionType === "approve" ? "Approve" : "Reject"} Freelancer
                </h3>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to {actionType}{" "}
                {selectedFreelancer.first_name} {selectedFreelancer.last_name}'s
                freelancer application?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Add notes for ${actionType} decision...`}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowActionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAction}
                  loading={updating[selectedFreelancer.id]}
                  className={
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }
                >
                  {actionType === "approve" ? "Approve" : "Reject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingFreelancers;
