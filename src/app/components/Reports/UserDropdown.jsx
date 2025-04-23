import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, ChevronDown } from 'lucide-react';

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="body-theme relative inline-block text-left">
      <div
        onClick={handleToggle}
        className="flex h-[40px] w-fit px-[12px] py-[8px] justify-center items-center gap-2 rounded-[10px] border border-[#DFE1E6] body-theme shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] cursor-pointer"
      >
        <UserPlus size={18} className="text-[#3EBF0F]" />
        <span className="text-sm">Users</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <div className="body-theme absolute mt-2 z-1 w-40 border border-[#DFE1E6] rounded-lg shadow-lg p-2 space-y-2">
            <div className="hover:bg-gray-900 px-3 py-2 rounded cursor-pointer text-sm">Under maintenance</div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
