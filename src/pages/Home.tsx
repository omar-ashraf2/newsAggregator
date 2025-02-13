import NewsFeed from "@/components/NewsFeed";
import Pagination from "@/components/Pagination";
import { useState } from "react";

const Home: React.FC = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-background p-4">
      <NewsFeed page={page} />
      <Pagination currentPage={page} onPageChange={setPage} />
    </div>
  );
};

export default Home;
