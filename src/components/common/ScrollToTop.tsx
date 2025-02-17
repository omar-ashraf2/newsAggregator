import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  page?: number;
  behavior?: ScrollBehavior;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({
  page,
  behavior = "smooth",
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 480, behavior });
  }, [pathname, page, behavior]);

  return null;
};

export default ScrollToTop;
