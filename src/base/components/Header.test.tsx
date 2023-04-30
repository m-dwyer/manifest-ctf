import Header from "@/base/components/Header";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useSession } from "next-auth/react";
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: "foo@bar.com" },
};
jest.mock("next-auth/react", () => ({
  __esModule: true,
  useSession: jest.fn(() => {
    return { data: mockSession, status: "authenticated" };
  }),
}));

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
