import React, { useEffect } from 'react';

const Drawer = ({ 
  show, 
  onClose, 
  title, 
  subtitle,
  width = '35%',
  backgroundClose = true,
  children,
  footer
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && show) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={(e) => {
        if (backgroundClose && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="body-theme h-full shadow-xl z-70  pt-5"
        style={{ width }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 pt-3">
            <div className="flex items-start space-x-4">

              <div className="flex-1">
                {title && (
                  <h4 className="text-lg font-medium ">
                    {title}
                  </h4>
                )}
                {subtitle && (
                  <p className="text-sm  mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-4 px-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-gray-200 flex-shrink-0">
                {footer}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;