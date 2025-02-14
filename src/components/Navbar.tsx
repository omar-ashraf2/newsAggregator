import { Link } from "react-router-dom";
import ModeToggle from "./mode-toggle";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-background shadow-md z-10 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-foreground">
          News Aggregator
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary transition"
          >
            Home
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
