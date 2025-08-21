import {
    ArrowLeftIcon,
    CheckCircleIcon,
    StarIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../ui/Card";
import Button from "../ui/Button";
import { formatCurrency } from "../../lib/utils";
import { getServiceImage } from "../../utils/serviceImages";
import LazyImage from "../ui/LazyImage";

const ServiceDetails = ({ service, onBack, onBookNow }) => {
    if (!service) return null;

    return (
        <div className="mx-auto space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Services
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Service Image and Info */}
                <div className="space-y-6">
                    <div className="relative h-80 rounded-lg overflow-hidden">
                        <LazyImage
                            src={getServiceImage(service.name)}
                            alt={service.name}
                            className="w-full h-full object-cover"
                            fallbackSrc="/services/1/House & Apartment Cleaning.png"
                        />
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 pb-4">
                                {service.name}
                            </h3>

                            {service.category && (
                                <span className="inline-block bg-cyan-100 text-cyan-800 text-sm px-3 py-1 rounded-full mb-4">
                                    {service.category}
                                </span>
                            )}

                            <p className="text-gray-600 mb-6">
                                {service.description}
                            </p>

                            {/* Features/What's Included */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">What's Included:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {service.features?.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </div>
                                    )) || [
                                        "Professional cleaning supplies included",
                                        "Insured and bonded cleaners",
                                        "Satisfaction guarantee",
                                        "Flexible scheduling",
                                        "Online booking and payment"
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rating and Reviews */}
                            {service.rating && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-5 w-5 ${i < Math.floor(service.rating)
                                                        ? "text-yellow-400 fill-current"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-lg font-semibold">
                                            {service.rating}
                                        </span>
                                        <span className="text-gray-600">
                                            ({service.review_count || 0} reviews)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Booking Panel */}
                <div className="space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Book This Service</span>
                                <span className="text-2xl font-bold text-cyan-600">
                                    {formatCurrency(service.base_price || service.basePrice || service.price)}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-sm text-gray-600">
                                Starting price - final cost may vary based on location and requirements
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-green-800">Available today</span>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <StarIcon className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-blue-800">Satisfaction guaranteed</span>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <InformationCircleIcon className="h-5 w-5 text-yellow-600" />
                                    <span className="text-sm text-yellow-800">Free rescheduling up to 24h before</span>
                                </div>
                            </div>

                            <Button
                                onClick={onBookNow}
                                className="w-full"
                                size="lg"
                            >
                                Book Now
                            </Button>

                            <div className="text-center text-sm text-gray-500">
                                You won't be charged until after the service is completed
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;
