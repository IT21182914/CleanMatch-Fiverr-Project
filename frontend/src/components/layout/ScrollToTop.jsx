import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component that scrolls to top on route changes
 * This ensures that whenever the user navigates to a new page,
 * the page starts from the top rather than maintaining the previous scroll position
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top with multiple methods for maximum compatibility
    const scrollToTop = () => {
      // Method 1: Standard window scroll
      window.scrollTo(0, 0);

      // Method 2: Document elements
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Method 3: Target the main content area specifically
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.scrollTop = 0;
      }

      // Method 4: Find all potentially scrollable containers
      const scrollableElements = document.querySelectorAll(
        "[data-scroll-container], .overflow-y-auto, .overflow-auto, .min-h-screen"
      );
      scrollableElements.forEach((element) => {
        if (element.scrollTop !== undefined) {
          element.scrollTop = 0;
        }
      });

      // Method 5: Target any div with scroll
      const divsWithScroll = document.querySelectorAll("div");
      divsWithScroll.forEach((div) => {
        if (div.scrollHeight > div.clientHeight) {
          div.scrollTop = 0;
        }
      });
    };

    // Execute immediately
    scrollToTop();

    // Execute with requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      scrollToTop();
    });

    // Execute with slight delay to ensure DOM is ready
    setTimeout(scrollToTop, 10);

    // Execute with longer delay as backup
    setTimeout(scrollToTop, 100);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
