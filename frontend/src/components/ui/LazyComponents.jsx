import React, { useMemo } from "react";
import { useLazyData, useLazyComponent } from "../../hooks/useLazyLoading";
import { LoadingCard, LoadingGrid } from "./Loading";

/**
 * Lazy loading list component with virtual scrolling support
 */
export const LazyList = ({
  fetchFunction,
  renderItem,
  renderLoading = () => <LoadingCard variant="compact" />,
  renderError = (error) => (
    <div className="text-center py-8">
      <p className="text-red-600">{error}</p>
    </div>
  ),
  renderEmpty = () => (
    <div className="text-center py-8">
      <p className="text-gray-600">No items found</p>
    </div>
  ),
  pageSize = 10,
  className = "",
  itemClassName = "",
  loadingCount = 3,
  ...options
}) => {
  const { data, loading, error, hasMore, lastElementRef, refresh } =
    useLazyData(fetchFunction, { pageSize, ...options });

  const items = useMemo(() => {
    return data.map((item, index) => {
      const isLast = index === data.length - 1;
      return (
        <div
          key={item.id || index}
          ref={isLast ? lastElementRef : null}
          className={itemClassName}
        >
          {renderItem(item, index)}
        </div>
      );
    });
  }, [data, renderItem, itemClassName, lastElementRef]);

  if (error) {
    return (
      <div className={className}>
        {renderError(error)}
        <div className="text-center mt-4">
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0 && !loading) {
    return <div className={className}>{renderEmpty()}</div>;
  }

  return (
    <div className={className}>
      {items}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: loadingCount }).map((_, index) => (
            <div key={`loading-${index}`}>{renderLoading()}</div>
          ))}
        </div>
      )}
      {!hasMore && data.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No more items to load
        </div>
      )}
    </div>
  );
};

/**
 * Lazy loading grid component
 */
export const LazyGrid = ({
  fetchFunction,
  renderItem,
  columns = 3,
  gap = "md",
  ...props
}) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const gridClassName = `grid ${gridClasses[columns] || gridClasses[3]} ${
    gapClasses[gap] || gapClasses.md
  }`;

  return (
    <LazyList
      {...props}
      fetchFunction={fetchFunction}
      renderItem={renderItem}
      className={gridClassName}
      renderLoading={() => (
        <LoadingGrid columns={columns} gap={gap}>
          {Array.from({ length: columns }).map((_, index) => (
            <LoadingCard key={index} variant="compact" />
          ))}
        </LoadingGrid>
      )}
    />
  );
};

/**
 * Lazy loading section that loads when visible
 */
export const LazySection = ({
  children,
  fallback = <LoadingCard variant="detailed" />,
  threshold = 0.1,
  className = "",
  once = true,
}) => {
  const [ref, isVisible] = useLazyComponent(threshold);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    if (isVisible && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isVisible, hasLoaded]);

  const shouldRender = once ? hasLoaded : isVisible;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
};

/**
 * Lazy loading card for individual items
 */
export const LazyCard = ({
  children,
  loading = false,
  error = null,
  loadingComponent = <LoadingCard variant="compact" />,
  errorComponent = null,
  className = "",
}) => {
  if (loading) {
    return <div className={className}>{loadingComponent}</div>;
  }

  if (error) {
    return (
      <div className={className}>
        {errorComponent || (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

/**
 * Infinite scroll trigger component
 */
export const InfiniteScrollTrigger = ({
  onTrigger,
  loading = false,
  hasMore = true,
  threshold = 0.1,
  loadingComponent = (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>
  ),
  endComponent = (
    <div className="text-center py-4 text-gray-500 text-sm">
      No more items to load
    </div>
  ),
}) => {
  const [ref, isVisible] = useLazyComponent(threshold);

  React.useEffect(() => {
    if (isVisible && hasMore && !loading) {
      onTrigger();
    }
  }, [isVisible, hasMore, loading, onTrigger]);

  if (!hasMore) {
    return endComponent;
  }

  return <div ref={ref}>{loading ? loadingComponent : null}</div>;
};

export default {
  LazyList,
  LazyGrid,
  LazySection,
  LazyCard,
  InfiniteScrollTrigger,
};
