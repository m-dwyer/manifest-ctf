import { ModalRoot } from "@/common/components/Modal";
import Modal from "@/common/components/Modal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-test-renderer";

/**
 * @group unit
 * @group components
 */
describe("Modal", () => {
  it("renders", () => {
    const result = render(
      <>
        <ModalRoot />
        <Modal>My text</Modal>
      </>
    );

    const modalRoot = result.container.querySelector("#modal-root");
    const modal = result.container.querySelector("#modal");
    modalRoot?.contains(modal);

    expect(modal?.textContent).toBe("My text");
  });

  it("calls the dismiss handler when dismissed", async () => {
    const mockDismiss = jest.fn();

    render(
      <>
        <ModalRoot />
        <Modal handleDismiss={mockDismiss}>My text</Modal>
      </>
    );

    const dismissModal = screen.getByText("My text");

    act(() => {
      fireEvent.click(dismissModal);
    });

    await waitFor(() => {
      expect(mockDismiss).toBeCalledTimes(1);
    });
  });
});
