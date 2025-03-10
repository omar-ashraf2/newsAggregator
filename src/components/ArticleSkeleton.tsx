/**
 * ArticleSkeleton.tsx
 *
 * Shows a placeholder skeleton for an article card while loading.
 */
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ArticleSkeleton = memo(() => {
  return (
    <div
      className="backdrop-blur-md border border-border rounded-xl shadow-lg p-4"
      data-testid="article-skeleton"
    >
      <Skeleton height={200} />
      <h2 className="text-xl font-semibold my-2">
        <Skeleton width="80%" />
      </h2>
      <p className="text-muted-foreground">
        <Skeleton count={3} />
      </p>
      <small className="text-muted-foreground">
        <Skeleton width="40%" />
      </small>
    </div>
  );
});

ArticleSkeleton.displayName = "ArticleSkeleton";
export default ArticleSkeleton;
