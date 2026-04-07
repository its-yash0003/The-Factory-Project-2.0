const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-surface rounded-lg shadow-card overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-gray-200" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-8 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
