import { mockApiResponse } from "@/__tests__/utils/mockApi";
import { renderWithProviders } from "@/__tests__/utils/testUtils";
import Home from "@/pages/Home";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { mockArticles } from "../utils/mockData";

describe("Home Page", () => {
  beforeEach(() => {
    mockApiResponse(mockArticles);
  });

  it("renders the main header", () => {
    renderWithProviders(<Home />);
    expect(screen.getByText("Get Informed")).toBeInTheDocument();
    expect(screen.getByText("Stories Curated For You")).toBeInTheDocument();
  });

  it("displays pagination when articles exist", async () => {
    mockApiResponse(mockArticles, false, "Error fetching articles", 10, 5);
    renderWithProviders(<Home />);

    await waitFor(() => {
      const articleElements = screen.queryAllByRole("article");
      console.log("Articles count:", articleElements.length);
      expect(articleElements.length).toBeGreaterThan(0);
    });

    await waitFor(
      () => {
        const navigation = screen.queryByRole("navigation", {
          name: /pagination/i,
        });
        console.log("Checking for pagination...");
        expect(navigation).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
