import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook for lazy loading data with pagination
 */
export const useLazyData = (
  fetchFunction,
  { pageSize = 10, threshold = 0.1, initialLoad = true, dependencies = [] } = {}
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const loadingRef = useRef(false);
  const observerRef = useRef();

  const loadData = useCallback(
    async (pageNum = 1, reset = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFunction({
          page: pageNum,
          limit: pageSize,
          offset: (pageNum - 1) * pageSize,
        });

        const newData = result.data || result;
        const totalCount = result.total || result.count;

        setData((prevData) => {
          if (reset || pageNum === 1) {
            return newData;
          }
          return [...prevData, ...newData];
        });

        setHasMore(
          totalCount
            ? pageNum * pageSize < totalCount
            : newData.length === pageSize
        );

        setPage(pageNum);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [fetchFunction, pageSize]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadData(page + 1, false);
    }
  }, [loadData, loading, hasMore, page]);

  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    loadData(1, true);
  }, [loadData]);

  // Intersection Observer for infinite scroll
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore, threshold]
  );

  useEffect(() => {
    if (initialLoad) {
      loadData(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    lastElementRef,
    page,
  };
};

/**
 * Hook for lazy loading images with intersection observer
 */
export const useLazyImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  const { threshold = 0.1, rootMargin = "50px" } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  return {
    imgRef,
    isLoaded,
    isInView,
    error,
    handleLoad,
    handleError,
    shouldLoad: isInView,
  };
};

/**
 * Hook for lazy loading components based on scroll position
 */
export const useLazyComponent = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return [elementRef, isVisible];
};

/**
 * Hook for preloading routes/components
 */
export const usePreload = () => {
  const preloadedComponents = useRef(new Set());

  const preloadComponent = useCallback(async (importFunction) => {
    if (preloadedComponents.current.has(importFunction)) {
      return;
    }

    try {
      await importFunction();
      preloadedComponents.current.add(importFunction);
    } catch (error) {
      console.warn("Failed to preload component:", error);
    }
  }, []);

  const preloadRoute = useCallback((routeImport) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = routeImport;
    document.head.appendChild(link);
  }, []);

  return { preloadComponent, preloadRoute };
};

export default {
  useLazyData,
  useLazyImage,
  useLazyComponent,
  usePreload,
};
