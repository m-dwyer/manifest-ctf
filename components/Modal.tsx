import { useContext } from "react";
import { ModalContext } from "./ModalProvider";

const Modal = () => {
  const { modalState, setModalState } = useContext(ModalContext);

  const { modal, title, text } = modalState;

  const handleDismiss = () => {
    setModalState({ modal: false });
  };

  if (modal) {
    return (
      <div className="modal modal-open" onClick={handleDismiss}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{text}</p>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Modal;
