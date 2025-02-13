import NewsFeed from "@/components/NewsFeed";
import PaginationControls from "@/components/PaginationControls";
import { useState } from "react";

const Home: React.FC = () => {
  const [page, setPage] = useState(1);

  const totalPages = 10;

  return (
    <div className="min-h-screen bg-background p-4">
      <NewsFeed page={page} />
      <div className="mt-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Home;
