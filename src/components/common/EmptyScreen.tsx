/**
 * EmptyScreen.tsx
 *
 * A simple component to show a "no results" or "empty" state.
 */

import { memo } from "react";

interface EmptyScreenProps {
  message: string;
}

const EmptyScreen = memo<EmptyScreenProps>(({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-400px)] bg-background">
      <div className="w-32 h-32 mb-4">
        <svg
          className="w-full h-full text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
        >
          <rect
            width="64"
            height="64"
            rx="8"
            fill="currentColor"
            opacity="0.1"
          />
          <path
            d="M20 30h24M20 38h24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M32 20v24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-primary">
        {message || "No Results Found"}
      </h2>
      <p className="mt-2 text-muted-foreground text-center px-4">
        Try adjusting your search or filter criteria to find what you're looking
        for.
      </p>
    </div>
  );
});

EmptyScreen.displayName = "EmptyScreen";
export default EmptyScreen;
