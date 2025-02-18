import guardianLogo from "@/assets/guardianLogo.png";
import newsApiLogo from "@/assets/newsLogo.png";
import nytLogo from "@/assets/nytLogo.png";
import { getTimeAgo } from "@/lib/dateUtils";
import { Article } from "@/types/Article";
import { ArrowRightIcon } from "lucide-react";

const sourceLogos: Record<string, string> = {
  "New York Times": nytLogo,
  "The Guardian": guardianLogo,
  NewsApi: newsApiLogo,
};

const ArticleHeader: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="flex-1 space-y-3 order-1 md:order-2">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold leading-snug text-primary">
        {article.title}
      </h2>

      <div className="flex items-center gap-2 text-sm font-light">
        <img
          src={sourceLogos[article.source]}
          alt={article.source}
          title={article.source}
          loading="lazy"
          className="h-8 w-8 object-contain dark:invert"
        />
        <span className="text-amber-400 font-medium">{article.source}</span>
        <span className="text-gray-500">•</span>
        <span className="text-muted-foreground">
          {getTimeAgo(article.publishedAt)}
        </span>
      </div>

      {article.publisher !== "Unknown" && (
        <p className="text-sm italic text-sky-400">By {article.publisher}</p>
      )}

      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
        {article.description}
      </p>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm md:text-base font-semibold px-6 py-3 rounded-lg shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 text-gray-900 hover:from-orange-600 hover:to-amber-500 transition-transform duration-300 hover:scale-105"
      >
        Read Full Article
        <ArrowRightIcon className="w-5 h-5" />
      </a>
    </div>
  );
};

export default ArticleHeader;
