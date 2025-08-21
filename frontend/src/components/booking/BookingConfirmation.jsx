import {
    CheckCircleIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";

const BookingConfirmation = () => {
    return (
        <div className="max-w-md mx-auto text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600">
                    Your cleaning service has been successfully booked. You'll be redirected to payment in a moment.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                    <div className="text-sm text-blue-700 text-left">
                        <p className="font-medium mb-1">What happens next:</p>
                        <ul className="space-y-1">
                            <li>1. Complete your payment</li>
                            <li>2. Receive booking confirmation via email</li>
                            <li>3. Get matched with a qualified cleaner</li>
                            <li>4. Receive a confirmation call 24h before</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
