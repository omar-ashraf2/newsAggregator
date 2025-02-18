import { mockApiResponse } from "@/__tests__/utils/mockApi";
import { renderWithProviders } from "@/__tests__/utils/testUtils";
import Home from "@/pages/Home";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockArticles } from "../utils/mockData";

describe("Home Page", () => {
  it("renders the main header", () => {
    renderWithProviders(<Home />);
    expect(screen.getByText("Get Informed")).toBeInTheDocument();
    expect(screen.getByText("Stories Curated For You")).toBeInTheDocument();
  });

  it("displays pagination when articles exist", async () => {
    await mockApiResponse(mockArticles);
    renderWithProviders(<Home />);

    await waitFor(() => {
      console.log("Articles count:", screen.queryAllByRole("article").length);
    });

    await waitFor(() => {
      console.log("Full DOM Output:");
      console.log(screen.debug());
    });

    await waitFor(
      () => {
        const navigation = screen.queryByRole("navigation");
        expect(navigation).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
