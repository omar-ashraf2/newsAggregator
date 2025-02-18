/**
 * Navbar.tsx
 *
 * Displays a navigation bar with a brand logo and the theme toggle.
 */

import { memo } from "react";
import { Link } from "react-router-dom";
import ModeToggle from "./ModeToggle";

const Navbar = memo(() => {
  return (
    <nav className="bg-background shadow-lg z-10 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
          <Link
            to="/"
            className="text-3xl font-extrabold text-[#811211] tracking-widest"
          >
            NexaNews
          </Link>
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
