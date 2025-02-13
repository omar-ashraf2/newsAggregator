import { useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage";

interface LocationState {
  article?: {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    publishedAt: string;
    source: string;
  };
}

const ArticleDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state?.article) {
    return <ErrorMessage message="Article details not found." />;
  }

  const { article } = state;

  return (
    <div className="min-h-screen bg-background p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Back
      </button>
      <div className="bg-card rounded shadow p-6">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-96 object-cover rounded mb-4"
          />
        )}
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          {article.title}
        </h1>
        <small className="text-muted-foreground">
          {article.source} -{" "}
          {new Date(article.publishedAt).toLocaleDateString()}
        </small>
        <p className="mt-4 text-lg text-foreground">{article.description}</p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Read full article on source site
        </a>
      </div>
    </div>
  );
};

export default ArticleDetail;
