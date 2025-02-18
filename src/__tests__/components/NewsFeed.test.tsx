import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NewsFeed from "@/components/NewsFeed";
import { mockArticles } from "@/__tests__/utils/mockData";

describe("NewsFeed Component", () => {
  it("renders article list correctly", () => {
    render(
      <MemoryRouter>
        <NewsFeed articles={mockArticles} isLoading={false} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("article")).toHaveLength(mockArticles.length);
  });
});
