import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, ChevronDown } from 'lucide-react';

const UserDropdown = ({ selectedSection, setSelectedSection }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => setOpen(!open);

  const handleSelect = (value) => {
    setSelectedSection(value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div
        onClick={handleToggle}
        className="flex h-[40px] px-3 py-2 gap-2 rounded-lg border border-[#DFE1E6] shadow cursor-pointer"
      >
        <UserPlus size={18} className="text-[#3EBF0F]" />
        <span className="text-sm capitalize">{selectedSection || 'Select'}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div className="body-theme absolute mt-2 z-1 w-40 border border-[#DFE1E6] rounded-lg shadow-lg p-2 space-y-2">
          {['messages', 'tasks', 'users'].map((item) => (
            <div
              key={item}
              onClick={() => handleSelect(item)}
              className="hover:bg-gray-900 px-3 py-2 rounded cursor-pointer text-sm capitalize"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
