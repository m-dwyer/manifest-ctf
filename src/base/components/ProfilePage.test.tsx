import ProfilePage from "./ProfilePage";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock("@/base/queries/profile", () => ({
  __esModule: true,
  useFetchProfileOverview: null,
}));
import * as mockFetchProfileQuery from "@/base/queries/profile";

/**
 * @group unit
 * @group components
 */
describe("ProfilePage", () => {
  it("renders", () => {
    window.ResizeObserver = ResizeObserver;
    const mockUseFetchProfileOverviewQuery = mockFetchProfileQuery as {
      useFetchProfileOverview: unknown;
    };
    mockUseFetchProfileOverviewQuery.useFetchProfileOverview = () => ({
      data: {
        id: 1,
        attemptsByPeriod: {
          "2023-01-01": 100,
          "2023-01-02": 200,
          "2023-01-03": 300,
        },
      },
    });

    render(<ProfilePage />);

    const canvas = screen.getByTestId("canvas");

    const periodButtonWeek = screen.getByText("1W");
    const periodButtonMonth = screen.getByText("1M");
    const periodButtonQuarter = screen.getByText("3M");
    const periodButtonYear = screen.getByText("1Y");

    expect(periodButtonWeek).toBeInTheDocument();
    expect(periodButtonMonth).toBeInTheDocument();
    expect(periodButtonQuarter).toBeInTheDocument();
    expect(periodButtonYear).toBeInTheDocument();

    expect(canvas).toBeInTheDocument();
  });
});
