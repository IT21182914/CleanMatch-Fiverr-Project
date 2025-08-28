import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { LoadingPage } from "../../components/ui/Loading";
import {
    MapPinIcon,
    StarIcon,
    ClockIcon,
    CheckIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { bookingsAPI, userAPI } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";
import { toast } from "react-hot-toast";

const CleanerSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cleaners, setCleaners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCleaner, setSelectedCleaner] = useState(null);
    const [requesting, setRequesting] = useState(false);
    const [booking, setBooking] = useState(null);
    const [searchRadius, setSearchRadius] = useState(20); // Default 20km radius

    // Get booking data from state or navigate to bookings if missing
    useEffect(() => {
        const bookingData = location.state?.booking;
        if (!bookingData) {
            toast.error("Booking information not found");
            navigate("/customer/bookings");
            return;
        }
        setBooking(bookingData);
    }, [location, navigate]);

    // Fetch cleaners when booking is loaded
    useEffect(() => {
        if (booking) {
            fetchNearbyCleaners();
        }
    }, [booking, searchRadius]);

    const fetchNearbyCleaners = async () => {
        try {
            console.log("Fetching nearby cleaners for booking:", booking.id);
            console.log(booking)
            setLoading(true);
            
            // Build query parameters
            const params = { radius: searchRadius };

            // Use booking location data - check for coordinates first, then fallback to zipCode
            if (booking.latitude && booking.longitude) {
                params.latitude = booking.latitude;
                params.longitude = booking.longitude;
                console.log("Using booking coordinates:", booking.latitude, booking.longitude);
            } else if (booking.zipCode || booking.zip_code) {
                params.zipCode = booking.zipCode || booking.zip_code;
                console.log("Using booking zipCode:", booking.zipCode || booking.zip_code);
            } else {
                throw new Error("No location data available in booking");
            }

            console.log("API params for fetching cleaners:", params);

            const response = await bookingsAPI.getNearbyCleaners(booking.id, params);
            console.log("API Response:", response);
            console.log("Response data structure:", response.data);
            
            const cleanersData = response.data.data?.cleaners || response.data.cleaners || [];
            console.log("Extracted cleaners data:", cleanersData);
            
            setCleaners(cleanersData);

            if (cleanersData.length === 0) {
                toast.success(`No cleaners available within ${searchRadius}km. Try expanding your search radius.`);
            }
        } catch (error) {
            console.error("Error fetching cleaners:", error);
            toast.error("Failed to load available cleaners");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCleaner = (cleaner) => {
        setSelectedCleaner(cleaner);
    };

    const handleRequestCleaner = async () => {
        if (!selectedCleaner || !booking) return;

        setRequesting(true);
        try {
            // Update the booking to assign the selected cleaner
            const response = await bookingsAPI.requestCleaner(booking.id, {
                cleanerId: selectedCleaner.id,
            });

            if (response.data.success) {
                toast.success(`Request sent to ${selectedCleaner.firstName} ${selectedCleaner.lastName}!`);
                navigate(`/customer/bookings/${booking.id}`, {
                    state: {
                        message: "Cleaner request sent successfully! Your booking is now being processed."
                    }
                });
            }
        } catch (error) {
            console.error("Error requesting cleaner:", error);
            toast.error("Failed to send request to cleaner");
        } finally {
            setRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Finding available cleaners</h3>
                    <p className="text-sm text-gray-500">Searching for professional cleaners in your area...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <span className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                                    Select Your Professional Cleaner
                                </span>
                                <p className="text-sm text-gray-600">
                                    Choose from available cleaners in your area for booking #{booking.id}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-xs text-emerald-600 font-medium">
                                        {cleaners.length} cleaners available within {searchRadius}km
                                    </span>
                                </div>
                                {/* Location Info */}
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPinIcon className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                        {booking.latitude && booking.longitude 
                                            ? `Using GPS coordinates (${parseFloat(booking.latitude).toFixed(4)}, ${parseFloat(booking.longitude).toFixed(4)})`
                                            : `Using postal code: ${booking.zipCode || booking.zip_code}`
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
                                <p className="text-xs text-gray-500 mb-1">Service</p>
                                <p className="text-sm font-semibold text-gray-900 mb-2">
                                    {booking.service_name || booking.service?.name}
                                </p>
                                <p className="text-lg font-bold text-emerald-600">
                                    {formatCurrency(booking.total_amount || booking.totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Selected Cleaner Card */}
                    {selectedCleaner && (
                        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-emerald-800 text-base">
                                    <CheckIcon className="h-5 w-5 mr-2" />
                                    Selected Cleaner
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-emerald-100">
                                                {selectedCleaner.profileImage ? (
                                                    <img
                                                        src={selectedCleaner.profileImage}
                                                        alt={`${selectedCleaner.firstName} ${selectedCleaner.lastName}`}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon className="h-6 w-6 text-emerald-600" />
                                                )}
                                            </div>
                                            {(selectedCleaner.isOnline || selectedCleaner.isAvailable) && (
                                                <div className={`absolute -top-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                                                    selectedCleaner.isOnline ? 'bg-green-400' : 'bg-blue-400'
                                                }`}></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-emerald-900 text-sm">
                                                {selectedCleaner.firstName} {selectedCleaner.lastName}
                                            </h3>
                                            <div className="flex items-center text-xs text-emerald-700 mt-1">
                                                <StarIcon className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                                                <span className="font-medium">{selectedCleaner.rating}</span>
                                                <span className="mx-1">•</span>
                                                <span>{selectedCleaner.totalJobs} jobs completed</span>
                                            </div>
                                            <p className="text-xs text-emerald-600 mt-1">
                                                {selectedCleaner.hasGPSLocation 
                                                    ? `${selectedCleaner.distanceKm} km away (GPS) • ${formatCurrency(selectedCleaner.hourlyRate)}/hour`
                                                    : `${selectedCleaner.distanceKm} km away • ${formatCurrency(selectedCleaner.hourlyRate)}/hour`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedCleaner(null)}
                                            className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                        >
                                            Change Selection
                                        </Button>
                                        <Button
                                            onClick={handleRequestCleaner}
                                            disabled={requesting}
                                            size="sm"
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md text-xs"
                                        >
                                            {requesting ? "Sending Request..." : "Request This Cleaner"}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Search Radius Selector */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Search Radius</h3>
                                <p className="text-xs text-gray-500">
                                    Expand your search to find more cleaners in your area
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {[10, 20, 50, 100].map((radius) => (
                                    <button
                                        key={radius}
                                        onClick={() => setSearchRadius(radius)}
                                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                                            searchRadius === radius
                                                ? "bg-emerald-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {radius}km
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Available Cleaners */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Available Cleaners</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchNearbyCleaners()}
                                className="text-xs"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            {cleaners.length === 0 ? (
                                <div className="col-span-full">
                                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MapPinIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-base font-medium text-gray-900 mb-2">
                                            No Cleaners Available
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                                            There are no cleaners available in your area right now. Try refreshing or expanding your search.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => fetchNearbyCleaners()}
                                            className="text-sm"
                                        >
                                            Refresh Search
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                cleaners.map((cleaner) => (
                                    <Card
                                        key={cleaner.id}
                                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${selectedCleaner?.id === cleaner.id
                                            ? "ring-2 ring-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg"
                                            : "hover:shadow-md bg-white border-gray-200"
                                            }`}
                                        onClick={() => handleSelectCleaner(cleaner)}
                                    >
                                        <CardContent className="p-4 lg:p-6">
                                            {/* Cleaner Header */}
                                            <div className="flex items-start space-x-3 mb-4">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                                        {cleaner.profileImage ? (
                                                            <img
                                                                src={cleaner.profileImage}
                                                                alt={`${cleaner.firstName} ${cleaner.lastName}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <UserIcon className="h-6 w-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                    {(cleaner.isOnline || cleaner.isAvailable) && (
                                                        <div className={`absolute -top-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                                                            cleaner.isOnline ? 'bg-green-400' : 'bg-blue-400'
                                                        }`}></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                        {cleaner.firstName} {cleaner.lastName}
                                                    </h3>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <StarIcon className="h-3 w-3 mr-1 text-yellow-400 flex-shrink-0 fill-current" />
                                                        <span className="font-medium">{cleaner.rating}</span>
                                                        <span className="mx-1">•</span>
                                                        <span className="truncate">{cleaner.totalJobs} jobs</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    {cleaner.isAvailable ? (
                                                        cleaner.isOnline ? (
                                                            <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                                                                Online Now
                                                            </span>
                                                        ) : (
                                                            <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded-full">
                                                                Available
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded-full">
                                                            {cleaner.minutesSinceLastUpdate > 60 
                                                                ? `${Math.floor(cleaner.minutesSinceLastUpdate / 60)}h ago`
                                                                : `${cleaner.minutesSinceLastUpdate}m ago`
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Cleaner Details */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                        <span>
                                                            {cleaner.hasGPSLocation 
                                                                ? `${cleaner.distanceKm} km away (GPS)`
                                                                : cleaner.zipCode 
                                                                    ? `${cleaner.distanceKm} km away (${cleaner.zipCode})`
                                                                    : `${cleaner.distanceKm} km away (estimated)`
                                                            }
                                                        </span>
                                                        {cleaner.distanceCategory === 'very_close' && (
                                                            <span className="ml-1 text-green-600 font-medium">• Very Close</span>
                                                        )}
                                                        {cleaner.distanceCategory === 'nearby' && (
                                                            <span className="ml-1 text-blue-600 font-medium">• Nearby</span>
                                                        )}
                                                    </div>
                                                    <span className="font-semibold text-emerald-600">
                                                        {formatCurrency(cleaner.hourlyRate)}/hr
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center text-gray-600">
                                                        <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                        <span>{cleaner.experienceYears} years experience</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {cleaner.isAvailable ? (
                                                            <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                                                                Available
                                                            </span>
                                                        ) : (
                                                            <span className="text-orange-600 text-xs font-medium bg-orange-50 px-2 py-1 rounded-full">
                                                                Busy
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bio */}
                                            {cleaner.bio && (
                                                <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                                    {cleaner.bio}
                                                </p>
                                            )}

                                            {/* Certifications */}
                                            {cleaner.certifications && cleaner.certifications.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {cleaner.certifications.slice(0, 2).map((cert, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium"
                                                        >
                                                            {cert}
                                                        </span>
                                                    ))}
                                                    {cleaner.certifications.length > 2 && (
                                                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                                            +{cleaner.certifications.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Selection Status */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                {selectedCleaner?.id === cleaner.id ? (
                                                    <span className="flex items-center text-emerald-600 font-medium text-xs">
                                                        <CheckIcon className="h-3 w-3 mr-1" />
                                                        Selected
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Click to select</span>
                                                )}
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">
                                                        Response time: <span className="font-medium">~2-5 min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/customer/bookings")}
                                className="text-sm order-2 sm:order-1"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to My Bookings
                            </Button>

                            {cleaners.length > 0 && !selectedCleaner && (
                                <div className="text-center order-1 sm:order-2">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Select a cleaner to continue
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Click on any cleaner card above to make your selection
                                    </p>
                                </div>
                            )}

                            {selectedCleaner && (
                                <div className="text-center order-1 sm:order-2">
                                    <p className="text-sm text-emerald-600 font-medium mb-1">
                                        ✓ Cleaner selected
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Ready to send request to {selectedCleaner.firstName}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CleanerSelection;
