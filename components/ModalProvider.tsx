import React, { createContext, useState } from "react";
import Modal from "./Modal";

type ModalState = {
  modal: boolean;
  title?: string | null;
  text?: string | null;
};

type ModalContextType = {
  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;
};

export const ModalContext = createContext<ModalContextType>({
  modalState: { modal: false },
  setModalState: () => {},
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalState, setModalState] = useState<ModalState>({
    modal: false,
  } as ModalState);

  return (
    <ModalContext.Provider value={{ modalState, setModalState }}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};
