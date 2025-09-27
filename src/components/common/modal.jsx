import React from 'react';

/**
 * A reusable modal component that displays content in an overlay.
 * @param {object} props
 *- @param {string} props.title - The title to display at the top of the modal.
- * @param {React.ReactNode} props.children - The content to display inside the modal.
- * @param {function(): void} props.onClose - A function to call when the modal's backdrop is clicked (optional).
 */
const Modal = ({ title, children, onClose }) => {
  // We stop propagation on the modal content itself so that clicking inside it
  // doesn't trigger the onClose event for the backdrop.
  const handleContentClick = (e) => e.stopPropagation();

  return (
    // The backdrop covers the entire screen with a semi-transparent overlay.
    // Clicking it will trigger the onClose function if provided.
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;