import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Zap,
  Target,
  MapPin,
  Star,
  Award,
  TrendingUp,
  Users,
} from "lucide-react";
import Button from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";

const AIMatchingDemo = () => {
  const [demoStep, setDemoStep] = useState(0);

  const demoSteps = [
    {
      title: "Welcome to AI-Powered Cleaner Matching",
      description:
        "Experience the future of cleaning service bookings with our advanced AI matching system.",
      content: (
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Smart. Fast. Accurate.
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Our AI analyzes multiple factors to find the perfect cleaner for
            your needs, prioritizing location, quality, and availability.
          </p>
        </div>
      ),
    },
    {
      title: "ZIP Code Priority Matching",
      description:
        "Local cleaners get priority for faster service and lower costs.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Same ZIP Code</h3>
              <p className="text-sm text-green-600">100% Priority Score</p>
              <p className="text-xs text-gray-500">~2 miles estimated</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Same Area</h3>
              <p className="text-sm text-blue-600">75% Priority Score</p>
              <p className="text-xs text-gray-500">~8 miles estimated</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Users className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold text-yellow-800">Same Region</h3>
              <p className="text-sm text-yellow-600">50% Priority Score</p>
              <p className="text-xs text-gray-500">~15 miles estimated</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">How it works:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • Exact ZIP code matches get highest priority (25% bonus points)
              </li>
              <li>• Same area cleaners (first 3 digits) get second priority</li>
              <li>• Regional matches (first 2 digits) get third priority</li>
              <li>
                • Combined with distance, rating, and availability for final
                score
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "AI Scoring Algorithm",
      description:
        "Multiple factors are analyzed to create the perfect match score.",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              AI Match Score Components (100 points total)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">ZIP Code Proximity</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/4 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600">25 pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Distance Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/5 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600">20 pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Rating</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/5 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600">20 pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Experience Level</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/20 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600">15 pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Job History</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/10 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600">10 pts</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Price Competitiveness</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/10 h-2 bg-teal-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600">10 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Real-Time Availability",
      description:
        "Only cleaners who are actually available for your time slot are shown.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Smart Availability Check
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Real-time schedule verification</li>
                <li>✓ Conflict detection with existing bookings</li>
                <li>✓ Custom availability windows</li>
                <li>✓ Time zone considerations</li>
              </ul>
            </div>
            <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Quality Assurance
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Background check verified</li>
                <li>✓ Insurance coverage confirmed</li>
                <li>✓ Recent performance reviews</li>
                <li>✓ Service area validation</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Pro Tip:</strong> Our AI learns from booking patterns and
              success rates to continuously improve recommendations. The more
              the system is used, the better it gets at predicting the perfect
              cleaner-customer match.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Try AI Matching Now!",
      description: "Experience the future of cleaning service bookings.",
      content: (
        <div className="text-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-lg">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Better Matches</h3>
              <p className="text-sm opacity-90">Higher customer satisfaction</p>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Faster Booking</h3>
              <p className="text-sm opacity-90">Instant cleaner selection</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-4 rounded-lg">
              <Brain className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">AI Powered</h3>
              <p className="text-sm opacity-90">Continuous improvement</p>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/book-ai">
              <Button size="lg" className="w-full md:w-auto px-8">
                Try AI Booking Now
              </Button>
            </Link>
            <p className="text-sm text-gray-600">
              Or use the{" "}
              <Link to="/book" className="text-blue-600 hover:underline">
                standard booking
              </Link>{" "}
              if you prefer
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = demoSteps[demoStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setDemoStep(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === demoStep
                      ? "bg-blue-600 scale-125"
                      : index < demoStep
                      ? "bg-blue-300"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main content */}
          <Card className="min-h-[500px]">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">
                {currentStep.title}
              </CardTitle>
              <p className="text-gray-600">{currentStep.description}</p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {currentStep.content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={() => setDemoStep(Math.max(0, demoStep - 1))}
              disabled={demoStep === 0}
              variant="outline"
            >
              Previous
            </Button>

            <span className="text-sm text-gray-500">
              {demoStep + 1} of {demoSteps.length}
            </span>

            {demoStep < demoSteps.length - 1 ? (
              <Button
                onClick={() =>
                  setDemoStep(Math.min(demoSteps.length - 1, demoStep + 1))
                }
              >
                Next
              </Button>
            ) : (
              <Link to="/book-ai">
                <Button>Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatchingDemo;
