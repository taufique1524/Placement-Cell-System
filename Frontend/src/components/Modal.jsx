import React from "react";

function Modal({ isOpen, onClose, title = "", children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {title && <div className="text-xl font-semibold mb-4 text-blue-900">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal; 