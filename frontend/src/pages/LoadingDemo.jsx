import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Spinner,
  PulseLoader,
  DotsLoader,
  WaveLoader,
  SkeletonLine,
  SkeletonCircle,
  LoadingCard,
  LoadingGrid,
  LoadingStatsCard,
  LoadingSearchResults,
  LoadingOverlay,
} from "../components/ui/Loading";
import Button from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";

const LoadingDemo = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({});

  const handleButtonDemo = (type) => {
    setButtonLoading((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setButtonLoading((prev) => ({ ...prev, [type]: false }));
    }, 3000);
  };

  const handleOverlayDemo = () => {
    setShowOverlay(true);
    setTimeout(() => {
      setShowOverlay(false);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 relative">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Modern Loading Effects Demo
        </h1>
        <p className="text-gray-600">
          Showcase of all available loading components and animations
        </p>
      </div>

      {/* Basic Spinners */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Loading Spinners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <Spinner />
              <p className="mt-2 text-sm text-gray-600">Default Spinner</p>
            </div>
            <div className="text-center">
              <Spinner variant="large" />
              <p className="mt-2 text-sm text-gray-600">Large Spinner</p>
            </div>
            <div className="text-center">
              <Spinner variant="small" />
              <p className="mt-2 text-sm text-gray-600">Small Spinner</p>
            </div>
            <div className="text-center">
              <Spinner variant="dots" />
              <p className="mt-2 text-sm text-gray-600">Dots Variant</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Loaders */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Loading Animations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <PulseLoader />
              <p className="mt-2 text-sm text-gray-600">Pulse Loader</p>
            </div>
            <div className="text-center">
              <DotsLoader />
              <p className="mt-2 text-sm text-gray-600">Dots Loader</p>
            </div>
            <div className="text-center">
              <WaveLoader />
              <p className="mt-2 text-sm text-gray-600">Wave Loader</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Loading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <SkeletonCircle size="large" />
              <div className="flex-1 space-y-2">
                <SkeletonLine width="75%" />
                <SkeletonLine width="50%" />
                <SkeletonLine width="60%" />
              </div>
            </div>
            <div className="space-y-2">
              <SkeletonLine width="100%" />
              <SkeletonLine width="85%" />
              <SkeletonLine width="95%" />
              <SkeletonLine width="70%" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Card Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingCard variant="default" />
            <LoadingCard variant="compact" />
            <LoadingCard variant="detailed" />
            <LoadingCard variant="form" />
            <LoadingCard variant="services" />
            <LoadingCard variant="booking" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Stats Loading</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingGrid columns={3} gap="md">
            <LoadingStatsCard />
            <LoadingStatsCard />
            <LoadingStatsCard />
          </LoadingGrid>
        </CardContent>
      </Card>

      {/* Search Results Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results Loading</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSearchResults count={5} />
        </CardContent>
      </Card>

      {/* Button Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Button Loading States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              loading={buttonLoading.spinner}
              loadingVariant="spinner"
              loadingText="Loading..."
              onClick={() => handleButtonDemo("spinner")}
              className="w-full"
            >
              Spinner Loading
            </Button>
            <Button
              loading={buttonLoading.dots}
              loadingVariant="dots"
              loadingText="Processing..."
              onClick={() => handleButtonDemo("dots")}
              className="w-full"
              variant="secondary"
            >
              Dots Loading
            </Button>
            <Button
              loading={buttonLoading.pulse}
              loadingVariant="pulse"
              loadingText="Saving..."
              onClick={() => handleButtonDemo("pulse")}
              className="w-full"
              variant="outline"
            >
              Pulse Loading
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overlay Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Overlay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Button onClick={handleOverlayDemo} className="w-full md:w-auto">
              Show Loading Overlay (3s)
            </Button>
            <p className="mt-2 text-sm text-gray-600">
              Demonstrates a full-screen loading overlay
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Golden Yellow Loading Theme */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800">
            Consistent Golden Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <p className="text-amber-700 mb-4">
              All loading indicators use a consistent golden yellow color scheme
              for a unified, elegant user experience throughout the application.
            </p>
            <div className="flex justify-center space-x-4">
              <DotsLoader />
              <PulseLoader />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Links */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">
              Explore More Demos
            </h3>
            <div className="space-y-3">
              <div>
                <Link
                  to="/image-gallery-demo"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Image Lazy Loading Demo
                </Link>
              </div>
              <div>
                <Link
                  to="/ai-demo"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View AI Matching Demo
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Performance Tips
              </h3>
              <p className="mt-1 text-sm text-blue-800">
                These loading effects use CSS animations and are optimized for
                performance. Skeleton loading is preferred for content that has
                a predictable structure, while spinners work well for
                unpredictable loading times.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      {showOverlay && (
        <LoadingOverlay
          message="Processing your request..."
          variant="spinner"
        />
      )}
    </div>
  );
};

export default LoadingDemo;
