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
      console.log("Fetching pending freelancers...");

      const response = await adminAPI.getPendingFreelancers({
        page: pagination.page,
        limit: pagination.limit,
      });

      console.log("Pending freelancers response:", response.data);
      console.log("Number of freelancers:", response.data.freelancers?.length);

      // Debug document URLs
      response.data.freelancers?.forEach((freelancer, index) => {
        console.log(
          `Freelancer ${index + 1} (${freelancer.first_name} ${
            freelancer.last_name
          }) documents:`,
          {
            id_front_url: freelancer.id_front_url,
            id_back_url: freelancer.id_back_url,
            ssn_front_url: freelancer.ssn_front_url,
            ssn_back_url: freelancer.ssn_back_url,
          }
        );
      });

      setFreelancers(response.data.freelancers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching pending freelancers:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Set empty array as fallback
      setFreelancers([]);
      setPagination({
        page: 1,
        pages: 1,
        total: 0,
        limit: 20,
      });
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
    const [debugInfo, setDebugInfo] = useState("");
    const [fullDocumentUrl, setFullDocumentUrl] = useState("");

    // Debug logging and URL construction in useEffect to avoid infinite renders
    useEffect(() => {
      console.log(`DocumentViewer - ${title}:`, { url, title });

      if (!url) {
        setDebugInfo("No URL provided");
        return;
      }

      // Create full URL for document with better URL handling
      let constructedUrl;
      try {
        if (url.startsWith("http")) {
          constructedUrl = url;
        } else if (url.startsWith("/")) {
          constructedUrl = `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }${url}`;
        } else {
          constructedUrl = `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/uploads/documents/${url}`;
        }

        setFullDocumentUrl(constructedUrl);
        setDebugInfo(`URL: ${constructedUrl}`);
        console.log(`${title} full URL:`, constructedUrl);
      } catch (error) {
        console.error(`Error constructing URL for ${title}:`, error);
        setFullDocumentUrl(url);
        setDebugInfo(`Error constructing URL: ${error.message}`);
      }
    }, [url, title]);

    if (!url) {
      return (
        <div className="border rounded-lg p-2 xs:p-3 bg-gray-50">
          <h4 className="text-xs xs:text-sm font-medium text-gray-900 mb-2 truncate">
            {title}
          </h4>
          <div className="w-full h-24 xs:h-28 sm:h-32 bg-gray-100 rounded border flex flex-col items-center justify-center">
            <DocumentIcon className="h-6 w-6 xs:h-8 xs:w-8 text-gray-400" />
            <span className="ml-2 text-xs xs:text-sm text-gray-500 text-center mt-1">
              No document uploaded
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-orange-500">Status: Missing</span>
          </div>
        </div>
      );
    }

    const handleImageError = (e) => {
      console.error(`Image load error for ${title}:`, {
        src: e.target?.src,
        error: e,
        url: fullDocumentUrl,
      });
      setImageError(true);
      setLoading(false);
      
      // Try to fetch the URL to get more specific error information
      if (fullDocumentUrl) {
        fetch(fullDocumentUrl)
          .then(response => {
            if (!response.ok) {
              return response.json().then(errorData => {
                setDebugInfo(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
              }).catch(() => {
                setDebugInfo(`HTTP ${response.status}: ${response.statusText}`);
              });
            }
          })
          .catch(error => {
            setDebugInfo(`Network error: ${error.message}`);
          });
      } else {
        setDebugInfo(`Failed to load: No URL available`);
      }
    };

    const handleImageLoad = () => {
      console.log(`Image loaded successfully for ${title}:`, fullDocumentUrl);
      setLoading(false);
      setImageError(false);
      setDebugInfo(`Loaded successfully`);
    };

    return (
      <div className="border rounded-lg p-2 xs:p-3 bg-white">
        <h4 className="text-xs xs:text-sm font-medium text-gray-900 mb-2 truncate">
          {title}
        </h4>
        <div className="relative w-full h-24 xs:h-28 sm:h-32">
          {loading && (
            <div className="absolute inset-0 bg-gray-100 rounded border flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 xs:h-6 xs:w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-xs xs:text-sm text-gray-500 hidden xs:inline mt-1">
                Loading document...
              </span>
            </div>
          )}

          {!imageError ? (
            <img
              src={fullDocumentUrl}
              alt={title}
              className="w-full h-24 xs:h-28 sm:h-32 object-cover rounded border"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: loading ? "none" : "block" }}
            />
          ) : (
            <div className="w-full h-24 xs:h-28 sm:h-32 bg-red-50 rounded border border-red-200 flex flex-col items-center justify-center">
              <DocumentIcon className="h-6 w-6 xs:h-8 xs:w-8 text-red-400" />
              <span className="ml-2 text-xs text-red-600 text-center mt-1">
                Failed to load
              </span>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <a
              href={fullDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs xs:text-sm text-blue-600 hover:text-blue-500 hover:underline"
            >
              <EyeIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
              <span className="hidden xs:inline">View Full Size</span>
              <span className="xs:hidden">View</span>
            </a>
            {imageError && (
              <span className="text-xs text-red-500 font-medium">
                ⚠ Load Error
              </span>
            )}
            {!imageError && !loading && (
              <span className="text-xs text-green-500 font-medium">
                ✓ Available
              </span>
            )}
          </div>

          {/* Enhanced debug info for development and error cases */}
          {(import.meta.env.MODE === "development" || imageError) && (
            <div className="text-xs break-all">
              {imageError ? (
                <div className="text-red-600 bg-red-50 p-1 rounded">
                  <div className="font-medium">Error Details:</div>
                  <div>{debugInfo}</div>
                  {fullDocumentUrl && (
                    <div className="mt-1">
                      <div className="font-medium">URL:</div>
                      <div className="break-all">{fullDocumentUrl}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">{debugInfo}</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 xs:space-y-6 px-2 xs:px-4 py-2 xs:py-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 xs:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-gray-900 break-words">
            Pending Freelancer Applications
          </h2>
          <p className="mt-1 text-xs xs:text-sm text-gray-500 leading-tight">
            Review and approve freelancer applications with uploaded documents.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            <ClockIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
            {pagination.total} Pending
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
        <Card>
          <CardContent className="p-3 xs:p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 xs:h-8 xs:w-8 text-yellow-400" />
              </div>
              <div className="ml-3 xs:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs xs:text-sm font-medium text-gray-500 truncate">
                    Pending Applications
                  </dt>
                  <dd className="text-sm xs:text-base sm:text-lg font-medium text-gray-900">
                    {pagination.total}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 xs:p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentIcon className="h-6 w-6 xs:h-8 xs:w-8 text-blue-400" />
              </div>
              <div className="ml-3 xs:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs xs:text-sm font-medium text-gray-500 truncate">
                    With Documents
                  </dt>
                  <dd className="text-sm xs:text-base sm:text-lg font-medium text-gray-900">
                    {freelancers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="xs:col-span-2 sm:col-span-1">
          <CardContent className="p-3 xs:p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 xs:h-8 xs:w-8 text-green-400" />
              </div>
              <div className="ml-3 xs:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs xs:text-sm font-medium text-gray-500 truncate">
                    Ready for Review
                  </dt>
                  <dd className="text-sm xs:text-base sm:text-lg font-medium text-gray-900">
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

      {/* Freelancers Table/Cards */}
      <Card>
        <CardHeader className="p-3 xs:p-4 sm:p-6">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center text-sm xs:text-base sm:text-lg">
              <UserIcon className="h-4 w-4 xs:h-5 xs:w-5 mr-2" />
              <span className="hidden xs:inline">
                Pending Freelancers ({pagination.total})
              </span>
              <span className="xs:hidden">Pending ({pagination.total})</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="overflow-hidden">
              {/* Desktop table loading */}
              <div className="hidden lg:block">
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

              {/* Mobile card loading */}
              <div className="lg:hidden space-y-4 p-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : freelancers.length === 0 ? (
            <div className="text-center py-8 xs:py-12 px-4">
              <UserIcon className="h-10 w-10 xs:h-12 xs:w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-900 mb-2">
                No pending applications
              </h3>
              <p className="text-xs xs:text-sm text-gray-500">
                All freelancer applications have been processed.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
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
                          <div className="flex flex-col space-y-2">
                            {/* Document Status Indicators */}
                            <div className="flex items-center space-x-1">
                              {freelancer.id_front_url ? (
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                    title="ID Front - Available"
                                  ></div>
                                  <span className="text-xs text-green-600 ml-1">
                                    ID
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 bg-red-400 rounded-full"
                                    title="ID Front - Missing"
                                  ></div>
                                  <span className="text-xs text-red-600 ml-1">
                                    ID
                                  </span>
                                </div>
                              )}

                              {freelancer.id_back_url ? (
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                    title="ID Back - Available"
                                  ></div>
                                  <span className="text-xs text-green-600 ml-1">
                                    Back
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 bg-red-400 rounded-full"
                                    title="ID Back - Missing"
                                  ></div>
                                  <span className="text-xs text-red-600 ml-1">
                                    Back
                                  </span>
                                </div>
                              )}

                              {freelancer.ssn_front_url ? (
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                    title="SSN Front - Available"
                                  ></div>
                                  <span className="text-xs text-green-600 ml-1">
                                    SSN
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 bg-red-400 rounded-full"
                                    title="SSN Front - Missing"
                                  ></div>
                                  <span className="text-xs text-red-600 ml-1">
                                    SSN
                                  </span>
                                </div>
                              )}

                              {freelancer.ssn_back_url && (
                                <div className="flex items-center">
                                  <div
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                    title="SSN Back - Available"
                                  ></div>
                                  <span className="text-xs text-green-600 ml-1">
                                    SSN2
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Document Count Summary */}
                            <div className="text-xs text-gray-500">
                              {
                                [
                                  freelancer.id_front_url,
                                  freelancer.id_back_url,
                                  freelancer.ssn_front_url,
                                  freelancer.ssn_back_url,
                                ].filter(Boolean).length
                              }{" "}
                              / 4 docs
                            </div>
                          </div>
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

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3 xs:space-y-4 p-3 xs:p-4">
                {freelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 xs:p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="flex-shrink-0 h-8 w-8 xs:h-10 xs:w-10">
                          <div className="h-8 w-8 xs:h-10 xs:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs xs:text-sm font-medium text-blue-600">
                              {freelancer.first_name?.charAt(0)}
                              {freelancer.last_name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <div className="text-sm xs:text-base font-medium text-gray-900 truncate">
                            {freelancer.first_name} {freelancer.last_name}
                          </div>
                          <div className="text-xs xs:text-sm text-gray-500 truncate">
                            {freelancer.email}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {freelancer.agreement_accepted &&
                        freelancer.terms_1099_accepted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2 flex-shrink-0">
                            ✓ Ready
                          </span>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Location
                        </div>
                        <div className="text-xs xs:text-sm text-gray-900 flex items-center">
                          <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {freelancer.city}, {freelancer.state}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Applied
                        </div>
                        <div className="text-xs xs:text-sm text-gray-900">
                          {formatDateTime(freelancer.created_at)}
                        </div>
                      </div>

                      <div className="xs:col-span-2">
                        <div className="text-xs text-gray-500 mb-1">
                          Services
                        </div>
                        <div className="text-xs xs:text-sm text-gray-900">
                          {capitalizeFirst(freelancer.cleaning_frequency)}
                          {freelancer.cleaning_services &&
                            freelancer.cleaning_services.length > 0 && (
                              <span className="text-gray-500 ml-1">
                                •{" "}
                                {freelancer.cleaning_services
                                  .slice(0, 2)
                                  .join(", ")}
                                {freelancer.cleaning_services.length > 2 &&
                                  " +more"}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Documents Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-gray-500">Documents</div>
                      <div className="flex items-center space-x-1">
                        {[
                          freelancer.id_front_url,
                          freelancer.id_back_url,
                          freelancer.ssn_front_url,
                          freelancer.ssn_back_url,
                        ].map((url, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              url ? "bg-green-400" : "bg-gray-300"
                            }`}
                            title={
                              ["ID Front", "ID Back", "SSN Front", "SSN Back"][
                                index
                              ]
                            }
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">4/4</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(freelancer.id)}
                        className="flex-1 xs:flex-none flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs xs:text-sm"
                      >
                        <EyeIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                        View Details
                      </Button>

                      <div className="flex gap-2 xs:gap-3">
                        <Button
                          variant="success"
                          size="sm"
                          loading={updating[freelancer.id]}
                          onClick={() =>
                            handleActionClick(freelancer, "approve")
                          }
                          className="flex-1 xs:flex-none flex items-center justify-center text-xs xs:text-sm"
                        >
                          <CheckCircleIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          loading={updating[freelancer.id]}
                          onClick={() =>
                            handleActionClick(freelancer, "reject")
                          }
                          className="flex-1 xs:flex-none text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center text-xs xs:text-sm"
                        >
                          <XCircleIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between px-2 xs:px-0">
          {/* Mobile pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="text-xs xs:text-sm"
            >
              Previous
            </Button>
            <span className="flex items-center text-xs xs:text-sm text-gray-700">
              {pagination.page} / {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="text-xs xs:text-sm"
            >
              Next
            </Button>
          </div>

          {/* Desktop pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs xs:text-sm text-gray-700">
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
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-r-none text-xs xs:text-sm"
                >
                  Previous
                </Button>

                {[...Array(pagination.pages)].map((_, index) => {
                  const page = index + 1;
                  const isVisible =
                    window.innerWidth >= 768
                      ? page === 1 ||
                        page === pagination.pages ||
                        (page >= pagination.page - 2 &&
                          page <= pagination.page + 2)
                      : page === 1 ||
                        page === pagination.pages ||
                        (page >= pagination.page - 1 &&
                          page <= pagination.page + 1);

                  if (isVisible) {
                    return (
                      <Button
                        key={page}
                        variant={
                          page === pagination.page ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="rounded-none text-xs xs:text-sm"
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
                        className="relative inline-flex items-center px-2 xs:px-4 py-1 xs:py-2 border border-gray-300 bg-white text-xs xs:text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="rounded-l-none text-xs xs:text-sm"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-2 xs:p-4">
          <div className="relative top-4 xs:top-8 sm:top-20 mx-auto border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="p-3 xs:p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-900">
                  Freelancer Application Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XCircleIcon className="h-5 w-5 xs:h-6 xs:w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm xs:text-base">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div>
                      <span className="text-xs xs:text-sm font-medium text-gray-500">
                        Name
                      </span>
                      <p className="text-xs xs:text-sm text-gray-900">
                        {selectedFreelancer.first_name}{" "}
                        {selectedFreelancer.last_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs xs:text-sm font-medium text-gray-500">
                        Email
                      </span>
                      <p className="text-xs xs:text-sm text-gray-900 break-all">
                        {selectedFreelancer.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs xs:text-sm font-medium text-gray-500">
                        Phone
                      </span>
                      <p className="text-xs xs:text-sm text-gray-900">
                        {selectedFreelancer.phone}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs xs:text-sm font-medium text-gray-500">
                        Address
                      </span>
                      <p className="text-xs xs:text-sm text-gray-900">
                        {selectedFreelancer.address}
                        <br />
                        {selectedFreelancer.city}, {selectedFreelancer.state}{" "}
                        {selectedFreelancer.zip_code}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs xs:text-sm font-medium text-gray-500">
                        Applied
                      </span>
                      <p className="text-xs xs:text-sm text-gray-900">
                        {formatDateTime(selectedFreelancer.created_at)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm xs:text-base">
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div>
                      <span className="text-xs xs:text-sm font-medium text-gray-500">
                        Work Schedule
                      </span>
                      <p className="text-xs xs:text-sm text-gray-900">
                        {capitalizeFirst(selectedFreelancer.cleaning_frequency)}
                      </p>
                    </div>
                    {selectedFreelancer.preferred_hours && (
                      <div>
                        <span className="text-xs xs:text-sm font-medium text-gray-500">
                          Preferred Hours
                        </span>
                        <p className="text-xs xs:text-sm text-gray-900">
                          {selectedFreelancer.preferred_hours}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs xs:text-sm font-medium text-gray-500">
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
                        <span className="text-xs xs:text-sm font-medium text-gray-500">
                          Message
                        </span>
                        <p className="text-xs xs:text-sm text-gray-900">
                          {selectedFreelancer.message}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Agreement Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm xs:text-base">
                      Agreement Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs xs:text-sm text-gray-500">
                        Contractor Agreement
                      </span>
                      <span
                        className={`text-xs xs:text-sm ${
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
                      <span className="text-xs xs:text-sm text-gray-500">
                        1099 Terms
                      </span>
                      <span
                        className={`text-xs xs:text-sm ${
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
                      <span className="text-xs xs:text-sm text-gray-500">
                        Brings Own Supplies
                      </span>
                      <span
                        className={`text-xs xs:text-sm ${
                          selectedFreelancer.brings_supplies
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedFreelancer.brings_supplies ? "✓ Yes" : "✗ No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs xs:text-sm text-gray-500">
                        Has Experience
                      </span>
                      <span
                        className={`text-xs xs:text-sm ${
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
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm xs:text-base">
                      Uploaded Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
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
              <div className="flex flex-col xs:flex-row justify-end gap-2 xs:gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="xs:order-1 text-xs xs:text-sm"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleActionClick(selectedFreelancer, "reject");
                  }}
                  className="xs:order-2 text-red-600 border-red-300 hover:bg-red-50 text-xs xs:text-sm"
                >
                  <XCircleIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleActionClick(selectedFreelancer, "approve");
                  }}
                  className="xs:order-3 bg-green-600 hover:bg-green-700 text-white text-xs xs:text-sm"
                >
                  <CheckCircleIcon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedFreelancer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-20 mx-auto border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="p-4 xs:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-900">
                  {actionType === "approve" ? "Approve" : "Reject"} Freelancer
                </h3>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XCircleIcon className="h-5 w-5 xs:h-6 xs:w-6" />
                </button>
              </div>

              <p className="text-xs xs:text-sm text-gray-500 mb-4">
                Are you sure you want to {actionType}{" "}
                {selectedFreelancer.first_name} {selectedFreelancer.last_name}'s
                freelancer application?
              </p>

              <div className="mb-4">
                <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs xs:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Add notes for ${actionType} decision...`}
                />
              </div>

              <div className="flex flex-col xs:flex-row justify-end gap-2 xs:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowActionModal(false)}
                  className="xs:order-1 text-xs xs:text-sm"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmAction}
                  loading={updating[selectedFreelancer.id]}
                  className={`xs:order-2 text-xs xs:text-sm ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
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
