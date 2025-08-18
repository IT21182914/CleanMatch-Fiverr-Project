import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    UserIcon,
    ArrowLeftIcon,
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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/customer/bookings")}
                        className="inline-flex items-center"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Bookings
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Booking Details
                        </h1>
                        <p className="text-sm text-gray-500">Booking #{booking.id}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            booking.status
                        )}`}
                    >
                        {capitalizeFirst(booking.status)}
                    </span>
                    <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                        {isPaid ? "PAID" : "PENDING PAYMENT"}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            {(canPay || canSelectCleaner || canCancel) && !isCompleted && !isCancelled && (
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    Action Required
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {canPay && "Complete your payment to proceed with the booking."}
                                    {canSelectCleaner && "Your payment is complete. Select a cleaner to start your service."}
                                    {canCancel && !canPay && !canSelectCleaner && "You can cancel this booking if needed."}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                {canPay && (
                                    <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700">
                                        <CreditCardIcon className="h-4 w-4 mr-2" />
                                        Complete Payment
                                    </Button>
                                )}
                                {canSelectCleaner && (
                                    <Button onClick={handleSelectCleaner} className="bg-blue-600 hover:bg-blue-700">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        Select Cleaner
                                    </Button>
                                )}
                                {canCancel && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCancelDialog(true)}
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        Cancel Booking
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Status Information for Completed/Cancelled Bookings */}
            {(isCompleted || isCancelled) && (
                <Card className={`border-l-4 ${isCompleted ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${isCompleted ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                {isCompleted ? (
                                    <CheckIcon className="h-6 w-6 text-green-600" />
                                ) : (
                                    <XMarkIcon className="h-6 w-6 text-red-600" />
                                )}
                            </div>
                            <div>
                                <h3 className={`text-lg font-medium mb-1 ${isCompleted ? 'text-green-900' : 'text-red-900'
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
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <ClockIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-blue-900 mb-1">
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {booking.service?.name || booking.serviceName || "Cleaning Service"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {booking.service?.description || "Professional cleaning service"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    <span>
                                        {formatDateTime(booking.bookingDate || booking.booking_date || booking.scheduledDate)}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <ClockIcon className="h-4 w-4 mr-2" />
                                    <span>
                                        Duration: {booking.durationHours || booking.duration_hours || 2} hours
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start text-sm text-gray-600">
                                <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p>{booking.address}</p>
                                    {(booking.city || booking.state || booking.zipCode) && (
                                        <p>{booking.city}, {booking.state} {booking.zipCode || booking.zip_code}</p>
                                    )}
                                </div>
                            </div>

                            {(booking.specialInstructions || booking.special_instructions) && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        {booking.specialInstructions || booking.special_instructions}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Assigned Cleaner */}
                    {hasAssignedCleaner && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Assigned Cleaner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <UserIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {booking.cleaner?.firstName || booking.cleaner_first_name} {booking.cleaner?.lastName || booking.cleaner_last_name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {booking.cleaner?.email || booking.cleaner_email}
                                        </p>
                                        {(() => {
                                            const rating = booking.cleaner?.rating || booking.cleaner_rating;
                                            const numericRating = parseFloat(rating);
                                            return !isNaN(numericRating) && numericRating > 0 ? (
                                                <div className="flex items-center mt-1">
                                                    <span className="text-yellow-400">★</span>
                                                    <span className="text-sm text-gray-600 ml-1">
                                                        {numericRating.toFixed(1)}
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Service Cost:</span>
                                <span className="text-sm font-medium">
                                    {formatCurrency(booking.totalAmount || booking.total_amount || 0)}
                                </span>
                            </div>

                            {booking.appliedOffer && (
                                <div className="flex justify-between text-green-600">
                                    <span className="text-sm">Discount Applied:</span>
                                    <span className="text-sm font-medium">
                                        -{formatCurrency(booking.appliedOffer.discount_amount || 0)}
                                    </span>
                                </div>
                            )}

                            <hr className="my-3" />

                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900">Total:</span>
                                <span className="text-lg font-bold text-blue-600">
                                    {formatCurrency(booking.totalAmount || booking.total_amount || 0)}
                                </span>
                            </div>

                            <div className="flex items-center justify-center mt-4">
                                {isPaid ? (
                                    <div className="flex items-center text-green-600">
                                        <CheckIcon className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Payment Completed</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-yellow-600">
                                        <ClockIcon className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Payment Pending</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {canPay && (
                                <Button
                                    onClick={handlePayment}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    Complete Payment
                                </Button>
                            )}

                            {canSelectCleaner && (
                                <Button
                                    onClick={handleSelectCleaner}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    Select Cleaner
                                </Button>
                            )}

                            {isCompleted && !booking.review && (
                                <Button variant="outline" className="w-full">
                                    Leave Review
                                </Button>
                            )}

                            <Link to="/customer/bookings">
                                <Button variant="outline" className="w-full">
                                    View All Bookings
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Cancel Booking Dialog */}
            {showCancelDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900">
                                Cancel Booking
                            </h3>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to cancel this booking? This action cannot be undone.
                            {isPaid && " Your payment will be refunded according to our cancellation policy."}
                        </p>

                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelDialog(false)}
                                className="flex-1"
                                disabled={canceling}
                            >
                                Keep Booking
                            </Button>
                            <Button
                                onClick={handleCancelBooking}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                disabled={canceling}
                            >
                                {canceling ? "Cancelling..." : "Cancel Booking"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetails;
