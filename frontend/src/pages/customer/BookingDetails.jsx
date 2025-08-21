import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    UserIcon,
    CreditCardIcon,
    CheckIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ModernPageLoader } from "../../components/ui/Loading";
import { bookingsAPI } from "../../lib/api";
import {
    formatDateTime,
    formatCurrency,
    getStatusColor,
    capitalizeFirst,
} from "../../lib/utils";

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    // Handle success messages from redirects
    useEffect(() => {
        if (location.state?.message) {
            toast.success(location.state.message);
            // Clear the state to prevent showing the message again on refresh
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const fetchBookingDetails = async () => {
        try {
            console.log(`Fetching booking details for ID: ${id}`);
            setLoading(true);
            const response = await bookingsAPI.getById(id);
            if (response.data.success) {
                console.log("Booking details fetched successfully:", response.data.data);
                setBooking(response.data.data);
            } else {
                toast.error("Failed to load booking details");
                navigate("/customer/bookings");
            }
        } catch (error) {
            console.error("Error fetching booking details:", error);
            toast.error("Failed to load booking details");
            navigate("/customer/bookings");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = () => {
        navigate(`/payment/${booking.id}`);
    };

    const handleSelectCleaner = () => {
        navigate("/customer/select-cleaner", {
            state: { booking }
        });
    };

    const handleCancelBooking = async () => {
        try {
            setCanceling(true);
            const response = await bookingsAPI.updateStatus(booking.id, "cancelled");
            if (response.data.success) {
                toast.success("Booking cancelled successfully");
                await fetchBookingDetails(); // Refresh booking data
                setShowCancelDialog(false);
            } else {
                toast.error("Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            toast.error("Failed to cancel booking");
        } finally {
            setCanceling(false);
        }
    };

    if (loading) {
        return <ModernPageLoader message="Loading booking details..." />;
    }

    if (!booking) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardContent className="text-center py-12">
                        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Booking Not Found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            The booking you're looking for could not be found.
                        </p>
                        <Button onClick={() => navigate("/customer/bookings")}>
                            Return to Bookings
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isPaid = booking.paymentStatus === "paid" || booking.payment_status === "paid";
    const isPending = booking.paymentStatus === "pending" || booking.payment_status === "pending";
    const hasAssignedCleaner = booking.cleaner || booking.assigned_cleaner;
    const canSelectCleaner = isPaid && !hasAssignedCleaner && (booking.status === "confirmed" || booking.status === "pending");
    const canCancel = (booking.status === "pending" || booking.status === "confirmed") && !hasAssignedCleaner;
    const canPay = isPending && (booking.status === "pending" || booking.status === "confirmed");
    const isCompleted = booking.status === "completed";
    const isCancelled = booking.status === "cancelled";
    const isInProgress = booking.status === "in_progress";

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                            <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Booking Details
                            </h4>
                            <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                                Booking #{booking.id}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${getStatusColor(
                                    booking.status
                                )}`}
                            >
                                {capitalizeFirst(booking.status)}
                            </span>
                            <span
                                className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${isPaid
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    }`}
                            >
                                {isPaid ? "PAID" : "PENDING PAYMENT"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {(canPay || canSelectCleaner || canCancel) && !isCompleted && !isCancelled && (
                    <Card className="border-l-4 border-l-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                <div className="flex-1">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 flex items-center">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-2" />
                                        Action Required
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {canPay && "Complete your payment to proceed with the booking."}
                                        {canSelectCleaner && "Your payment is complete. Select a cleaner to start your service."}
                                        {canCancel && !canPay && !canSelectCleaner && "You can cancel this booking if needed."}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 sm:ml-6">
                                    {canPay && (
                                        <Button onClick={handlePayment} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm">
                                            <CreditCardIcon className="h-4 w-4 mr-2" />
                                            Complete Payment
                                        </Button>
                                    )}
                                    {canSelectCleaner && (
                                        <Button onClick={handleSelectCleaner} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm">
                                            <UserIcon className="h-4 w-4 mr-2" />
                                            Select Cleaner
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Status Information for Completed/Cancelled Bookings */}
                {(isCompleted || isCancelled) && (
                    <Card className={`border-l-4 shadow-lg ${isCompleted ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-l-red-500 bg-gradient-to-r from-red-50 to-pink-50'}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 shadow-md ${isCompleted ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {isCompleted ? (
                                        <CheckIcon className="h-7 w-7 text-green-600" />
                                    ) : (
                                        <XMarkIcon className="h-7 w-7 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-semibold mb-2 ${isCompleted ? 'text-green-900' : 'text-red-900'
                                        }`}>
                                        {isCompleted ? 'Booking Completed' : 'Booking Cancelled'}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {isCompleted && 'Your cleaning service has been completed successfully.'}
                                        {isCancelled && 'This booking has been cancelled.'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* In Progress Status */}
                {isInProgress && (
                    <Card className="border-l-4 border-l-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 shadow-md">
                                    <ClockIcon className="h-7 w-7 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                                        Service In Progress
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Your cleaner is currently working on your service.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Information */}
                        <Card className="shadow-lg border border-gray-100 bg-white">
                            <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                                <CardTitle className="text-lg sm:text-xl text-gray-900 flex items-center">
                                    <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
                                    Service Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                        {booking.service?.name || booking.serviceName || "Cleaning Service"}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {booking.service?.description || "Professional cleaning service"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                        <CalendarIcon className="h-5 w-5 mr-3 flex-shrink-0 text-blue-600" />
                                        <span className="truncate font-medium">
                                            {formatDateTime(booking.bookingDate || booking.booking_date || booking.scheduledDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                                        <ClockIcon className="h-5 w-5 mr-3 flex-shrink-0 text-green-600" />
                                        <span className="font-medium">
                                            Duration: {booking.durationHours || booking.duration_hours || 2} hours
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start text-sm text-gray-600 bg-purple-50 p-4 rounded-lg">
                                    <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-purple-600" />
                                    <div className="min-w-0 flex-1">
                                        <p className="break-words font-medium">{booking.address}</p>
                                        {(booking.city || booking.state || booking.zipCode) && (
                                            <p className="break-words text-gray-500">{booking.city}, {booking.state} {booking.zipCode || booking.zip_code}</p>
                                        )}
                                    </div>
                                </div>

                                {(booking.specialInstructions || booking.special_instructions) && (
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Special Instructions</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg break-words">
                                            {booking.specialInstructions || booking.special_instructions}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Assigned Cleaner */}
                        {hasAssignedCleaner && (
                            <Card className="shadow-lg border border-gray-100 bg-white">
                                <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                                    <CardTitle className="text-lg sm:text-xl text-gray-900 flex items-center">
                                        <UserIcon className="h-6 w-6 text-indigo-600 mr-3" />
                                        Assigned Cleaner
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-md">
                                            <UserIcon className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                                                {booking.cleaner?.firstName || booking.cleaner_first_name} {booking.cleaner?.lastName || booking.cleaner_last_name}
                                            </h4>
                                            <p className="text-sm text-gray-600 truncate">
                                                {booking.cleaner?.email || booking.cleaner_email}
                                            </p>
                                            {(() => {
                                                const rating = booking.cleaner?.rating || booking.cleaner_rating;
                                                const numericRating = parseFloat(rating);
                                                return !isNaN(numericRating) && numericRating > 0 ? (
                                                    <div className="flex items-center mt-2 bg-yellow-50 px-2 py-1 rounded-md">
                                                        <span className="text-yellow-500 text-lg">★</span>
                                                        <span className="text-sm text-gray-700 ml-1 font-medium">
                                                            {numericRating.toFixed(1)} Rating
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Payment Summary */}
                        <Card className="shadow-lg border border-gray-100 bg-white">
                            <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                                <span className="text-sm font-bold text-gray-900 flex items-center">
                                    <CreditCardIcon className="h-6 w-6 text-green-600 mr-3" />
                                    Payment Summary
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600 font-medium">Service Cost:</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(booking.totalAmount || booking.total_amount || 0)}
                                    </span>
                                </div>

                                {booking.appliedOffer && (
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg text-green-700">
                                        <span className="text-sm font-medium">Discount Applied:</span>
                                        <span className="text-sm font-semibold">
                                            -{formatCurrency(booking.appliedOffer.discount_amount || 0)}
                                        </span>
                                    </div>
                                )}

                                <hr className="my-4 border-gray-200" />

                                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                    <span className="text-base font-semibold text-gray-900">Total:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {formatCurrency(booking.totalAmount || booking.total_amount || 0)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-center mt-4">
                                    {isPaid ? (
                                        <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
                                            <CheckIcon className="h-5 w-5 mr-2" />
                                            <span className="text-sm font-semibold">Payment Completed</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full">
                                            <ClockIcon className="h-5 w-5 mr-2" />
                                            <span className="text-sm font-semibold">Payment Pending</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="shadow-lg border border-gray-100 bg-white">
                            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                                <span className="text-sm sm:text-md font-bold text-gray-900 flex items-center">
                                    <UserIcon className="h-6 w-6 text-purple-600 mr-3" />
                                    Quick Actions
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {isCompleted && !booking.review && (
                                    <Button
                                        variant="outline"
                                        className="w-full text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl py-3"
                                    >
                                        Leave Review
                                    </Button>
                                )}

                                <Link to="/customer/bookings" className="block">
                                    <Button
                                        variant="outline"
                                        className="w-full text-sm bg-gradient-to-r from-green-500 to-teal-600 text-white border-none hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl py-3 font-medium"
                                    >
                                        📋 View All Bookings
                                    </Button>
                                </Link>

                                {canCancel && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowCancelDialog(true)}
                                            className="w-full text-sm bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-none transition-all duration-200 shadow-lg hover:shadow-xl py-3 font-medium"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            Cancel Booking
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Cancel Booking Dialog */}
                {showCancelDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Cancel Booking
                                </h3>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-700">
                                    Are you sure you want to cancel this booking? This action cannot be undone.
                                    {isPaid && " Your payment will be refunded according to our cancellation policy."}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCancelDialog(false)}
                                    className="flex-1 text-sm border-gray-300 hover:bg-gray-50"
                                    disabled={canceling}
                                >
                                    Keep Booking
                                </Button>
                                <Button
                                    onClick={handleCancelBooking}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm shadow-lg"
                                    disabled={canceling}
                                >
                                    {canceling ? "Cancelling..." : "Cancel Booking"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetails;
