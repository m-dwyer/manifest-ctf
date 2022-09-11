import Header from "@/base/components/Header";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * @group unit
 * @group components
 */
describe("Header", () => {
  it("renders", () => {
    render(<Header />);
    expect(screen.getByText("ManifestCTF")).toBeInTheDocument();
  });
});
