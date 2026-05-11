import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showFooter = true,
  width = "650px",
  showBorder = true,
  footer
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-stretch sm:items-center justify-center z-30 p-0 sm:p-4">
      <div
        className="body-theme dark:border rounded-none sm:rounded-lg shadow-lg flex flex-col w-full sm:w-[var(--modal-w)] h-full sm:h-auto max-w-full max-h-screen sm:max-h-[calc(100vh-2rem)]"
        style={{ '--modal-w': width }}
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