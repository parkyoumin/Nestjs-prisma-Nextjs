"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";

type ModalContent = React.ReactNode;

interface ModalContextType {
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = useCallback((content: ModalContent) => {
    setModalContent(content);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isMounted &&
        isOpen &&
        createPortal(
          <Modal isOpen={isOpen} onClose={closeModal}>
            {modalContent}
          </Modal>,
          document.body,
        )}
    </ModalContext.Provider>
  );
}
