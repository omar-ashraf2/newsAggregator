import { useNavigate } from "react-router-dom";
import { Article } from "@/types/Article";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${encodeURIComponent(article.id)}`, {
      state: { article },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-card rounded shadow p-4 cursor-pointer hover:shadow-lg transition"
    >
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover rounded mb-2"
        />
      )}
      <h2 className="text-xl font-semibold text-foreground">{article.title}</h2>
      <p className="my-2 text-muted-foreground">{article.description}</p>
      <small className="text-muted-foreground">
        {article.source} - {new Date(article.publishedAt).toLocaleDateString()}
      </small>
    </div>
  );
};

export default ArticleCard;
