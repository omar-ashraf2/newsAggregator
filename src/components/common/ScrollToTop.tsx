/**
 * ScrollToTop.tsx
 *
 * Listens for route changes (pathname) or pagination changes,
 * then scrolls window to a chosen Y offset (100 here) with a smooth behavior.
 */

import { memo, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  page?: number;
  behavior?: ScrollBehavior;
  offsetY?: number;
}

const ScrollToTop = memo<ScrollToTopProps>(
  ({ page, behavior = "smooth", offsetY = 100 }) => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo({ top: offsetY, behavior });
    }, [pathname, page, behavior, offsetY]);

    return null;
  }
);

ScrollToTop.displayName = "ScrollToTop";
export default ScrollToTop;
