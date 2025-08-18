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
    const [userLocation, setUserLocation] = useState(null);
    const [booking, setBooking] = useState(null);

    // Get booking data from state or navigate to bookings if missing
    useEffect(() => {
        const bookingData = location.state?.booking;
        // if (!bookingData) {
        //     toast.error("Booking information not found");
        //     navigate("/customer/bookings");
        //     return;
        // }
        setBooking(bookingData);
    }, [location, navigate]);

    // Get current location or use postal code from booking
    useEffect(() => {
        if (!booking) return;

        const getLocation = async () => {
            try {
                // First try to get user's current location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const coords = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
                            setUserLocation(coords);
                            await fetchNearbyCleaners(coords);
                        },
                        async (error) => {
                            console.log("Geolocation error:", error);
                            // Fallback to postal code if available
                            if (booking.zipCode || booking.zip_code) {
                                await fetchNearbyCleaners(null, booking.zipCode || booking.zip_code);
                            } else {
                                toast.error("Location access denied. Please enable location services or add postal code to your booking.");
                                setLoading(false);
                            }
                        }
                    );
                } else {
                    // Geolocation not supported, use postal code
                    if (booking.zipCode || booking.zip_code) {
                        await fetchNearbyCleaners(null, booking.zipCode || booking.zip_code);
                    } else {
                        toast.error("Geolocation not supported and no postal code available.");
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Error getting location:", error);
                setLoading(false);
            }
        };

        getLocation();
    }, [booking]);

    const fetchNearbyCleaners = async (coords = null, zipCode = null) => {
        try {
            console.log("Fetching nearby cleaners with coords:", coords, "zipCode:", zipCode);
            setLoading(true);
            let url = "?radius=15";

            if (coords) {
                url += `&latitude=${coords.latitude}&longitude=${coords.longitude}`;
            } else if (zipCode) {
                url += `&zipCode=${zipCode}`;
            } else {
                throw new Error("No location data available");
            }


            console.log("url for fetching cleaners:", url);

            const response = await userAPI.getNearbyCleaners(url);
            const cleanersData = response.data.cleaners || response.data.data || [];
            setCleaners(cleanersData);

            if (cleanersData.length === 0) {
                toast.success("No cleaners available in your area at the moment. Try expanding your search radius.");
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
        return <LoadingPage message="Finding available cleaners in your area..." />;
    }

    if (!booking) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Select Your Cleaner
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Choose from available cleaners in your area for booking #{booking.id}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="font-semibold">{booking.service_name || booking.service?.name}</p>
                        <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(booking.total_amount || booking.totalAmount)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Selected Cleaner Card */}
            {selectedCleaner && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center text-blue-800">
                            <CheckIcon className="h-5 w-5 mr-2" />
                            Selected Cleaner
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <UserIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-blue-900">
                                        {selectedCleaner.firstName} {selectedCleaner.lastName}
                                    </h3>
                                    <div className="flex items-center text-sm text-blue-700">
                                        <StarIcon className="h-4 w-4 mr-1" />
                                        {selectedCleaner.rating} ({selectedCleaner.totalJobs} jobs)
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedCleaner(null)}
                                >
                                    Change Selection
                                </Button>
                                <Button
                                    onClick={handleRequestCleaner}
                                    disabled={requesting}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {requesting ? "Sending Request..." : "Request This Cleaner"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Available Cleaners */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cleaners.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Cleaners Available
                        </h3>
                        <p className="text-gray-500 mb-4">
                            There are no cleaners available in your area right now.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => fetchNearbyCleaners(userLocation, booking.zipCode || booking.zip_code)}
                        >
                            Refresh Search
                        </Button>
                    </div>
                ) : (
                    cleaners.map((cleaner) => (
                        <Card
                            key={cleaner.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${selectedCleaner?.id === cleaner.id
                                ? "ring-2 ring-blue-500 bg-blue-50"
                                : "hover:shadow-md"
                                }`}
                            onClick={() => handleSelectCleaner(cleaner)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        {cleaner.profileImage ? (
                                            <img
                                                src={cleaner.profileImage}
                                                alt={`${cleaner.firstName} ${cleaner.lastName}`}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="h-6 w-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {cleaner.firstName} {cleaner.lastName}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                                            <span className="font-medium">{cleaner.rating}</span>
                                            <span className="mx-1">•</span>
                                            <span>{cleaner.totalJobs} jobs</span>
                                        </div>
                                    </div>
                                    {cleaner.isOnline && (
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <MapPinIcon className="h-4 w-4 mr-2" />
                                        <span>{cleaner.distanceKm} km away</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-2" />
                                        <span>{cleaner.experienceYears} years experience</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">
                                            {formatCurrency(cleaner.hourlyRate)}/hour
                                        </span>
                                    </div>
                                </div>

                                {cleaner.bio && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {cleaner.bio}
                                    </p>
                                )}

                                {cleaner.certifications && cleaner.certifications.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {cleaner.certifications.slice(0, 2).map((cert, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                            >
                                                {cert}
                                            </span>
                                        ))}
                                        {cleaner.certifications.length > 2 && (
                                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                                +{cleaner.certifications.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    {selectedCleaner?.id === cleaner.id ? (
                                        <span className="flex items-center text-blue-600 font-medium">
                                            <CheckIcon className="h-4 w-4 mr-1" />
                                            Selected
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">Click to select</span>
                                    )}

                                    {cleaner.isOnline ? (
                                        <span className="text-green-600 text-sm font-medium">
                                            Online Now
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            Last seen {cleaner.minutesSinceLastUpdate} min ago
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border p-6">
                <Button
                    variant="outline"
                    onClick={() => navigate("/customer/bookings")}
                >
                    Back to My Bookings
                </Button>

                {cleaners.length > 0 && !selectedCleaner && (
                    <p className="text-gray-500">
                        Select a cleaner to continue
                    </p>
                )}
            </div>
        </div>
    );
};

export default CleanerSelection;
