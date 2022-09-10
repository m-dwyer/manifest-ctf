import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// The root under which modals will be mounted in the DOM
export const ModalRoot = ({ wrapperId = "modal-root" }) => {
  return <div id={wrapperId}></div>;
};

const Modal: React.FC<{
  wrapperId?: string;
  handleDismiss?: () => void;
  children: React.ReactNode;
}> = ({ wrapperId = "modal-root", handleDismiss, children }) => {
  const modalRef = useRef<HTMLElement | null>(null);

  if (!modalRef.current) {
    modalRef.current = document.createElement("div");
  }

  useEffect(() => {
    // Append our ref to the modal root
    const modalWrapper = document.getElementById(wrapperId);
    if (modalRef.current) modalWrapper?.appendChild(modalRef.current);

    // Clean up -- remove out ref  from modal root
    return () => {
      if (modalRef.current) modalWrapper?.removeChild(modalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return modalRef.current
    ? createPortal(
        <div id="modal" className="modal modal-open" onClick={handleDismiss}>
          <div className="modal-box">{children}</div>
        </div>,
        modalRef.current
      )
    : null;
};

export default Modal;
