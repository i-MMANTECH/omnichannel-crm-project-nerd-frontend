import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showFooter = true,
  width = "500px",
  showBorder = true,
  footer
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div 
        className="body-theme dark:border rounded-lg shadow-lg w-full flex flex-col"
        style={{ 
          maxWidth: width,
          maxHeight: 'calc(100vh - 2rem)' // Leave some padding at top and bottom
        }}
      >
        {/* Header - fixed at top */}
        <div className={`flex justify-between items-center w-full py-2 px-5 ${showBorder ? 'border-b border-[#DFE1E6]' : ''}`}>
          <p className="font-encode-sans text-lg font-medium leading-[24px] tracking-[0.2px] flex items-center">
            {title}
          </p>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FontAwesomeIcon 
              icon={faXmark} 
              className="w-5 h-5" 
            />
          </button>
        </div>

        {/* Body - scrollable */}
        <div className="px-6 pt-6 pb-6 overflow-y-auto flex-grow">
          {children}
        </div>

        {/* Footer - fixed at bottom */}
        {showFooter && (
          <div className="px-6 py-6 flex justify-end gap-3 border-t border-[#DFE1E6] mt-auto">
            {footer}
          </div>
        )}
      </div>

      {/* Backdrop click handler */}
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
};

export default Modal;