import React from "react";

const ImageSkeleton = ({ className = "", aspectRatio = "aspect-[4/3]" }) => {
  return (
    <div
      className={`bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 animate-pulse rounded-xl ${aspectRatio} ${className} relative overflow-hidden`}
    >
      {/* Loading icon */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2 text-slate-400">
          <svg
            className="w-8 h-8 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div className="w-12 h-1 bg-slate-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ImageSkeleton;
