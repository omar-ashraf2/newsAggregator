import { mockArticles } from "@/__tests__/utils/mockData";
import ArticleCard from "@/components/ArticleCard";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ArticleCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders article information correctly", () => {
    const article = mockArticles[0];
    render(
      <MemoryRouter>
        <ArticleCard article={article} />
      </MemoryRouter>
    );

    expect(screen.getByText(article.title)).toBeInTheDocument();
    expect(screen.getByText(article.description)).toBeInTheDocument();
    expect(screen.getByAltText(article.title)).toHaveAttribute(
      "src",
      article.imageUrl
    );
  });

  it("navigates to article detail on click", () => {
    const article = mockArticles[0];
    render(
      <MemoryRouter>
        <ArticleCard article={article} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(article.title));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/article/${encodeURIComponent(article.id)}`,
      {
        state: { article },
      }
    );
  });
});
