import Header from "@/base/components/Header";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Header", () => {
  it("renders", () => {
    render(<Header />);
    expect(screen.getByText("ManifestCTF")).toBeInTheDocument();
  });
});
