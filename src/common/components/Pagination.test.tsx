import Pagination from "@/common/components/Pagination";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-test-renderer";
import singletonRouter from "next/router";

describe("Pagination", () => {
  it("renders", () => {
    const mockSetFrom = jest.fn();
    const mockSetTo = jest.fn();

    render(
      <Pagination
        pathName="/foo"
        setFrom={mockSetFrom}
        setTo={mockSetTo}
        total={15}
        perPage={5}
      />
    );

    const pageButtons = screen.getAllByRole("button");
    expect(pageButtons.length).toBe(3);
    expect(pageButtons[0]).toHaveTextContent("1");
    expect(pageButtons[1]).toHaveTextContent("2");
    expect(pageButtons[2]).toHaveTextContent("3");
  });

  it("links to the correct page", async () => {
    const mockSetFrom = jest.fn();
    const mockSetTo = jest.fn();

    render(
      <Pagination
        pathName="/foo"
        setFrom={mockSetFrom}
        setTo={mockSetTo}
        total={15}
        perPage={5}
      />
    );

    const pageButtons = screen.getAllByRole("button");

    act(() => {
      fireEvent.click(pageButtons[2]);
    });

    await waitFor(() => {
      expect(singletonRouter).toMatchObject({ asPath: "/foo?page=3" });
    });
  });
});
