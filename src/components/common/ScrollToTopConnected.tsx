/**
 * ScrollToTopConnected.tsx
 *
 * Connects the page state from Redux to ScrollToTop,
 * so changing pages triggers a scroll.
 */

import { RootState } from "@/app/store";
import { memo } from "react";
import { useSelector } from "react-redux";
import ScrollToTop from "./ScrollToTop";

const ScrollToTopConnected = memo(() => {
  const page = useSelector((state: RootState) => state.filters.page);
  return <ScrollToTop page={page} />;
});

ScrollToTopConnected.displayName = "ScrollToTopConnected";
export default ScrollToTopConnected;
