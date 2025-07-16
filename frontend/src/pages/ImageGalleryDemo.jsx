import React from "react";
import { LazyImage } from "../components/hoc/LazyLoader";
import { LazySection, LazyGrid } from "../components/ui/LazyComponents";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";

const ImageGalleryDemo = () => {
  // Sample images for demonstration
  const sampleImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      alt: "Modern living room cleaning",
      title: "Living Room Deep Clean",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
      alt: "Kitchen cleaning service",
      title: "Kitchen Sanitization",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      alt: "Bathroom cleaning",
      title: "Bathroom Deep Clean",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400",
      alt: "Office cleaning",
      title: "Office Cleaning Service",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400",
      alt: "Window cleaning",
      title: "Window Cleaning",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
      alt: "Carpet cleaning",
      title: "Carpet Cleaning",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lazy Loading Images Demo
        </h1>
        <p className="text-gray-600">
          Images load only when they come into view, improving performance
        </p>
      </div>

      {/* Basic Lazy Image */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Lazy Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">With Lazy Loading</h3>
              <LazyImage
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600"
                alt="Clean modern living room"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                placeholder={
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                }
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Regular Image</h3>
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600"
                alt="Clean kitchen"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lazy Section with Images */}
      <LazySection
        threshold={0.3}
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Loading Gallery...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>Lazy Loaded Image Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleImages.map((image) => (
                <div key={image.id} className="group">
                  <LazyImage
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    placeholder={
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-100 rounded-lg">
                        <svg
                          className="w-8 h-8 mb-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs">Loading...</span>
                      </div>
                    }
                  />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {image.title}
                  </h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </LazySection>

      {/* Performance Benefits */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-900">
                Performance Benefits
              </h3>
              <div className="mt-1 text-sm text-green-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>Faster initial page load times</li>
                  <li>Reduced bandwidth usage</li>
                  <li>Better Core Web Vitals scores</li>
                  <li>Improved user experience on slow connections</li>
                  <li>Progressive enhancement approach</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scroll down to see more images */}
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Scroll down to see lazy loading in action
        </p>
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* More lazy-loaded content */}
      {Array.from({ length: 5 }).map((_, sectionIndex) => (
        <LazySection
          key={sectionIndex}
          threshold={0.2}
          fallback={
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">
                  Loading section {sectionIndex + 1}...
                </p>
              </div>
            </div>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>Lazy Section {sectionIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleImages.slice(0, 2).map((image, imgIndex) => (
                  <LazyImage
                    key={`${sectionIndex}-${imgIndex}`}
                    src={`${image.src}&sig=${sectionIndex}-${imgIndex}`}
                    alt={`${image.alt} - Section ${sectionIndex + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
              <p className="mt-4 text-gray-600">
                This section was lazy loaded when it came into view. This
                approach helps keep the initial page load fast while still
                providing rich content as users scroll.
              </p>
            </CardContent>
          </Card>
        </LazySection>
      ))}
    </div>
  );
};

export default ImageGalleryDemo;
