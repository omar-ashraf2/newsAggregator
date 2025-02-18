/**
 * BackToTopButton.tsx
 *
 * Shows a button after scrolling down 300px. Clicking it scrolls to the top.
 */

import { ArrowUpIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";

const BackToTopButton = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollUp}
      className="fixed bottom-6 right-6 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition"
      aria-label="Back to top"
    >
      <ArrowUpIcon />
    </button>
  );
});

BackToTopButton.displayName = "BackToTopButton";
export default BackToTopButton;
