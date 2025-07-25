import React from "react";
import LazyImage from "./LazyImage";
import ServiceImage from "./ServiceImage";
import ImageSkeleton from "./ImageSkeleton";

const LazyLoadingDemo = () => {
  const demoServices = [
    {
      id: 1,
      name: "House Cleaning",
      popular: true,
      premium: false,
      emergency: false,
    },
    {
      id: 2,
      name: "Office Cleaning",
      popular: false,
      premium: true,
      emergency: false,
    },
    {
      id: 3,
      name: "Emergency Cleaning",
      popular: false,
      premium: false,
      emergency: true,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Lazy Loading Components Demo
        </h1>
        <p className="text-gray-600">
          Scroll down to see the lazy loading and skeleton loaders in action
        </p>
      </div>

      {/* Basic LazyImage Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Basic Lazy Images
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <LazyImage
                src={`/services/${service.id}/${service.name}.png`}
                alt={service.name}
                aspectRatio="w-full h-48"
                className="hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-gray-600">
                  Basic lazy loaded image with skeleton
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ServiceImage Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Service Images with Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-lg shadow-md overflow-hidden"
            >
              <ServiceImage
                serviceName={service.name}
                src={`/services/${service.id}/${service.name}.png`}
                service={service}
                showBadges={true}
              />
              <div className="p-4">
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-gray-600">
                  Service image with overlay badges
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skeleton Loader Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Skeleton Loaders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
            <ImageSkeleton aspectRatio="w-full h-48" className="mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
            <ImageSkeleton aspectRatio="w-full h-32" className="mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
            <ImageSkeleton aspectRatio="aspect-square" className="mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Tips */}
      <section className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Performance Features
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            ✅ <strong>Intersection Observer:</strong> Images load only when
            they enter the viewport
          </li>
          <li>
            ✅ <strong>Skeleton Loaders:</strong> Provide visual feedback while
            images load
          </li>
          <li>
            ✅ <strong>Fade Transitions:</strong> Smooth transition from
            skeleton to loaded image
          </li>
          <li>
            ✅ <strong>Error Handling:</strong> Graceful fallback when images
            fail to load
          </li>
          <li>
            ✅ <strong>Native Lazy Loading:</strong> Browser-native lazy loading
            as backup
          </li>
          <li>
            ✅ <strong>Optimized Loading:</strong> Images start loading 100px
            before entering viewport
          </li>
          <li>
            ✅ <strong>Accessibility:</strong> Proper alt text and semantic HTML
            structure
          </li>
        </ul>
      </section>
    </div>
  );
};

export default LazyLoadingDemo;
