import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <svg
        className="w-16 h-16 text-red-500 mb-4 animate-pulse"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.88-13h1.75v6.75h-1.75V7zm0 8.25h1.75v1.75h-1.75v-1.75z" />
      </svg>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-foreground">
            Page not found or an error occurred.
          </p>
        </div>
      </div>
      <Link
        to="/"
        className="bg-destructive hover:bg-destructive/80 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
