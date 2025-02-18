import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ArticleList from "@/components/ArticleList";
import { mockArticles } from "@/__tests__/utils/mockData";

describe("ArticleList Component", () => {
  it("renders correct number of articles", () => {
    render(
      <MemoryRouter>
        <ArticleList articles={mockArticles} />
      </MemoryRouter>
    );

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(mockArticles.length);
  });

  it("passes correct props to ArticleCards", () => {
    render(
      <MemoryRouter>
        <ArticleList articles={mockArticles} />
      </MemoryRouter>
    );

    mockArticles.forEach((article) => {
      expect(screen.getByText(article.title)).toBeInTheDocument();
      expect(screen.getByText(article.description)).toBeInTheDocument();
    });
  });
});
