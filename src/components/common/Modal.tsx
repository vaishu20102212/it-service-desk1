import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;